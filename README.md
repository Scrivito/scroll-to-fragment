# Scroll to fragment [![Build status](https://travis-ci.org/dcsaszar/scroll-to-fragment.svg?branch=master)](https://travis-ci.org/dcsaszar/scroll-to-fragment) [![Package size](https://badgen.net/bundlephobia/minzip/scroll-to-fragment)](https://bundlephobia.com/result?p=scroll-to-fragment)

Make single page apps scroll according to the current URL hash.

This helper emulates browser URL hash scrolling behavior for single page apps (SPA).
Apart from updating the scroll position on load, it can listen to clicks and browser history changes.
To keep the fragment in line with asynchronouly updated content (for example in a ReactJS based app) it adjusts the scroll position on DOM mutations.

## Installation

```sh
npm install scroll-to-fragment
```

## Usage

In your app's initialization code, for example in `index.js`:

```js
import { scrollToFragment } from "scroll-to-fragment";
scrollToFragment();
```

### Options

You can customize the behavior with the following options:

```js
import { scrollToFragment } from "scroll-to-fragment";
import { createBrowserHistory } from "history";

scrollToFragment({
  // customize the target of a given fragment ID (default is getElementById):
  getElement: fragmentId => document.getElementsByName(fragmentId)[0],
  // adjust the scroll position after history PUSH events:
  history: createBrowserHistory(),
  // customize scrolling behavior:
  scrollIntoView: element => element.scrollIntoView({ behavior: "smooth" })
});
```

### Manual trigger

If you are listening for any other events to trigger a scroll position update, simply call `scrollToFragment()` again. This will automatically stop the previous instance.

## Caveats

- Triggering an update on `popstate` or `hashchange` may result in unwanted scrolling after browser back and forward navigation.

## Development

```sh
npm run watch
```
