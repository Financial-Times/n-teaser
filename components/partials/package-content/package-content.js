const MAX_LIST_CONTENT = 3;

module.exports = input => {
	let packageContent = [];
	if (Array.isArray(input.contains) && input.contains.length > 0) {
		packageContent = input.contains;
	}

	return packageContent
		.slice(0, MAX_LIST_CONTENT);
}
