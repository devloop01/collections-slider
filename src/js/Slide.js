import gsap from "gsap";
import { calculateClipPath } from "./utils";

let clicked = false;

export default class Slide {
  constructor(el) {
    this.DOM = { el };
    this.DOM.cardsWrapperEl = this.DOM.el.querySelector(".cards__wrapper");
    this.DOM.cards = {
      center: this.DOM.cardsWrapperEl.querySelector(".card.card--center .card__inner"),
      left: this.DOM.cardsWrapperEl.querySelector(".card.card--left .card__inner"),
      right: this.DOM.cardsWrapperEl.querySelector(".card.card--right .card__inner"),
    };

    this.isAnimating = false;
    this.isFullScreen = false;

    this.onFullscreenCallbackFns = [];
    this.offFullscreenCallbackFns = [];

    this.init();
    this.initEvents();
  }

  init() {
    gsap.set(this.DOM.cards.center.parentElement, {
      clipPath: calculateClipPath(this.DOM.cards.center).clipPath,
    });
    gsap.set([this.DOM.cards.left, this.DOM.cards.right], {
      scale: 0.9,
      translateX: gsap.utils.wrap([-250, 250]),
      rotate: gsap.utils.wrap([-8, 8]),
    });
  }

  setClip() {
    gsap.set(this.DOM.cards.center.parentElement, {
      clipPath: calculateClipPath(
        this.isFullScreen ? this.DOM.cardsWrapperEl : this.DOM.cards.center,
      ).clipPath,
    });
  }

  initEvents() {
    this.initCardEvents();
    const onResizeEv = () => {
      if (this.isAnimating) return;

      const scaleAmount = window.innerWidth / this.DOM.cards.center.clientWidth;

      this.setClip();

      gsap.set(this.DOM.cards.center.querySelector(".card__image"), {
        scale: this.isFullScreen ? Math.max(scaleAmount, 1.5) : 1,
      });
    };

    window.addEventListener("resize", onResizeEv);
  }

  onFullscreen(callback) {
    if (typeof callback == "function") {
      this.onFullscreenCallbackFns.push(callback);
    }
  }

  offFullscreen(callback) {
    if (typeof callback == "function") {
      this.offFullscreenCallbackFns.push(callback);
    }
  }

  initCardEvents() {
    const onCardClickEv = () => {
      if (this.isAnimating) return;

      const scaleAmount = window.innerWidth / this.DOM.cards.center.clientWidth;

      clicked = !clicked;

      const tl = gsap
        .timeline({
          defaults: {
            duration: 2,
            ease: "expo.inOut",
          },
          onStart: () => {
            this.isAnimating = true;
            if (clicked) {
              if (this.onFullscreenCallbackFns) this.onFullscreenCallbackFns.forEach((fn) => fn());
            } else {
              if (this.offFullscreenCallbackFns)
                this.offFullscreenCallbackFns.forEach((fn) => fn());
            }
          },
          onComplete: () => {
            this.isAnimating = false;
            this.isFullScreen = clicked;
          },
        })
        .addLabel("start", 0)
        .addLabel("upcoming", 1);

      tl.to(
        [this.DOM.cards.left, this.DOM.cards.right],
        {
          translateX: clicked ? 0 : gsap.utils.wrap([-250, 250]),
          rotate: clicked ? 0 : gsap.utils.wrap([-8, 8]),
        },
        clicked ? "start" : "upcoming",
      )
        .to(
          this.DOM.cards.center.querySelector(".card__image"),
          {
            scale: clicked ? scaleAmount : 1,
          },
          clicked ? "upcoming" : "start",
        )
        .to(
          this.DOM.cards.center.parentElement,
          {
            clipPath: calculateClipPath(clicked ? this.DOM.cardsWrapperEl : this.DOM.cards.center)
              .clipPath,
          },
          clicked ? "upcoming" : "start",
        );
    };

    const onCardHoverEv = () => {
      gsap.to([this.DOM.cards.left.parentElement, this.DOM.cards.right.parentElement], {
        duration: 1,
        translateX: gsap.utils.wrap([-10, 10]),
        ease: "elastic.out(1, 1)",
      });
    };

    const offCardHoverEv = () => {
      gsap.to([this.DOM.cards.left.parentElement, this.DOM.cards.right.parentElement], {
        duration: 1,
        translateX: 0,
        ease: "elastic.out(1, 1)",
      });
    };

    this.DOM.cards.center.addEventListener("click", onCardClickEv);
    this.DOM.cards.center.children[0].addEventListener("mouseenter", onCardHoverEv);
    this.DOM.cards.center.children[0].addEventListener("mouseleave", offCardHoverEv);
  }
}
