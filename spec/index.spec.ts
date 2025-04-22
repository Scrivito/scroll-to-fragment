import { scrollToFragment } from "../src/index";
import { createBrowserHistory } from "history";

describe("scrollToFragment", () => {
  beforeEach((done) => {
    document.body.innerHTML = "";
    document.body.insertAdjacentHTML(
      "beforeend",
      `<h1 style="height:200px">H1</h1>
      <p style="height:10000px">Lorem</p>
      <h2 style="height:200px" id="foobar">H2</h2>
      <p id="bottom10400" style="height:1000px">Ipsum</p>
      <a href="javascript://#top" id="other">Other page</a>
      <a href="index.html#bottom10400" id="same">Same page</a>
      <a href="#bottom10400" id="hashOnly">Hash only</a>
      <a href="#bottom10400"><span id="spanInA">Nested</span></a>
      `,
    );
    history.replaceState(null, "", "index.html");
    window.scrollTo(0, 333);
    wait(done);
  });

  afterEach(() => scrollToFragment());

  describe("with a URL hash", () => {
    beforeEach((done) => {
      location.hash = "foobar";
      scrollToFragment();
      wait(done);
    });

    it("scrolls to the matching element", () => {
      expect(window.scrollY).toBeCloseTo(10400, -3);
    });

    describe("clicking a link to a different page", () => {
      beforeEach((done) => {
        window.scrollTo(0, 444);
        document.getElementById("other")?.click();
        wait(done);
      });

      it("keeps the scroll position unchanged", () => {
        expect(window.scrollY).toBeCloseTo(444, -1);
      });
    });

    describe("clicking a hash link to the same page", () => {
      beforeEach((done) => {
        window.scrollTo(0, 444);
        document.getElementById("same")?.click();
        wait(done);
      });

      it("scrolls to the matching element", () => {
        expect(window.scrollY).toBeCloseTo(10400, -3);
      });
    });

    describe("clicking a hash link with defaultPrevented", () => {
      const listener = (event) => {
        const id = (event.target as Element).id;
        if (id === "same") event.preventDefault();
      };

      beforeEach((done) => {
        window.scrollTo(0, 444);
        document.addEventListener("click", listener);
        document.getElementById("same")?.click();
        wait(done);
      });

      afterEach(() => document.removeEventListener("click", listener));

      it("keeps the scroll position unchanged", () => {
        expect(window.scrollY).toBeCloseTo(444, -1);
      });
    });
  });

  describe("with a URL hash but no matching fragment", () => {
    beforeEach((done) => {
      history.replaceState(null, "", "index.html#barbaz");
      scrollToFragment();
      wait(done);
    });

    it("keeps the scroll position unchanged", () => {
      expect(window.scrollY).toBeCloseTo(333, -1);
    });

    describe("if the fragment appears later", () => {
      beforeEach((done) => {
        document
          .getElementById("bottom10400")
          ?.insertAdjacentHTML("beforebegin", "<h1 id='barbaz'>H1</h1>");
        wait(done);
      });

      it("scrolls to the matching element", () => {
        expect(window.scrollY).toBeCloseTo(10400, -3);
      });
    });
  });

  describe("clicking an element wrapped by a hash link", () => {
    beforeEach((done) => {
      scrollToFragment({ scrollIntoView: () => window.scrollTo(0, 123) });
      document.getElementById("spanInA")?.click();
      wait(done);
    });

    it("scrolls, overriding the browser default", () => {
      expect(window.scrollY).toBeCloseTo(123, -1);
    });
  });

  describe("without a URL hash", () => {
    beforeEach((done) => {
      scrollToFragment();
      wait(done);
    });

    it("keeps the scroll position unchanged", () => {
      expect(window.scrollY).toBeCloseTo(333, -1);
    });
  });

  describe("with scrollIntoView", () => {
    beforeEach((done) => {
      scrollToFragment({ scrollIntoView: () => window.scrollTo(0, 123) });
      document.getElementById("hashOnly")?.click();
      wait(done);
    });

    it("scrolls according to the callback, overriding the browser default", () => {
      expect(window.scrollY).toBeCloseTo(123, -1);
    });
  });

  describe("with history", () => {
    beforeEach(function () {
      this.history = createBrowserHistory();
    });

    describe("on click", () => {
      beforeEach(function (done) {
        scrollToFragment({
          history: this.history,
          scrollIntoView: () => window.scrollTo(0, 123),
        });
        document.getElementById("hashOnly")?.click();
        wait(done);
      });

      it("scrolls, overriding the browser default", () => {
        expect(window.scrollY).toBeCloseTo(123, -1);
      });
    });

    describe("on PUSH", () => {
      beforeEach(function (done) {
        scrollToFragment({ history: this.history });
        this.history.push("other.html#bottom10400");
        wait(done);
      });

      it("scrolls to the matching element", () => {
        expect(window.scrollY).toBeCloseTo(10400, -3);
      });
    });
  });
});

function wait(done: () => void, frames: number = 3) {
  if (frames === 0) done();
  else requestAnimationFrame(() => wait(done, frames - 1));
}
