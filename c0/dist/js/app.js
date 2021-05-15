'use strict';

if (document.getElementById('particles')) {
	particlesJS.load('particles', 'js/particles.json');
}

if (typeof barba === 'object' && typeof barbaCss === 'object') {
	barba.use(barbaCss);

	barba.init({
		schema: {
			prefix: 'barba'
		},
		transitions: [
			{
				name: 'fade',
				leave() {},
				enter() {}
			}
		]
	});
}

const expandButtons = document.getElementsByClassName('click-to-expand');
Array.from(expandButtons).forEach(button =>
	button.addEventListener('click', e => {
		button.classList.remove('click-to-expand');
		button.classList.add('did-expand');
		button.hidden = true;

		const id = button.id.replace('button-', 'gallery-');
		const gallery = document.getElementById(id);

		gallery.classList.remove('g-tiny');
		gallery.classList.add('g-med');
	})
);

const galleries = document.getElementsByClassName('gallery');
Array.from(galleries).forEach(gallery => addListeners(gallery));

function addListeners(g) {
	let isDown = false;
	let didMove = false;
	let isTiny = true;
	let didUnfocus = false;
	let startX;
	let scrollLeft;

	g.addEventListener('mousedown', e => {
		isDown = true;
		didMove = false;
		didUnfocus = false;

		//document.getElementById('active-gallery')?.removeAttribute('id');
		//g.id = 'active-gallery';
		g.classList.add('active');
		startX = e.pageX - g.offsetLeft;
		scrollLeft = g.scrollLeft;
	});
	g.addEventListener('mouseleave', () => {
		isDown = false;
		didMove = false;
		//g.removeAttribute('id');
		g.classList.remove('active');
		g.classList.remove('dragging');
	});
	g.addEventListener('mouseup', e => {
		if (isTiny) {
			g.classList.remove('g-tiny');
			g.classList.add('g-med');
			isTiny = false;
		}

		isDown = false;
		didMove = false;
		g.classList.remove('active');
		g.classList.remove('dragging');
	});
	g.addEventListener('mousemove', e => {
		if (!isDown) {
			return;
		}

		e.preventDefault(); // Prevent moving photos
		const x = e.pageX - g.offsetLeft;
		const walk = (x - startX) * 3; // Fast scroll
		g.scrollLeft = scrollLeft - walk;

		if (!didUnfocus) {
			didUnfocus = true;
			const focus = document.querySelector(':focus');

			if (focus) {
				focus.blur();
			}
		}

		if (!didMove && Math.abs(walk) > 10) {
			didMove = true;
			g.classList.add('dragging');
		}
	});
}
