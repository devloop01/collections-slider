import gsap from "gsap";
import { CustomEase } from "./libs/CustomEase";

import Slide from "./Slide";
import Slideinfo from "./Slideinfo";
import { colors } from "./utils";

gsap.registerPlugin(CustomEase);

export default class Slideshow {
	constructor(el) {
		this.DOM = { el };
		this.DOM.navigation = {
			el: this.DOM.el.querySelector(".slider__nav"),
			prev: this.DOM.el.querySelector(".slider__nav--prev"),
			next: this.DOM.el.querySelector(".slider__nav--next"),
		};

		this.slides = [];
		[...this.DOM.el.querySelectorAll(".slide")].forEach((slide) => this.slides.push(new Slide(slide)));

		this.slideInfos = [];
		[...this.DOM.el.querySelectorAll(".slider__slide-info")].forEach((slide) => this.slideInfos.push(new Slideinfo(slide)));

		this.isAnimatingSlide = false;

		this.current = 0;
		this.slidesTotal = this.slides.length;

		this.onSlideChangeCallbackFns = [];
	}

	init() {
		const currentSlide = this.slides[this.current];
		const currentSlideInfo = this.slideInfos[this.current];

		this.slides.forEach((slide, index) => {
			if (currentSlide != slide) {
				gsap.set([slide.DOM.cards.left.parentElement, slide.DOM.cards.center, slide.DOM.cards.right.parentElement], {
					xPercent: 320,
				});
			}
			gsap.set(this.slideInfos[index].DOM.text.title, { color: colors[index].titleColor });
		});

		gsap.timeline()
			.set([this.DOM.navigation.el], { opacity: 0, pointerEvents: "none" })
			.set(currentSlide.DOM.el, { pointerEvents: "none" })
			.set([currentSlide.DOM.cards.left, currentSlide.DOM.cards.right], { translateX: 0, rotate: 0, opacity: 0 })
			.set(currentSlide.DOM.cards.center, { translateY: -currentSlide.DOM.cards.center.clientHeight * 1.15 })
			.set(currentSlide.DOM.cards.center.children[0], { translateY: currentSlide.DOM.cards.center.clientHeight * 1.15 })
			.set(currentSlideInfo.DOM.text.title, { yPercent: 120 });

		this.initEvents();
	}

	initAnimation() {
		const currentSlide = this.slides[this.current];
		const currentSlideInfo = this.slideInfos[this.current];
		const delay = 0.25;

		const tl = gsap
			.timeline({ defaults: { duration: 2, ease: "expo.inOut" } })
			.addLabel("start", delay)
			.addLabel("upcoming", delay + 0.85);

		tl.to(currentSlide.DOM.el, { yPercent: 0 }, "start")
			.to([this.DOM.navigation.el], { opacity: 1, pointerEvents: "all" }, "upcoming")
			.to(
				[currentSlide.DOM.cards.left, currentSlide.DOM.cards.right],
				{
					translateX: gsap.utils.wrap([-250, 250]),
					rotate: gsap.utils.wrap([-8, 8]),
					opacity: 1,
				},
				"upcoming"
			)
			.to([currentSlide.DOM.cards.center, currentSlide.DOM.cards.center.children[0]], { translateY: 0 }, "start")
			.to(currentSlideInfo.DOM.text.title, { yPercent: 0, stagger: 0.025 }, "upcoming")
			.set(".card--primary .card__inner", { overflow: "visible" })
			.set(currentSlide.DOM.el, { pointerEvents: "all" });
	}

	initEvents() {
		const onClickPrevEv = () => this.navigate("prev");
		const onClickNextEv = () => this.navigate("next");

		this.DOM.navigation.prev.addEventListener("click", onClickPrevEv);
		this.DOM.navigation.next.addEventListener("click", onClickNextEv);

		this.slides.forEach((slide) => {
			slide.onFullscreen(() => {
				const currentSlideInfo = this.slideInfos[this.current];
				gsap.timeline({
					delay: 0.45,
					defaults: { duration: 3, ease: "expo.inOut" },
				})
					.addLabel("start", 0)
					.to(currentSlideInfo.DOM.el, { background: "rgba(0, 0, 0, 0.5)" }, "start")
					.to(currentSlideInfo.DOM.text.description, { opacity: 1 }, "start")
					.fromTo(currentSlideInfo.DOM.text.descriptionLines, { yPercent: 100 }, { yPercent: 0, stagger: 0.05 }, "start")
					.to(currentSlideInfo.DOM.el, { scale: 1.25 }, "start")
					.to(this.DOM.navigation.el, { opacity: 0, pointerEvents: "none" }, "start")
					.to(".frame__credits, .frame__button", { color: "#fff" }, "start");
			});
			slide.offFullscreen(() => {
				const currentSlideInfo = this.slideInfos[this.current];
				gsap.timeline({ defaults: { duration: 2, ease: "expo.inOut" } })
					.addLabel("start", 0)
					.to(currentSlideInfo.DOM.el, { background: "rgba(0, 0, 0, 0)" }, "start")
					.to(currentSlideInfo.DOM.text.description, { opacity: 0 }, "start")
					.to(currentSlideInfo.DOM.text.descriptionLines, { yPercent: -100, stagger: -0.05 }, "start")
					.to(currentSlideInfo.DOM.el, { scale: 1 }, "start")
					.to(this.DOM.navigation.el, { opacity: 1, pointerEvents: "all" }, "start")
					.to(".frame__credits, .frame__button", { color: "#000" }, "start");
			});
		});
	}

