module.exports = value => {
	return value.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase();
};
