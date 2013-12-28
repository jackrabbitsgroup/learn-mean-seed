# Workflow

There are a lot of tools we leverage but they're virtually all assimilated in with Git and Grunt.

## Short version of commands (in order)
- `git pull origin master`
- `grunt`
- Make changes, run `grunt q`, and test (manually & automated). Repeat until done.
- `grunt`
- `git add -A`
- `git commit -m '[descriptive message here]'`
- `git pull origin master`
- `git push origin master`


## Steps (More Details)
1. Get any changes that OTHER developers made
	1. Type `git pull origin master` to re-sync your code with any changes other developers may have made.
		1. This assumes your remote repository is named `origin` and your branch is `master`, replace accordingly if not. Use `git remote -v` to list/view your remotes and `git branch -v` to list/view your branches. In general the command is `git pull <remote> <branch>`.
	2. Run `grunt` to rebuild the code with these new changes and ensure it's good code. This will also check and alert you if core files changed (i.e. new dependencies introduced or updated configuration) that will require a manual update or two by you.
		1. As with almost all commands, run this from the root folder of the site (the folder that has `Gruntfile.js` in it)
		2. If `package.json` or `bower.json` changed, first run `npm install && bower update && bower install` (again run from root folder) THEN (re-)run `grunt`.
		3. If a `config*.json` file changed, first update/confirm any local/custom config-*.json files are up to date THEN (re-)run `grunt`.
2. Make and test your changes
	1. Make some code changes (locally on your own computer).
		1. Make sure to also write automated tests for your new changes! Use `grunt test` to run just tests.
	2. Run `grunt q` to rebuild the code with your new changes.
	3. Manually test/view the changes in a browser to ensure your changes are good.
		1. Make sure MongoDB & node are running first (see [running.md](running.md) for more info)
	4. Run `grunt` to run automated tests and quality control checks to ensure your code is good and bug free.
		1. NEVER PUSH CODE THAT FAILS A GRUNT BUILD! This is our quality control check and any code that doesn't pass will be auto-rejected by the Continuous Integration server anyway and break the build and halt updates for EVERYONE until the build is fixed - don't do it!
3. Use Git to add, commit, and push your changes
	1. `git add -A` to add your files
		1. the `-A` will 'stage' deleted and new files as well as just modified ones - this will ensure ALL changed files are added.
	2. `git commit -m '[descriptive message here]'` to commit your changes
		1. Follow Git Commit Message Conventions (see below)
	3. Run `git pull origin master` again in case any new changes were introduced by other developers while you were making changes
		1. If there were changes, re-run `grunt`, etc. (repeat Step 1)
	4. `git push origin master` to push (this re-syncs the central repo by adding your changes in so other developers can 'pull' them down later)
	
** Make sure to run grunt before any code push to ensure all code is high quality (i.e. LINTED, TESTED, DOCUMENTED) before submitting ANY code!! **



## Grunt Dev/Test tasks

These are to auto build/run tests/reload as you're working to avoid having to type things like `grunt q` all the time.

For each separate (grunt) command, you'll need another command window open to run it. A typical workflow would be as following:

1. `node run.js` in command window 1 (this runs the actual server so you can view the site)
2. open a browser (i.e. Firefox, Chrome) to `http://localhost:3000` (or whatever domain/port you've set in `config.json`) to see the site
	1. turn on the LiveReload browser extension [see below]
3. `grunt dev` in command window 2 (this will auto build, test, and reload your app in the browser for you)
4. [optional] `grunt dev-karma-cov` to write frontend unit test coverage reports

See [running.md](../setup-running/running.md) and `Gruntfile.js` for more info.

### Live Reload
[Live Reload](http://livereload.com/) auto-refreshes your browser for you when files change so you don't have to constantly press reload (or `F5` or `Ctrl+F5` to clear cache and reload the page to see your changes).
Grunt (with the `grunt dev` tasks) is set up to use live reload with the browser extensions so you just need to install them and activate them - then grunt will do the rest!
	- to "activate" the browser extension, just click it (just like Firebug) each time you open a new browser window.

- http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-



## Best practices with GIT

- commit, pull, and push often. At least once a day, often more. Each time you make changes and have a stable, bug free, complete version of the code, push/sync it - usually only a few or even just one file change(s) at a time. This will reduce frequeny of manual merge conflicts.



## Git Commit Message Conventions

- [Full details here](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#) but basically:
	- <type>(<scope>): <subject>
	- where:
		- <type> is one of:
			- feat (feature)
			- fix (bug fix)
			- docs (documentation)
			- style (formatting, missing semi colons, etc.)
			- refactor
			- test (when adding missing tests)
			- chore (maintain)
		- <scope> specifies the place / code area (potentially a file if just one file) that was changed
		- <subject> is the short description of what was changed
	- I.e. `feat(event date): Add timezone support`
	