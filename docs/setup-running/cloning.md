# Cloning

Follow these steps for duplicating the app/website/code to OTHER servers/machines AFTER Yeoman has been run.

Give these steps to any fellow developers for them to get set up - they do NOT need to run Yeoman since you've already generated the app for them - the main generator for Yeoman only needs to be run ONCE (and potentially can be used for updates). Though other developers WILL use other Yeoman generators (i.e. for creating a new route), just not the main/core generator that builds the app from scratch the first time.

NOTE: all commands should be run in a terminal/command prompt window.
In general you'll have 2-3 terminal/command prompt windows open at once - one for running MongoDB (if not running by default / as a service), one for running node.js, and one for commands (mostly grunt)

1. machine (global / program) installs (if you don't have them already)
	1. install git, nodejs, mongodb, phantomjs, java - see [here for Mac](server-mac.md) or [here for Windows](server-windows.md) or [here for Linux](server-linux.md)
	2. `sudo npm install -g grunt-cli yo bower generator-mean-seed karma yuidocjs forever less`
	3. IF using Github (to clone/push/pull from), set it up:
		1. `git config --global user.name "<your name>"`
			1. i.e. git config --global user.name "Joe Bob"
		2. `git config --global user.email "<your email>"`
			1. i.e. git config --global user.email youremail@email.com
		3. `git config --global --add color.ui true`
2. Clone the Git repository
	1. In command prompt, navigate to the folder where you want the app to be created in
		1. `cd /path/to/parent/folder`
	2. `git clone [repository location] [newFolderNameToCloneInto]`
	3. Go into your newly cloned directory: `cd /path/to/parent/folder/newFolderNameToCloneInto`
3. [Maybe] Setup configs (see below)
4. Do some setup / installs
	1. `npm install && bower install`
		1. NOTE: you'll have to re-run this any time `package.json` or `bower.json` changes
	2. `grunt q` to build assets
		1. NOTE: you'll have to re-run this any time a `*.less` (or `_*.scss`) or `*.html` file changes
	3. `./node_modules/protractor/bin/install_selenium_standalone` - for Protractor (local) tests
5. start server and view app
	1. `node run.js` to start node server (make sure MongoDB is already running first)
		1. Type `Ctrl + C` to quit/stop
	2. open a browser to `http://localhost:3000/` to view the site/app
6. run tests (and confirm they all pass!)
	1. `grunt`
	

### More Info
See [setup-detailed.md](setup-detailed.md) and [running.md](running.md) in the `docs` folder.



## Configs
See [configs.md](../files/configs.md) in the `docs` folder
