# Test Coverage

Each set of tests can (and should) have test coverage, though it's usually aimed at unit tests since E2E tests can be trickier to implement and may not need to cover ALL lines of code since they're higher level - but cover everything if you can!

1. backend (Node)
	1. jasmine-node for API (route) tests
2. frontend (Angular)
	1. karma unit tests
	2. protractor E2E tests - NOT CURRENTLY COVERED
	
We use [Istanbul](https://github.com/gotwarlost/istanbul) through various (Grunt) NPM plugins:
1. karma-coverage + grunt-istanbul-coverage
2. grunt-jasmine-node-coverage-validation


## Usage
1. set your thresholds (minimum code coverage percentages) in config.json in the `test_coverage` object
2. run `grunt` (or `grunt-test` if you do not need to compile any code changes) and when the tests are run, Istanbul will automatically be run and calculate test coverage for various types (lines, statements, functions, branches) as well as auto-failing the grunt build/command if coverage is below any thresholds.
3. to see the coverage reports (and improve test coverage accordingly), go the following URL's in a browser (replace `localhost` and `3000` with your `server.domain` and `server.port` in `config.json` accordingly)
	1. jasmine-node backend tests: `http://localhost:3000/src/coverage-node/lcov-report/`
	2. angular karma unit tests: `http://localhost:3000/src/coverage-angular/[test runner browser]/` i.e. `http://localhost:3000/src/coverage-angular/PhantomJS 1.9.2 (Windows 7)/`
		1. look in the `app/src/coverage-angular` directory to see the 'test runner browser' value (the folder name)