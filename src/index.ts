import * as History from "history";

interface Options {
  getElement?: (fragmentId: string) => Element | undefined;
  history?: History.History;
  observeDomMutation?: boolean;
  observeTimeoutMs?: number;
  scrollIntoView?: (element: Element) => void;
  scrollOnAnchorClick?: boolean;
  scrollOnStart?: boolean;
  stopOnInteraction?: boolean;
}

export function scrollToFragment(options: Options = {}) {
  unmount();

  currentOptions = {
    getElement: options.getElement ?? getElementById,
    history: options.history,
    observeDomMutation: options.observeDomMutation ?? true,
    observeTimeoutMs: options.observeTimeoutMs ?? 7000,
    scrollIntoView: options.scrollIntoView ?? scrollIntoView,
    scrollOnAnchorClick: options.scrollOnAnchorClick ?? true,
    scrollOnStart: options.scrollOnStart ?? true,
    stopOnInteraction: options.stopOnInteraction ?? true
  };

  mount();
}

function mount() {
  if (currentOptions.observeDomMutation) {
    documentObserver = new MutationObserver(handleDomMutation);
  }
  if (currentOptions.scrollOnAnchorClick) {
    document.addEventListener("click", handleDocumentClick);
  }
  unlistenHistory = currentOptions.history?.listen(handleHistoryPush);
  if (currentOptions.scrollOnStart) startObserving();
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

  if (currentOptions.stopOnInteraction) {
    addEventListener("touchend", handleInteraction);
    addEventListener("wheel", handleInteraction);
    document.addEventListener("selectionchange", handleInteraction);
  }
  documentObserver?.observe(document, OBSERVER_CONFIG);
  adjustScrollPosition();

  observeTimeout = setTimeout(stopObserving, currentOptions.observeTimeoutMs);
}

function stopObserving() {
  clearTimeout(observeTimeout);
  cancelAnimationFrame(throttleRequestId);
  documentObserver?.disconnect();
  removeEventListener("touchend", handleInteraction);
  removeEventListener("wheel", handleInteraction);
  document.removeEventListener("selectionchange", handleInteraction);
}

function handleHistoryPush(
  _location: History.Location<{}>,
  action: History.Action
) {
  if (action === "PUSH") startObserving();
}

function handleDocumentClick(event: Event) {
  if ((event.target as Node).nodeName === "A") {
    throttle(startObserving);
  }
}

function handleDomMutation() {
  throttle(adjustScrollPosition);
}

function handleInteraction() {
  stopObserving();
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
  subtree: true
};
