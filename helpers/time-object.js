const { LIVEBLOG_MAPPING } = require('./utils');
const ONE_HOUR = 1000 * 60 * 60;

//returns prefix for timestamp (null / 'new' / 'updated')
const getTimeStatus = input => {
	const now = Date.now();
	const publishedDate = new Date(input.publishedDate).getTime();
	const firstPublishedDate = new Date(input.firstPublishedDate).getTime();
	let status = null;
	if (now - publishedDate < ONE_HOUR) {
		if (publishedDate === firstPublishedDate) {
			status = 'new';
		} else {
			status = 'updated';
		}
	}
	return status;
}

module.exports = input => {
	if (input.status) {
		return {
			publishedDate: input.updates && input.updates[0].date,
			status: LIVEBLOG_MAPPING[input.status.toLowerCase()].timestampStatus,
			classModifier: input.status.toLowerCase()
		};
	} else {
		const timeStatus = getTimeStatus(input);
		return {
			publishedDate: input.publishedDate,
			status: timeStatus,
			classModifier: timeStatus
		};
	}
}
