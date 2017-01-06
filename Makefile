include n.Makefile

unit-test:
	mocha 'tests/**/*.spec.js' --inline-diffs

test-build:
	rm -rf bower_components/n-teaser
	mkdir bower_components/n-teaser
	cp -r templates/ bower_components/n-teaser/templates/
	node-sass demos/src/demo.scss public/main.css --include-path bower_components

demo: test-build
	node demos/app

a11y: test-build
	node .pa11yci.js
	PA11Y=true node demos/app

test: verify unit-test a11y
