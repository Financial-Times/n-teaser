const MAX_RELATED_CONTENT = 3;

module.exports = input => {
	let relatedContent = [];
	if (Array.isArray(input.curatedRelatedContent) && input.curatedRelatedContent.length > 0) {
		relatedContent = input.curatedRelatedContent;
	} else if (input.displayConcept && Array.isArray(input.displayConcept.latestContent)) {
		relatedContent = input.displayConcept.latestContent
			.filter(content => content.id !== input.id);
	}

	return relatedContent
		.slice(0, MAX_RELATED_CONTENT)
		.map(item => ({ data: item, classModifiers: [hyphenatePascalCase(item.type)] }));
}
