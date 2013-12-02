# Grunt (Build Tool)

Grunt is the most heavily used tool. It (can) automate every build step and task into ONE command and currently does so with the exception of npm and bower installs/updates (though that could be added). `grunt q` will likely be run more than any other command as this builds the app files. `grunt` (the full version) is used after every `git pull` and prior to every `git push` as it runs automated tests and ensures code quality standards.

A non-exhaustive list of what Grunt does (see `Gruntfile.js` for more info)

- get and check configuration
	- pull in the appropriate config*.json file
	- check that dependencies (npm) and configs are up to date
- use buildfiles plugin to:
	- group appropriate files together for use elsewhere (i.e. including resources in index.html, for use in other grunt tasks, including test specs, templating/generating files based on the configuration). This replaces files globbing with more fine tuned control.
	- template out *-grunt* files to final generated files based on the config environment
- lint (jshint) - syntax check (Javascript) code
- set FontAwesome variables.less/variables.scss font path appropriately
- generate CSS from LESS/SCSS
- generate compiled/concatenated Angular $templateCache Javascript file from HTML partials/templates
- concatenate and minify (uglify) code (Javascript and CSS)
- run automated tests & check code coverage
	- backend Node Jasmine API route / integration tests
	- frontend Karma unit tests
	- frontend Protractor end-to-end tests
- copy files for other deploys/builds (i.e. Phonegap, TriggerIO)
- generate YUIDoc Documentation
	

### Command-Line Usage

Run this from the root directory, where the `Gruntfile.js` is located.

```bash
grunt
```
This will auto-run tests.


### Command-Line Usage, for production.

This will cause minified files to be referenced in the app's `index.html` file, among other things.

```bash
grunt q --type=prod
```

### Other Command-Line Grunt Tasks
There may be more than the ones listed below, but these are the most important. See `Gruntfile.js` for the full list.

```bash
# Run a subset of grunt build tasks, for quicker execution. This skips the tests, among other things. This will likely be your most common command as it needs to be run each time a .less/.scss or .html file changes.
grunt q

# Build YUI docs
grunt yui
```

### Versioning
The manual setup tasks (such as updating `configs` or running `npm install`, `bower install`) need to be periodically updated. To ensure each server is up to date, grunt will not run unless the versions match accordingly.
- If you change `package.json` or a `configs` file, increment the `versions` key accordingly in `app/configs/config.json` and also update the `curVersions` object in `Gruntfile.js` to match. This will then prevent grunt from running until the local environment is brought up to date by re-syncing config.json or running `npm install`.
- After pulling code: Follow the console instructions upon running `grunt` if it says your files are out of date.
