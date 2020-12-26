import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import "../css/index.scss";

import gsap from "gsap";
import Splitting from "splitting";

import Slideshow from "./Slideshow";
import Cursors from "./Cursors";
import { colors, preloadImages } from "./utils";

Splitting();

let t = Date.now();

preloadImages(document.querySelectorAll(".card")).then(() => {
	console.log(Date.now() - t);

	const slider = new Slideshow(document.querySelector(".slider"));

	slider.initAnimation();

	Cursors.init();
	Cursors.initEventsOnSlider(slider);

	slider.onSlideChange((currentSlideIndex) => {
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
});
