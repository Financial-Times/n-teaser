const modsDoesInclude = (modToTest, modsArray = []) => {
	return modsArray.includes(modToTest);
};

module.exports = (input, template, flags) => {
	const isTopStory = template === 'top-story-heavy';
	const isBigStory = modsDoesInclude('big-story', input.mods);
	const isHeavy = template === 'heavy';
	const isLarge = modsDoesInclude('large', input.mods) || modsDoesInclude('hero', input.mods);
	console.log(template, isTopStory, isBigStory, isHeavy, isLarge);
	return Boolean(
		flags.insituVideoTeaser
		&& input.type === 'Video'
		&& ((isTopStory && !isBigStory) || (isHeavy && isLarge))
	);
}
