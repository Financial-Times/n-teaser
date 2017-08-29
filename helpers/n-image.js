const breakpoints = require('./n-image/breakpoints');
const buildImageServiceUrl = require('./n-image/build-image-service-url');
const createImageSizes = require('./n-image/create-image-sizes');

/**
 * @param {string} src - Actual src to use. If set, assume it's non-responsive, i.e. ignore url, widths, sizes
 * @param {string} srcSet - URL of the image to use in srcset
 * @param {string} url - DEPRECATED URL of the image
 * @param {number[]} widths - Widths of the image, in pixels
 * @param {Object} [sizes = {}] - OPTIONAL Keys are breakpoints, values the length. Used instead of colspan and position e.g.
 * { default: '33.3vw', L: 'calc(.333 * (100vw - 12em)'}
 * @param {string} [colspan = "{}"] - OPTIONAL Keys are breakpoints, values the grid columns required. Used together with position to calculate sizes attribute e.g.
 * '{"default": 12, "M": 5}',
 * @param {string} [position = "{}"] - OPTIONAL Keys are breakpoints, values the position (top, bottom, left, right, stream-list). Used together with colspan to calculate sizes attribute e.g.
 * '{"default": "left", "M": "top"}'
 * @param {string[]|string} [classes = []] - Additional classes to add to the img element
 * @param {string[]|string} [wrapperClasses = []] - Additional classes to add to the wrapper element
 * @param {string} [width] - Width of the image
 * @param {string} [height] - Height of the image
 * @param {string} [alt = ''] - Alt text for the image
 * @param {boolean} [lazyLoad = false] - Lazy load the image
 * @param {string} [sourceParam = 'next'] - The `source` parameter used in the image service request
 * @param {string|number} [placeholder] - Set to add a placeholder. Value should be the ratio of the image as a number
 * (width divided by height, e.g.`16/9`), or string (`square` or `landscape`)
 */

class ImagePresenter {
	constructor (data) {
		this.data = data;
	}

	get ratio () {
		let ratio = this.placeholder;
		if (typeof ratio === 'number') {
			if (ratio === 1) {
				ratio = 'square';
			} else if (ratio === 16 / 9) {
				ratio = 'landscape';
			}
		}
		return ratio;
	}

	get lazyLoad () {
		return this.data.lazyLoad;
	}

	get placeholder () {
		if (parseFloat(this.data.placeholder)) {
				return (parseFloat(this.data.placeholder));
		}
		return this.data.placeholder;
	}

	get wrapperAttrs () {
		let wrapperClassName = 'n-image-wrapper';
		let style;
		let styleString;
		const ratio = this.ratio;
		if (this.data.wrapperClasses) {
				wrapperClassName += ` ${this.optionalClasses(this.data.wrapperClasses)}`;
		}
		if (this.lazyLoad) {
			wrapperClassName += ' n-image-wrapper--lazy-loading';
		}
		if (this.placeholder) {
			wrapperClassName += ' n-image-wrapper--placeholder';
		}
		if (['square'].indexOf(ratio) > -1) {
			wrapperClassName += ` n-image-wrapper--${ratio}-placeholder`;
		} else if (typeof ratio === 'number') {
			style = { 'paddingBottom': `${100 * (1 / ratio)}%` };
			styleString = `padding-bottom:${style.paddingBottom}`;
		}
		return {
			className: wrapperClassName,
			styleString,
			style
		};
	}

	get imgAttrs () {
		const className = `n-image ${this.optionalClasses(this.data.classes)}`;
		const attrs = {
			alt: this.data.alt || '',
			className
		};
		if (!attrs.alt) {
			attrs.role = 'presentation';
		}
		Object.assign(attrs, this.imageSource());
		if (this.lazyLoad) {
			Object.assign(attrs, this.hideImage(attrs));
			attrs.className += ' n-image--lazy-loading';
		}
		return attrs;
	}

	// handlebars is limited to strings for attributes, conversion for array and objects
	convertToJson (datum) {
		return (typeof datum === 'string') ? JSON.parse(datum) : datum;
	}

	optionalClasses (classes) {
		if (!classes) {
			return '';
		} else if (Array.isArray(classes)) {
			return classes.join(' ');
		} else {
			return classes;
		}
	}

	// convert the `src` or `srcset` attribtues to a data attribute
	hideImage (obj) {
		return Object.keys(obj)
			.reduce((dataObj, name) => {
				if (name === 'src' || name === 'srcSet') {
					dataObj[`data-${name.toLowerCase()}`] = obj[name];
					obj[name] = null;
				}
				return dataObj;
			}, {});
	}

	imageSource () {
		const sourceAttrs = {};
		const sizes = this.convertToJson(this.data.sizes) || this.imageSizes() || {};
		const widths = this.convertToJson(this.data.widths) || [];
		const srcSet = this.data.srcSet || this.data.url;
		const sourceParam = this.data.sourceParam || 'next';

		if (!this.data.src && !srcSet) {
			// Avoiding n-logger due to errors during build (plus client-side bloat)
			// eslint-disable-next-line no-console
			console.warn('No source for image provided');
		} else if (this.data.src) {
			return { src: this.data.src, width: this.data.width, height: this.data.height };
		} else {
			if (widths.length === 0) {
				// eslint-disable-next-line no-console
				console.warn('Widths must be provided if setting srcSet');
			}
			sourceAttrs.srcSet = widths
				.sort((widthOne, widthTwo) => widthTwo - widthOne)
				.map(width => `${buildImageServiceUrl(srcSet, { width, source: sourceParam })} ${width}w`)
				.join(', ');

			sourceAttrs.sizes = breakpoints
				.map(breakpoint => {
					const size = sizes[breakpoint.name];
					return size ?
						breakpoint.name === 'default' ? size : `(min-width: ${breakpoint.px}px) ${size}` :
						null;
				})
				.filter(size => size)
				.join(', ');

			return sourceAttrs;
		}
	}

	imageSizes () {
		const colspan = this.convertToJson(this.data.colspan) || {'default': 12};
		const position = this.convertToJson(this.data.position) || {'default': 'top'};
		return createImageSizes(colspan, position);
	}
}

module.exports = ImagePresenter;
