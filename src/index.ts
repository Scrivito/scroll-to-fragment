import type * as History from "history";

interface Options {
  getElement?: (fragmentId: string) => Element | undefined;
  history?: History.History;
  scrollIntoView?: (element: Element) => void;
}

export function scrollToFragment(options: Options = {}) {
  unmount();

  currentOptions = {
    getElement: options.getElement ?? getElementById,
    history: options.history,
    scrollIntoView: options.scrollIntoView ?? scrollIntoView,
  };

  mount();
}

function mount() {
  documentObserver = new MutationObserver(handleDomMutation);
  addEventListener("click", handleDocumentClick);
  unlistenHistory = currentOptions.history?.listen(handleHistoryPush);
  startObserving();
}

function unmount() {
  stopObserving();
  removeEventListener("click", handleDocumentClick);
  if (unlistenHistory) unlistenHistory();
  unlistenHistory = undefined;
  documentObserver = undefined;
}

function startObserving() {
  stopObserving();
  if (!location.hash) return;

  STOP_EVENTS.forEach(addStopListener);
  documentObserver?.observe(document, OBSERVER_CONFIG);
  adjustScrollPosition();

  observeTimeout = setTimeout(stopObserving, OBSERVE_TIMEOUT_MS);
}

function stopObserving() {
  clearTimeout(observeTimeout);
  cancelAnimationFrame(throttleRequestId);
  documentObserver?.disconnect();
  STOP_EVENTS.forEach(removeStopListener);
}

function addStopListener(eventName: string) {
  document.addEventListener(eventName, stopObserving);
}

function removeStopListener(eventName: string) {
  document.removeEventListener(eventName, stopObserving);
}

function handleHistoryPush(update: History.Update): void; // history version 5
function handleHistoryPush(
  location: History.Location,
  action: History.Action
): void; // history version 4
function handleHistoryPush(
  update: History.Update & History.Location,
  action?: History.Action
) {
  if ("PUSH" === (action || update.action)) startObserving();
}

function handleDocumentClick(event: Event) {
  if (event.defaultPrevented) return;

  const anchor = closestAIncludingSelf(event.target as HTMLElement);
  if (!anchor || anchor.href.indexOf("#") === -1) return;
  if (anchor.href.replace(/#.*/, "") === location.href.replace(/#.*/, "")) {
    throttle(startObserving);
  }
}

function closestAIncludingSelf(element?: HTMLElement) {
  let target = element;
  while (target && target.nodeName !== "A") target = target.parentElement;
  return target as HTMLAnchorElement | void;
}

function handleDomMutation() {
  throttle(adjustScrollPosition);
}

function adjustScrollPosition() {
  if (!location.hash) return;
  const fragmentId = decodeURIComponent(location.hash.substring(1));
  const element = currentOptions.getElement.call(null, fragmentId);
  if (element) currentOptions.scrollIntoView.call(null, element);
}

function getElementById(id: string) {
  return document.getElementById(id);
}

function scrollIntoView(element: Element) {
  element.scrollIntoView();
}

function throttle(callback: () => void) {
  cancelAnimationFrame(throttleRequestId);
  throttleRequestId = requestAnimationFrame(callback);
}

let currentOptions: Readonly<Options>;
let unlistenHistory: () => void | undefined;
let documentObserver: MutationObserver | undefined;
let observeTimeout: number | undefined;
let throttleRequestId: number | undefined;

const OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};

const OBSERVE_TIMEOUT_MS = 10000;
const STOP_EVENTS = ["selectstart", "touchend", "wheel"];
