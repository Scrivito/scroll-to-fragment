import { scrollToFragment } from "../src/index";

describe("scrollToFragment", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.insertAdjacentHTML(
      "beforeend",
      `<h1 style="height:200px">H1</h1>
      <p style="height:10000px">Lorem</p>
      <h2 style="height:200px" id="foobar">H2</h2>
      <p id="bottom" style=""eight:1000px">Ipsum</p>`
    );
    location.hash = "";
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
  });

  describe("with a URL hash but no matching fragment", () => {
    beforeEach(() => {
      location.hash = "barbaz";
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
        }, 20);
      });
    });
  });

  describe("without a URL hash", () => {
    beforeEach(() => {
      location.hash = "";
      scrollToFragment();
    });

    it("keeps the scroll position unchanged", () => {
      expect(window.scrollY).toEqual(333);
    });
  });
});