	onSlideChange(callback) {
		if (typeof callback == "function") {
			this.onSlideChangeCallbackFns.push(callback);
		}
	}

	navigate(direction) {
		if (this.isAnimatingSlide) return;

		const incrementSlideIndex = (val) => {
			if (val > 0 && this.current + val < this.slidesTotal) {
				this.current += val;
			} else if (val > 0) {
				this.current = 0;
			} else if (val < 0 && this.current + val < 0) {
				this.current = this.slidesTotal - 1;
			} else {
				this.current += val;
			}
		};

		const increment = direction == "prev" ? -1 : 1;

		const currentSlide = this.slides[this.current];
		const currentSlideInfo = this.slideInfos[this.current];
		incrementSlideIndex(increment);
		const nextSlide = this.slides[this.current];
		const nextSlideInfo = this.slideInfos[this.current];

		CustomEase.create(
			"customExpo",
			"M0,0 C0.25,0 0.294,0.023 0.335,0.05 0.428,0.11 0.468,0.254 0.498,0.502 0.528,0.782 0.574,0.902 0.626,0.954 0.672,1 0.698,1 1,1 "
		);

		const slideTl = gsap
			.timeline({
				defaults: {
					stagger: 0.095 * increment,
					duration: 2,
					ease: "customExpo",
				},
				onStart: () => {
					this.isAnimatingSlide = true;
					if (this.onSlideChangeCallbackFns) this.onSlideChangeCallbackFns.forEach((fn) => fn(this.current));
				},
				onComplete: () => {
					this.isAnimatingSlide = false;
					currentSlide.DOM.el.classList.remove("slide--current");
					nextSlide.DOM.el.classList.add("slide--current");
				},
			})
			.addLabel("start", 0)
			.addLabel("upcoming", 0.3);

		slideTl
			.to(
				[currentSlide.DOM.cards.left.parentElement, currentSlide.DOM.cards.center, currentSlide.DOM.cards.right.parentElement],
				{
					xPercent: direction === "next" ? -320 : 320,
					onUpdate: () => {
						currentSlide.setClip();
					},
				},
				"start"
			)
			.to([currentSlide.DOM.cards.left, currentSlide.DOM.cards.right], { rotate: gsap.utils.random(-20, 20) }, "start")
			.fromTo(
				[nextSlide.DOM.cards.left.parentElement, nextSlide.DOM.cards.center, nextSlide.DOM.cards.right.parentElement],
				{ xPercent: direction === "next" ? 320 : -320 },
				{
					xPercent: 0,
					onUpdate: () => {
						nextSlide.setClip();
					},
				},
				"upcoming"
			)
			.fromTo(
				[nextSlide.DOM.cards.left, nextSlide.DOM.cards.right],
				{ rotate: gsap.utils.random(-20, 20) },
				{ rotate: gsap.utils.wrap([-8, 8]) },
				"upcoming"
			);

		const slideInfoTl = gsap
			.timeline({
				defaults: { duration: 2, ease: "expo.inOut" },
				onComplete: () => {
					currentSlideInfo.DOM.el.classList.remove("slide-info--current");
				},
			})
			.addLabel("start", 0)
			.addLabel("upcoming", 0.3);

		slideInfoTl
			.to(
				currentSlideInfo.DOM.text.title,
				{
					yPercent: direction === "next" ? -120 : 120,
					rotation: direction === "next" ? 3 : -3,
					stagger: direction === "next" ? 0.02 : -0.02,
				},
				"start"
			)
			.add(() => {
				gsap.set(nextSlideInfo.DOM.text.title, {
					yPercent: direction === "next" ? 120 : -120,
					rotation: direction === "next" ? -3 : 3,
				});
				nextSlideInfo.DOM.el.classList.add("slide-info--current");
			}, "upcoming")
			.to(
				nextSlideInfo.DOM.text.title,
				{
					yPercent: 0,
					rotation: 0,
					stagger: direction === "next" ? 0.02 : -0.02,
				},
				"upcoming"
			);
	}
}
