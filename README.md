## Scroll to fragment

Make single page apps scroll according to the current URL hash.

This helper emulates browser URL hash scrolling behavior for single page apps (SPA).
Apart from updating the scroll position on load, it can listen to clicks and browser history changes.
To keep the fragment in line with asynchronouly updated content (for example in a ReactJS based app) it adjusts the scroll position on DOM mutations.

### Installation

```sh
npm install scroll-to-fragment
```

### Usage

In your app's initialization code, for example in `index.js`:

```js
import { scrollToFragment } from "scroll-to-fragment";
scrollToFragment();
```

#### Options

You can customize the behavior with the following options:

```js
import { scrollToFragment } from "scroll-to-fragment";
import { createBrowserHistory } from "history";

scrollToFragment({
  // customize the target of a given fragment ID (default is getElementById):
  getElement: fragmentId => document.getElementsByName(fragmentId)[0],
  // adjust the scroll position after history PUSH events:
  history: createBrowserHistory(),
  // don't automatically adjust the scroll position after DOM mutations:
  observeDomMutation: false,
  // stop adjusting the scroll position after 1 second (default is 7 s):
  observeTimeoutMs: 1000,
  // customize scrolling behavior:
  scrollIntoView: element => element.scrollIntoView({ behavior: "smooth" }),
  // don't automatically adjust the scroll position after <A> tag clicks:
  scrollOnAnchorClick: false,
  // don't adjust the scroll position immediately:
  scrollOnStart: false,
  // keep adjusting the scroll position after mousewheel, touch, and select events:
  stopOnInteraction: false
});
```

#### Manual trigger

If you are listening for any other events to trigger a scroll position update, simply call `scrollToFragment()` again. This will automatically stop the previous instance.

### Caveats

- Triggering an update on `popstate` or `hashchange` may result in unwanted scrolling after browser back and forward navigation.

### Development

```sh
npm run watch
```
