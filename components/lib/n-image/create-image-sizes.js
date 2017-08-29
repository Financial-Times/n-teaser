const breakpoints = require('./breakpoints');

const breakpointNames = breakpoints.map( breakpoint => {
	return breakpoint.name;
}).reverse();

const getPageSize = (size) => {
	const foundBreakpoint = breakpoints.find( breakpoint => {
			return breakpoint.name === size;
	} );
	return (foundBreakpoint) ? parseInt(foundBreakpoint.px, 10) : null;
};

// page padding, minus one col padding
const pagePaddings = {
	default: 20,
	M: 32
};

// card's left and right padding, plus col padding
const defaultCardPaddings = {
	default: 20
};

const imageWidth = {
	'top': 1,
	'bottom': 1,
	'left': 0.4,
	'right': 0.5,
	'stream-list': 0.3
};

// if no fixed page size, assume it's responsive

const pageSizes = {
	M: getPageSize('M'),
	L: getPageSize('L'),
	XL: getPageSize('XL')
};

const getSize = (pagePadding, cardPadding, colspan, position, pageSize = false) => {
	const colRatio = colspan / 12;
	const imageRatio = imageWidth[position];
	// if no page size, assume its relative to viewport
	if (pageSize) {
		const width = (((pageSize - pagePadding) * colRatio) - cardPadding) * imageRatio;
		return `${Math.ceil(width)}px`;
	} else {
		const width = `${100 * colRatio * imageRatio}vw - ${((pagePadding * colRatio) + cardPadding) * imageRatio}px`;
		return `calc(${width})`;
	}
};

module.exports = (colspan, position, cardPaddings = defaultCardPaddings) => {
	let currentPagePadding;
	let currentCardPadding;
	let currentColspan;
	let currentPosition;
	let currentPageSize;
	let currentSize;

	return breakpointNames.reduce((sizes, breakpoint) => {
		currentPagePadding = pagePaddings[breakpoint] || currentPagePadding;
		currentCardPadding = cardPaddings[breakpoint] || currentCardPadding;
		currentColspan = colspan[breakpoint] || currentColspan;
		currentPosition = position[breakpoint] || currentPosition;
		currentPageSize = pageSizes[breakpoint] || currentPageSize;
		const size = getSize(currentPagePadding, currentCardPadding, currentColspan, currentPosition, currentPageSize);
		if (size !== currentSize) {
			currentSize = sizes[breakpoint] = size;
		}
		return sizes;
	}, {});
};
