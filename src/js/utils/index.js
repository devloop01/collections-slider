import Splitter from "./Splitter";
import colors from "./colorConfig";
import { preloadImages } from "./preload";
import Mouse from "./Mouse";

const lerp = (a, b, n) => (1 - n) * a + n * b;

const calculateClipPath = (el) => {
	const bounds = el.getBoundingClientRect();
	let pointsArray = [];
	let clipPath = [
		[bounds.left, bounds.top],
		[bounds.left + bounds.width, bounds.top],
		[bounds.left + bounds.width, bounds.top + bounds.height],
		[bounds.left, bounds.top + bounds.height],
	];
	pointsArray = clipPath;
	clipPath = clipPath
		.map((coordinates) => {
			return coordinates.map((coordinate) => coordinate + "px").join(" ");
		})
		.join(",");

	clipPath = `polygon(${clipPath})`;
	return {
		clipPath,
		pointsArray,
	};
};

const getMousePos = (e) => {
	let posx = 0;
	let posy = 0;
	if (!e) e = window.event;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
	}

	return { x: posx, y: posy };
};

export { lerp, colors, getMousePos, preloadImages, calculateClipPath, Mouse, Splitter };
