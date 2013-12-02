# server setup

## Mac setup / installing
### General notes
- adding programs to 'path' (type in terminal): export PATH=$PATH:/new_path_entry
- view path: echo $PATH
- remember to type `sudo` if you get permissions errors or something doesn't work
- most/all commands will be done from Terminal (command shell prompt) so open a new terminal window

1. install text editor of choice (i.e. Sublime, Text Wrangler)
2. install git ( http://git-scm.com/downloads )
	1. follow the default options during installation
	2. setup your github authentication
		1. https://help.github.com/articles/set-up-git
		2. https://help.github.com/articles/generating-ssh-keys
3. Install node.js ( http://nodejs.org/download/ )
	1. Notes after installing:
		Node was installed at
		/usr/local/bin/node
		npm was installed at
		/usr/local/bin/npm
		Make sure that /usr/local/bin is in your $PATH.
4. Install MongoDB ( http://www.mongodb.org/downloads )
	1. IF you already have MacPorts OR Homebrew, use whichever you already have installed. Otherwise, if you have neither, pick one and install them. I used Homebrew BUT note that it requires XCode (4GB or Command Line Tools for XCode (2GB - only available for Lion & Mountain Lion)).
		1. for Homebrew
			1. use the homebrew installation at the top
			2. [commands copied from link above]
			3. you will need xcode (just the basic part "command line tools for xcode", not the full thing) - https://github.com/mxcl/homebrew/wiki/Installation
				1. try this link: http://www.moncefbelyamani.com/how-to-install-xcode-homebrew-git-rvm-ruby-on-mac/
			4. install homebrew (if you don�t already have it)
				1. `ruby -e "$(curl -fsSkL raw.github.com/mxcl/homebrew/go)"`
				2. `brew update`
				3. `brew install mongodb`
			5. add 'mongod' to your path so it can be run from any directory in terminal
				1. export PATH=$PATH:[/new_path_entry]
				2. path is listed in the output for the homebrew install mongodb command - look at the 'summary' section and there�s a path there
				3. `export PATH=$PATH:/usr/local/Cellar/mongodb`
			6. start mongod service with `mongod`
			7. if you get an error about /data/db, you need to create that directory first
				1. `sudo mkdir -p /data/db`
				2. `sudo chown 'id -u' /data/db` OR if you get an 'invalid argument' error for that command, try:
					1. http://stackoverflow.com/questions/7948789/mongodb-mongod-complains-that-there-is-no-data-db-folder
						1. `sudo chmod 0755 /data/db`
						2. `sudo chown mongod:mongod /data/db`
			8. NOTE: to manually use MongoDB, it requires running two terminal windows - one to run the service (mongod) and another for the actual `mongo` command to get into the database. EACH TIME you startup your computer and/or want to use a site, you'll need to FIRST run `mongod` to get the mongo database running.
5. Install PhantomJS ( http://phantomjs.org/download.html )
	1. Once it's downloaded, add it to your system PATH (see above for how to add things to your path)
6. Install Java Runtime Environment (JRE) for running the Selenium Standalone Server for Protractor tests
	1. first check if you already have java installed by typing `java` on the command line - if it says something like 'command not found' that means it's not installed and/or it's not on your system PATH. Check your system PATH and add it if you already have Java installed, otherwise, follow the remaining steps below.
	2. go here: http://www.oracle.com/technetwork/java/javase/downloads/index.html
	3. click the 'JRE' download button then select the version that matches your environment / operating system
	4. download then install
	5. add to your system PATH (so you can run `java` from the command line from any location), i.e. `;C:\Downloads\Website\JavaRE\bin`

