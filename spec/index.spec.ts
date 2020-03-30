import { scrollToFragment } from "../src/index";

describe("scrollToFragment", () => {
  beforeEach((done) => {
    document.body.innerHTML = "";
    document.body.insertAdjacentHTML(
      "beforeend",
      `<h1 style="height:200px">H1</h1>
      <p style="height:10000px">Lorem</p>
      <h2 style="height:200px" id="foobar">H2</h2>
      <p id="bottom" style="height:1000px">Ipsum</p>
      <a href="other.html#top" id="other" onclick="return false">Other page</a>
      <a href="index.html#bottom" id="same" onclick="return false">Same page</a>
      <a href="#bottom" id="hashOnly">Hash only</a>
      `
    );
    history.replaceState(null, null, "index.html");
    window.scrollTo(0, 333);
    wait(done);
  });

  describe("with a URL hash", () => {
    beforeEach((done) => {
      location.hash = "foobar";
      scrollToFragment();
      wait(done);
    });

    it("scrolls to the matching element", () => {
      expect(window.scrollY).toBeCloseTo(10200, -3);
    });

    describe("clicking a link to a different page", () => {
      beforeEach((done) => {
        window.scrollTo(0, 444);
        document.getElementById("other").click();
        wait(done);
      });

      it("keeps the scroll position unchanged", () => {
        expect(window.scrollY).toEqual(444);
      });
    });

    describe("clicking a hash link to the same page", () => {
      beforeEach((done) => {
        window.scrollTo(0, 444);
        document.getElementById("same").click();
        wait(done);
      });

      it("scrolls to the matching element", () => {
        expect(window.scrollY).toBeCloseTo(10200, -3);
      });
    });
  });

  describe("with a URL hash but no matching fragment", () => {
    beforeEach((done) => {
      history.replaceState(null, null, "index.html#barbaz");
      scrollToFragment();
      wait(done);
    });

    it("keeps the scroll position unchanged", () => {
      expect(window.scrollY).toEqual(333);
    });

    describe("if the fragment appears later", () => {
      beforeEach((done) => {
        document
          .getElementById("bottom")
          .insertAdjacentHTML("beforebegin", "<h1 id='barbaz'>H1</h1>");
        wait(done);
      });

      it("scrolls to the matching element", () => {
        expect(window.scrollY).toBeCloseTo(10200, -3);
      });
    });
  });

  describe("without a URL hash", () => {
    beforeEach((done) => {
      scrollToFragment();
      wait(done);
    });

    it("keeps the scroll position unchanged", () => {
      expect(window.scrollY).toEqual(333);
    });
  });

  describe("with scrollIntoView", () => {
    beforeEach((done) => {
      scrollToFragment({ scrollIntoView: () => window.scrollTo(0, 42) });
      document.getElementById("hashOnly").click();
      wait(done);
    });

    it("scrolls according to the callback, overriding the browser default", () => {
      expect(window.scrollY).toBe(42);
    });
  });
});

function wait(done: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(done));
}
