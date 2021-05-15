const { src, dest, watch } = require('gulp');

//#region css
const sass = require('gulp-sass');
sass.compiler = require('dart-sass');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');

function css() {
	return src('./src/css/*.scss')
		.pipe(
			sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError)
		)
		.pipe(postcss([require('precss'), require('autoprefixer')]))
		.pipe(concat('style.min.css'))
		.pipe(dest('./dist/css/'));
}

exports.css = css;
//#endregion

//#region js
function js() {
	return src('./src/js/*.js')
		.pipe(concat('script.js'))
		.pipe(dest('./dist/js/'));
}

exports.js = js;
//#endregion

//#region html
const fs = require('fs');
const sizeOf = require('image-size');
function getImageData() {
	const path = `./dist/img/galleries/`;
	const response = {
		imgData: []
	};

	const subdirs = fs
		.readdirSync(path, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);

	for (let subdir of subdirs) {
		const files = fs.readdirSync(path + subdir);
		for (let file of files) {
			if (file.includes('.500.')) {
				continue;
			}

			const size = sizeOf(`${path}/${subdir}/${file}`);
			response.imgData[file] = { w: size.width, h: size.height };
		}
	}

	return response;
}

const pug = require('gulp-pug');
const data = require('gulp-data');
const prettier = require('gulp-prettier');
function html() {
	return src('./src/pug/views/*.pug')
		.pipe(
			data(function () {
				return JSON.parse(
					fs.readFileSync('./src/pug/data/articles.json')
				);
			})
		)
		.pipe(
			data(function () {
				return JSON.parse(
					fs.readFileSync('./src/pug/data/galleries.json')
				);
			})
		)
		.pipe(data(getImageData()))
		.pipe(pug())
		.pipe(prettier({
			printWidth: 10000,
			proseWrap: "never"
		}))
		.pipe(dest('./dist'));
}

exports.html = html;
//#endregion

exports.watch = function () {
	watch('./src/css/*.scss', css);
	watch('./src/pug/**/*.pug', html);
	watch('./src/js/*.js', js);
};

//#region img
const makeScaledVersions = (file, cb) => {
	const square = file.clone();
	square.scale = {
		maxWidth: 500,
		maxHeight: 500,
		fit: 'cover',
		format: 'webp',
		metadata: false,
		formatOptions: {
			quality: 20,
			progressive: true,
			mozjpeg: true
		}
	};

	const scaled = file.clone();
	scaled.scale = {
		maxWidth: 1080,
		maxHeight: 1080,
		fit: 'outside',
		format: 'webp',
		metadata: false,
		formatOptions: {
			quality: 80
		}
	};

	cb(null, [square, scaled]);
};

const path = require('path');
const renameResult = (output, scale, cb) => {
	const name = [
		path.basename(output.path, output.extname),
		scale.maxWidth,
		scale.format || output.extname
	].join('.');

	cb(null, name);
};

const scaleImages = require('gulp-scale-images');
const flatMap = require('flat-map').default;
function img() {
	return src('./src/img/galleries/**/*.jpg')
		.pipe(flatMap(makeScaledVersions))
		.pipe(scaleImages(renameResult))
		.pipe(dest('./dist/img/galleries'));
}

exports.img = img;
//#endregion
