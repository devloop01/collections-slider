import Cursor from "./Cursor";

export default new (class {
  constructor() {
    this.DOM = {};

    this.DOM.cursorEls = {
      large: document.querySelector(".cursor--large"),
      small: document.querySelector(".cursor--small"),
      close: document.querySelector(".cursor--close"),
    };

    this.cursors = {
      large: new Cursor(this.DOM.cursorEls.large),
      small: new Cursor(this.DOM.cursorEls.small),
      close: new Cursor(this.DOM.cursorEls.close),
    };

    this.cursors.small.setTranslateLerpAmount(0.85);
    this.cursors.close.opaque(0).scale(0.5).setTranslateLerpAmount(0.5);
  }

  init() {
    Object.values(this.cursors).forEach((cursor) => {
      cursor.init();
    });
    this.initEvents();
  }

  initEvents() {
    this.initEventsOnElements();
    this.initEventsOnImage();
  }

  initEventsOnElements() {
    const onMouseEnter = () => {
      this.cursors.large.scale(2).opaque(0);
      this.cursors.small.scale(5);
    };

    const onMouseLeave = () => {
      this.cursors.large.scale(1).opaque(1);
      this.cursors.small.scale(1);
    };

    const onMouseDown = () => {
      this.cursors.small.scale(4);
    };

    const onMouseUp = () => {
      this.cursors.small.scale(5);
    };

    [...document.querySelectorAll("a"), ...document.querySelectorAll("button")].forEach(
      (element) => {
        element.addEventListener("mouseenter", onMouseEnter);
        element.addEventListener("mouseleave", onMouseLeave);
        element.addEventListener("mousedown", onMouseDown);
        element.addEventListener("mouseup", onMouseUp);
      },
    );
  }

  initEventsOnImage() {
    const onMouseDown = () => {
      this.cursors.large.scale(2).opaque(0);
      this.cursors.small.scale(5);
    };

    const onMouseUp = () => {
      this.cursors.large.scale(1).opaque(1);
      this.cursors.small.scale(1);
    };

    [...document.querySelectorAll(".card.card--primary img")].forEach((image) => {
      image.addEventListener("mousedown", onMouseDown);
      image.addEventListener("mouseup", onMouseUp);
    });
  }

  initEventsOnSlider(slider) {
    const onMouseEnter = () => {
      this.cursors.large.scale(2).opaque(0);
      this.cursors.small.scale(5).setTranslateLerpAmount(0.25);
      this.cursors.close.opaque(1).scale(1);
    };

    const onMouseLeave = () => {
      this.cursors.large.scale(1).opaque(1);
      this.cursors.small.scale(1).setTranslateLerpAmount(0.85);
      this.cursors.close.opaque(0).scale(0.5);
    };

    const slides = slider.slides;

    slides.forEach((slide) => {
      slide.onFullscreen(() => {
        onMouseEnter();
        [...document.querySelectorAll(".card.card--primary img")].forEach((image) => {
          image.addEventListener("mouseenter", onMouseEnter);
          image.addEventListener("mouseleave", onMouseLeave);
        });
      });
      slide.offFullscreen(() => {
        onMouseLeave();
        [...document.querySelectorAll(".card.card--primary img")].forEach((image) => {
          image.removeEventListener("mouseenter", onMouseEnter);
          image.removeEventListener("mouseleave", onMouseLeave);
        });
      });
    });
  }
})();
