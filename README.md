# Scroll to fragment

[![Build status](https://travis-ci.org/Scrivito/scroll-to-fragment.svg?branch=master)](https://travis-ci.org/github/Scrivito/scroll-to-fragment)
[![Package size](https://badgen.net/bundlephobia/minzip/scroll-to-fragment)](https://bundlephobia.com/result?p=scroll-to-fragment)
[![NPM Version](https://badgen.net/npm/v/scroll-to-fragment)](https://www.npmjs.com/package/scroll-to-fragment)
[![Types included](https://badgen.net/npm/types/scroll-to-fragment)](https://www.npmjs.com/package/scroll-to-fragment)
[![Supported by Scrivito](https://badgen.net/badge/%E2%99%A5%20supported%20by/Scrivito/1BAE61)](https://www.scrivito.com/?utm_source=npm&utm_medium=natural&utm_campaign=scroll-to-fragment)

Make single page apps scroll to the current URL hash.

When you follow a link that ends with a hash fragment (https://example.com#my-headline) on a traditional server-side-rendered (SSR) website, the browser automatically scrolls to the matching element.
With JavaScript-driven single page apps (SPA), current browsers do not scroll by default.

This helper provides single page apps with the classic scrolling behavior.
It updates the scroll position on load, and checks for updates on clicks and browser history changes.
To keep the fragment in line with asynchronously updated content (for example in a ReactJS based app) it also adjusts the scroll position on DOM changes.

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
  getElement: (fragmentId) => document.getElementsByName(fragmentId)[0],

  // adjust the scroll position after history PUSH events:
  history: createBrowserHistory(),

  // customize scrolling behavior:
  scrollIntoView: (element) => element.scrollIntoView({ behavior: "smooth" }),
});
```

### Manual trigger

If you are listening for any other events to trigger a scroll position update, simply call `scrollToFragment()` again. This will automatically stop the previous instance.

## Tips

- Triggering an update on `popstate` or `hashchange` may result in unwanted scrolling after browser back and forward navigation.
- If the scroll position after navigating back is wrong, we recommend using a dedicated package like [delayed-scroll-restoration-polyfill](https://github.com/janpaul123/delayed-scroll-restoration-polyfill).

## Development

```sh
npm run watch
```
