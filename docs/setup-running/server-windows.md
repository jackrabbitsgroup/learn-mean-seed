# server setup

## Windows setup / installing
### NOTE: to add things to environment variables, right click on `My Computer` from Windows Explorer and click `Properties` then `Advanced` then `Environment Variables` then `System Variables` then double click/edit the `Path` variable. Once you've edited/changed your Path, save and close and then RESTART any open command prompts / terminal / Git Bash windows for the change to take effect.

1. install text editor of choice (i.e. Notepad++)
2. install git ( http://git-scm.com/downloads )
	1. follow the default options during installation
	2. setup your github authentication
		1. https://help.github.com/articles/set-up-git
		2. https://help.github.com/articles/generating-ssh-keys
3. Install node.js ( http://nodejs.org/download/ )
4. Install MongoDB ( http://www.mongodb.org/downloads )
	1. Follow the instructions to intall: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/
		1. Add `[path to your mongo installation folder]\mongodb\bin` to your environmet so you can type `mongod.exe` and `mongo` from any location and it will work.
		2. NOTE: `mongod.exe` may only work when specifying the `--dbpath [path to mongodb]\data` command line option. You SHOULD be able to add that to the `mongod.cfg` file so you don't have to type it every time but for some reason it wasn't working unless typed on the command prompt sometimes... UPDATE: Try restarting your computer then opening a command prompt and typing `mongo` and it may work now! :) If not, just create the folders in the default location... create a 'data' folder on 'C:' drive then create a 'db' folder in the 'C:\data' folder and then it should work..
	2. NOTE: Windows XP is NOT supported as of MongoDB 2.2 (or actually 2.1.2?) so use 2.0.9 - http://docs.mongodb.org/ecosystem/platforms/windows
	3. NOTE: make sure to match the build (i.e. 64 bit vs 32 bit) to your computer. Ideally use a 64 bit build since the 32 bit builds of mongo/ubuntu have a 2GB memory limit! http://www.mongodb.org/downloads#32-bit-limit.
	4. install it as a service so you don't have to run 2 command windows every time (it will start when your computer starts and run in the background).
		1. MongoDB requires 2 windows to run manually - one to run the service `mongod` and another to run the actual `mongo` command to get into the database. But if you install as a service, `mongod` will always be running so you can skip that first step.
		2. restart your computer for this to work if you're having issues.. After restart you should just be able to type 'mongo' from a command prompt and it should work.
5. Install PhantomJS ( http://phantomjs.org/download.html )
	1. Once it's downloaded, add it to your system PATH (see above for how to get to your system Path)
		1. Add in `;[path to phantomjs folder]\`, i.e. `C:\downloads\website\phantomjs\` then save and restart your command prompt window.
6. Install Java Runtime Environment (JRE) for running the Selenium Standalone Server for Protractor tests
	1. first check if you already have java installed by typing `java` on the command line - if it says something like 'command not found' that means it's not installed and/or it's not on your system PATH. Check your system PATH and add it if you already have Java installed, otherwise, follow the remaining steps below.
	2. go here: http://www.oracle.com/technetwork/java/javase/downloads/index.html
	3. click the 'JRE' download button then select the version that matches your environment / operating system
	4. download then install
	5. add to your system PATH (so you can run `java` from the command line from any location), i.e. `;C:\Downloads\Website\JavaRE\bin`

	