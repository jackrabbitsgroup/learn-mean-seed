# Deploy
Steps to deploy your app to a live (linux) staging and/or production server

If you haven't done so already, purchase a (new) Linux server (i.e. from Digital Ocean, Rackspace, Amazon) and follow [server-linux.md](server-linux.md) to install/setup your Linux server.

## Getting (& updating) files to (another) server

1. [on new server] Install global npm packages: `sudo npm install -g grunt-cli yo bower generator-mean-seed karma yuidocjs forever less`
2. [locally on your computer / original server] create a new set of configs (regular and test) in `app/configs` for the new server environment by copying the existing `config.json` and renaming it `config-[new-server-environment].json` and updating it accordingly, i.e. for a production or staging linux server change/set at least the following:
	1. `operatingSystem` to `linux`
	2. `forever` to `1` so it will auto restart forever on code changes
	3. `server.domain` to the domain (or IP address) of the new server
	4. `sauceLabs` credentials (if you don't already have a Sauce Labs account, create one (they have free tiers) since the selenium standalone server with chrome doesn't currently work on linux (while we could try to get phantom-js working, it's better to run on multiple platforms anyway)
	5. [should also update unique keys and credentials, such as facebook app id, google app id, etc.]
	6. then copy this new config file to make the test config, which should be named `config-[new-server-environment].test.json` and edit it to change at least:
		1. `server.port`
		2. `server.socketPort`
		3. `db.database` - i.e. to `test_temp`

Then do **one** of the following:

### Continuous Integration (CI) with Concrete + Github
RECOMMENDED approach!

1. create a Github repo on github.com (if you haven't already) and push to it
2. [on new server] setup git config on the new server for your user
	1. `git config --global user.name "<your name>"`
		1. i.e. git config --global user.name "Joe Bob"
	2. `git config --global user.email "<your email>"`
		1. i.e. git config --global user.email youremail@email.com
	3. `git config --global --add color.ui true`
3. [on new server] install Concrete CI. The regular one/main repo is good but doesn't seem to have auto Git web hooks built in so I used this fork instead: https://github.com/edy/concrete
	1. `git clone https://github.com/edy/concrete.git /path/to/concrete`
	2. set permissions for the new `concrete` folder
		1. `sudo chown -R root:developers /path/to/concrete`
		2. `sudo chmod -R g+w /path/to/concrete`
	3. `cd /path/to/concrete`
	4. `npm install`
		1. NOTE: if you get an EACCESS / permission denied error during the npm install, find the folder that had permissions issues (from the log output) and run `sudo chown -R $USER [path to problematic folder]`.
			1. http://foohack.com/2010/08/intro-to-npm/#what_no_sudo
4. [on new server] Do some setup
	1. clone the github repo (we'll just have to do this manually once) - `git clone [repo URL] [/path/to/cloned/repo]` - make sure to use the HTTPS git url - otherwise will get a 'Permission denied (publickey).' error!
		1. set permissions on this folder (especially if you cloned with `sudo`)
		2. go into the repo - `cd /path/to/cloned/repo`
	2. copy and set the `config_environment.json` to use this environment with: `cp app/config_environment.json config_environment.json` and then edit the file to set the `environment` key to your new environment (the SAME name you used when creating the new `config-[new-server-environment].json` file earlier - these MUST match!)
	3. add the concrete runner to the git config so concrete will run: `git config --add concrete.runner "npm install && bower update && bower install && grunt --type=prod"`
	4. configure git hooks for worked and failed
		1. create (if not already present) `.git/hooks/build-failed` and add `node ci.js build=failed` to it, i.e. using `echo 'node ci.js build=failed' > /path/to/.git/hooks/build-failed`
		2. create (if not already present) `.git/hooks/build-worked` and add `node ci.js build=worked` to it, i.e. using `echo 'node ci.js build=worked' > /path/to/.git/hooks/build-worked`
		3. set permissions so the hooks can be run - `sudo chmod -R +x /path/to/.git/hooks`
5. [on new server] run concrete server with forever: `forever start /path/to/concrete/bin/concrete -p [concrete port] .`
	1. Open a browser to `http://[your domain/ip]:[concrete port]` to see your continuous integration server!
6. On github.com add a webhook to the concrete server so it will run on each git push!
	1. In your repo on github.com, click on `Settings` then `Service Hooks` then `WebHook URLs` and add a URL: `http://[your domain/ip]:[concrete port]/webhook`
7. [locally / on original server] Do a Git push (i.e. `git push origin master`) and then refresh your Concrete page and you should see a new build running!
	1. Now each time you (locally) do a `git push` to github, your 2nd server will automatically get updated, tests run, etc.!


### Direct, no CI (or Github)
1. [on new server] make `git` directory & initialize bare repo
	- `sudo mkdir /var/git`
	- `sudo mkdir -p /var/git/project.git`
	- `sudo git init --bare /var/git/project.git`
	- set group permissions (do the same for `/var/www` if you haven't already)
		- `sudo chgrp -R developers /var/git/project.git`
		- `sudo chmod -R g+swX /var/git/project.git`
2. [on new server] clone the local repo
	- `git clone /var/git/project.git /var/www/project`
3. [on local computer (where existing files are) - open a NEW terminal/command window and `cd` to the local copy of the website on your computer] add a remote (from local machine) to the server repo then push to it.
	- `git remote add prod ssh://lmadera@111.111.111.111/var/git/project.git`
	- `git push prod master`
4. [on new server] set permissions for /var/www/project folder then pull from local repo we just pushed to
	- `sudo chown -R ubuntu:developers /var/www/project` - NOTE: this assumes a 'ubuntu' user exists - if it doesn't try 'root' instead OR your username (i.e. `sudo chown -R root:developers /var/www/project`)
	- `sudo chmod -R g+w /var/www/project`
	- `cd /var/www/project`
	- `git pull origin master`
5. [on new server] setup site as normal (see main README for steps - set config, npm install -g, grunt, etc.).
6. [on new server] start server and keep it running with forever.
	- `forever start -w run.js`
		- `-w` command will auto-restart the process if it fails and is optional (it can cause (memory) issues during grunt builds / updates while code is rapdily changing)
7. [on new server] Restarting server / getting file/code updates
	1. `cd /var/www/project`
	2. `forever stop [forever process uid]`
		1. can use `forever stopall` to stop ALL processes but this is not a good idea - should only stop THIS one!
	3. `git pull origin master`
	4. `npm install && bower install`
	5. `grunt q --type=prod`
	6. `forever start run.js`
