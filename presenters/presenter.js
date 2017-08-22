module.exports = class Presenter {
	get topLevelClasses () {
		return ['o-teaser'].concat(this.classModifiers.map(mod => `o-teaser--${mod}`))
	}
}
