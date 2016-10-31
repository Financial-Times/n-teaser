include n.Makefile

unit-test:
	mocha 'tests/**/*.spec.js' --inline-diffs

test:
	verify
	unit-test
