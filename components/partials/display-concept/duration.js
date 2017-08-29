module.exports = input => {
	if (input.duration) {
		const date = new Date(input.duration);

		return {
			// https://en.wikipedia.org/wiki/ISO_8601#Durations
			iso: `PT${date.getMinutes()}M${date.getSeconds()}S`,
			ms: input.duration,
			formatted: input.formattedDuration
		};
	} else {
		return null;
	}
};
