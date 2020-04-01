import * as History from "history";

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
  document.addEventListener("click", handleDocumentClick);
  unlistenHistory = currentOptions.history?.listen(handleHistoryPush);
  startObserving();
}

function unmount() {
  stopObserving();
  document.removeEventListener("click", handleDocumentClick);
  if (unlistenHistory) unlistenHistory();
  unlistenHistory = undefined;
  documentObserver = undefined;
}

function startObserving() {
  stopObserving();
  if (!location.hash) return;

  addEventListener("touchend", stopObserving);
  addEventListener("wheel", stopObserving);
  document.addEventListener("selectstart", stopObserving);
  documentObserver?.observe(document, OBSERVER_CONFIG);
  adjustScrollPosition();

  observeTimeout = setTimeout(stopObserving, OBSERVE_TIMEOUT_MS);
}

function stopObserving() {
  clearTimeout(observeTimeout);
  cancelAnimationFrame(throttleRequestId);
  documentObserver?.disconnect();
  removeEventListener("touchend", stopObserving);
  removeEventListener("wheel", stopObserving);
  document.removeEventListener("selectionchange", stopObserving);
}

function handleHistoryPush(
  _location: History.Location<{}>,
  action: History.Action
) {
  if (action === "PUSH") startObserving();
}

function handleDocumentClick(event: Event) {
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
let unlistenHistory: History.UnregisterCallback | undefined;
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
