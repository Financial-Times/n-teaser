const classModifiers = require('./class-modifiers');

module.exports = (input, template) => ['o-teaser'].concat(classModifiers(input, template).map(mod => `o-teaser--${mod}`));
