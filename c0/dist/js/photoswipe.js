// Include Lightbox
import PhotoSwipeLightbox from '/dist/pswp/photoswipe-lightbox.esm.min.js';

const options = {
	gallerySelector: '.gallery',
	childSelector: 'a',

	pswpModule: '/dist/pswp/photoswipe.esm.min.js',
	pswpCSS: '/dist/pswp/photoswipe.css',

	showHideAnimationType: 'zoom',
	preloadFirstSlide: false
};

const lightbox = new PhotoSwipeLightbox(options);

lightbox.on('uiRegister', function () {
	lightbox.pswp.ui.registerElement({
		name: 'caption',
		order: 9,
		isButton: false,
		appendTo: 'root',
		html: 'Caption text',
		onInit: (el, pswp) => {
			lightbox.pswp.on('change', () => {
				const currSlideElement = lightbox.pswp.currSlide.data.element;
				let captionHTML = '';

				if (currSlideElement) {
					const altText = currSlideElement
						.querySelector('img')
						.getAttribute('alt');
					const href = currSlideElement.getAttribute('href');
					const hdHref = href.replace('1080.webp', 'jpg');
					const caption = `${altText}.  <a href="../src/${hdHref}" target="_blank">[source]</a>`;
					captionHTML = `<span>${caption}</span>`;
				}

				el.innerHTML = captionHTML || '';
			});
		}
	});
});

lightbox.init();
