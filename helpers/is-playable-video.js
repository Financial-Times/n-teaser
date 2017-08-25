const modsDoesInclude = (modToTest, modsArray = []) => {
	return modsArray.includes(modToTest);
};

module.exports = input => {
	const isTopStory = input.template === 'top-story-heavy';
	const isBigStory = modsDoesInclude('big-story', input.mods);
	const isHeavy = input.template === 'heavy';
	const isLarge = modsDoesInclude('large', input.mods) || modsDoesInclude('hero', input.mods);

	return Boolean(
		input.flags
		&& input.flags.insituVideoTeaser
		&& input.type === 'Video'
		&& ((isTopStory && !isBigStory) || (isHeavy && isLarge))
	);
}
