const { brandAuthorDouble } = require('./utils');

const HEADSHOT_WIDTH = 75;
const HEADSHOT_BASE_URL = 'https://www.ft.com/__origami/service/image/v2/images/raw/';
const HEADSHOT_URL_PARAMETERS = `?source=next&width=${HEADSHOT_WIDTH * 2}&fit=scale-down&compression=best&tint=054593,d6d5d3`;


	// returns url and name for author headshot when brand concept is an author with a headshot
module.exports = input => {
	let headshotName;
	let author;

	if ((brandAuthorDouble(input) === true)
		&& input.authors.length > 0
		&& input.authors[0].headshot
	) {
		headshotName = input.authors[0].headshot.name;
		author = input.authors[0];
	}

	if (headshotName) {
		return {
			url: `${HEADSHOT_BASE_URL}fthead:${headshotName}${HEADSHOT_URL_PARAMETERS}`,
			width: HEADSHOT_WIDTH,
			height: HEADSHOT_WIDTH,
			sizes: HEADSHOT_WIDTH,
			widths: [HEADSHOT_WIDTH, 2 * HEADSHOT_WIDTH],
			alt: `Photo of ${author.prefLabel}`
		};
	} else {
		return null;
	}
}
