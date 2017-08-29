const qs = require('querystring');

const capiRX = /^https?:\/\/(?:com\.ft\.imagepublish\.prod(?:-us)?\.s3\.amazonaws\.com|im\.ft-static\.com\/content\/images)\/([0-9a-f-]+)(?:\.img)?$/i

module.exports = (url, params = {}, { host = 'https://www.ft.com/__origami/service/image/v2/images/raw/' } = { }) => {
	//if the url is already an image service URL, serve it as is
	if(url.includes(host)) {
		return url;
	}

	const defaultOptions = {
		source: 'next',
		fit: 'scale-down',
		compression: 'best'
	};
	const options = Object.assign({}, defaultOptions, params);
	const capiUUID = (capiRX.exec(url) || [])[1];

	return `${host + (capiUUID ? 'ftcms:'+capiUUID : encodeURIComponent(url))}?${qs.stringify(options)}`;
};
