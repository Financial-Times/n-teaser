include n.Makefile

unit-test:
	mocha 'tests/**/*.spec.js' --inline-diffs

demo-build:
	@rm -rf bower_components/n-teaser
	@mkdir bower_components/n-teaser
	@cp -r templates/ bower_components/n-teaser/templates/
	@node-sass demos/src/demo.scss public/main.css --include-path bower_components
	@$(DONE)

demo: demo-build
	@node demos/app

a11y: demo-build
	@node .pa11yci.js
	@PA11Y=true node demos/app
	@$(DONE)

test: verify unit-test a11y
