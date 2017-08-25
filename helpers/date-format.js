/* eslint no-console: 0 */
'use strict';

const dateFormat = require('dateformat');

module.exports = function (date, format) {
	try {
		return dateFormat(date, format);
	} catch(err) {
		console.log(err);
		return '';
	}
};
