import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import "../css/index.scss";

import gsap from "gsap";
import Splitting from "splitting";

import Slideshow from "./Slideshow";
import Cursors from "./Cursors";
import { colors, preloadImages } from "./utils";

Splitting();

class App {
	constructor() {
		this.slider = new Slideshow(document.querySelector(".slider"));
		this.masterTl = gsap.timeline();
	}

	init() {
		preloadImages(document.querySelectorAll(".card")).then(() => {
			this.slider.init();
			this.initEvents();
			this.initAnimation();
		});
	}

	initAnimation() {
		const loadedAnimationTl = gsap
			.timeline()
			.to(".loading__text", { duration: 1, opacity: 0 })
			.to(".bg__transition--slide", {
				duration: 1,
				scaleY: 0,
				transformOrigin: "top center",
				ease: "expo.out",
				onComplete: () => {
					gsap.set(".loading__wrapper", { pointerEvents: "none", autoAlpha: 0 });
				},
			})
			.add(() => {
				this.slider.initAnimation();
			}, "<");

		const pageAnimationTl = gsap
			.timeline({
				delay: loadedAnimationTl.duration(),
				onComplete: () => {
					Cursors.init();
					Cursors.initEventsOnSlider(this.slider);
				},
			})
			.from([".frame > * > span"], {
				duration: 1,
				opacity: 0,
				yPercent: 100,
				ease: "expo.out",
			});

		this.masterTl.add(loadedAnimationTl, 0);
		this.masterTl.add(pageAnimationTl, pageAnimationTl.duration() - 0.5);
	}

	initEvents() {
		this.slider.onSlideChange((currentSlideIndex) => {
			const color = colors[currentSlideIndex];
			gsap.timeline({
				delay: 1.25,
				defaults: {
					duration: 1.25,
				},
			})
				.addLabel("start", 0)
				.to("body", { backgroundColor: color.bgColor }, "start")
				.to(".frame__logo", { color: color.logoColor }, "start")
				.to(Cursors.cursors.large.DOM.el, { "--cursor-stroke": color.cursor }, "start")
				.to(Cursors.cursors.small.DOM.el, { "--cursor-fill": color.cursor }, "start");
		});
	}
}

const app = new App();
app.init();
