import { scrollToFragment } from "../src/index";

describe("scrollToFragment", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.insertAdjacentHTML(
      "beforeend",
      `<h1 style="height:200px">H1</h1>
      <p style="height:10000px">Lorem</p>
      <h2 style="height:200px" id="foobar">H2</h2>
      <p id="bottom" style=""eight:1000px">Ipsum</p>
      <a href="other.html#top" id="other" onclick="return false">Other page</a>
      <a href="index.html#bottom" id="same" onclick="return false">Same page</a>`
    );
    history.replaceState(null, null, "index.html");
    window.scrollTo(0, 333);
  });

  describe("with a URL hash", () => {
    beforeEach(() => {
      location.hash = "foobar";
      scrollToFragment();
    });

    it("scrolls to the matching element", () => {
      expect(window.scrollY).toBeCloseTo(10200, -3);
    });

    describe("clicking a link to a different page", () => {
      beforeEach(() => {
        window.scrollTo(0, 444);
        document.getElementById("other").click();
      });

      it("keeps the scroll position unchanged", done => {
        setTimeout(() => {
          expect(window.scrollY).toEqual(444);
          done();
        }, WAIT);
      });
    });

    describe("clicking a hash link to the same page", () => {
      beforeEach(() => {
        window.scrollTo(0, 444);
        document.getElementById("same").click();
      });

      it("scrolls to the matching element", done => {
        setTimeout(() => {
          expect(window.scrollY).toBeCloseTo(10200, -3);
          done();
        }, WAIT);
      });
    });
  });

  describe("with a URL hash but no matching fragment", () => {
    beforeEach(() => {
      history.replaceState(null, null, "index.html#barbaz");
      scrollToFragment();
    });

    it("keeps the scroll position unchanged", () => {
      expect(window.scrollY).toEqual(333);
    });

    describe("if the fragment appears later", () => {
      beforeEach(() => {
        document
          .getElementById("bottom")
          .insertAdjacentHTML("beforebegin", "<h1 id='barbaz'>H1</h1>");
      });

      it("scrolls to the matching element", done => {
        setTimeout(() => {
          expect(window.scrollY).toBeCloseTo(10200, -3);
          done();
        }, LONG_WAIT);
      });
    });
  });

  describe("without a URL hash", () => {
    beforeEach(() => {
      scrollToFragment();
    });

    it("keeps the scroll position unchanged", () => {
      expect(window.scrollY).toEqual(333);
    });
  });
});

const WAIT = 20;
const LONG_WAIT = 90;
