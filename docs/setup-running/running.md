# Running (App + Tests)

### App / Website / In General
1. run MongoDB (if using local install of MongoDB and it's not already running)

2. [just in case] run `npm install && bower update && bower install` (from the root directory of this app - all commands are from the root directory of this app unless noted otherwise)

3. Run grunt from the root project folder (the folder that has "Gruntfile.js" in it) to build all files. Grunt should be run after most file changes and prior to any commits. NOTE: the default `grunt` command also runs tests and requires a node test server to be running first (more below) and there are other grunt commands as well.
	1. NOTE: you'll have to re-run this command every time you update a (frontend) .less (or .scss) or .html file to rebuild assets. When in doubt, re-run grunt!
```bash
grunt q
```

4. Start the node server from the root project folder.
	1. NOTE: you'll have to re-run this command to restart the server every time you change a (backend) node.js file
```bash
node run.js
```

5. To view the site and/or documentation, open a browser and go to the following urls. The precise urls used will depend on the domain and port specified in config.json. Assuming `localhost` and `3000`, they would be:
	1. View site: `http://localhost:3000/`
	2. View api docs: `http://localhost:3000/api/help`
	3. View YUI auto documentation (make sure to run `grunt yui` first to generate these pages):
		1. frontend: open `/yuidocs/frontend/index.html` in a browser
		2. backend: open `/yuidocs/backend/index.html` in a browser
	

### Running Tests
1. Run `grunt` from the root app directory - this will run all tests:
	1. backend node.js Jasmine (API route) tests
	2. frontend Karma unit tests
	3. frontend Protractor / Selenium end-to-end (E2E) tests
	
To ONLY run BACKEND (Node) tests, run `grunt test-backend`.

To ONLY run FRONTEND (Angular) tests, run `grunt-frontend` BUT FIRST you must run the test server (this is normally auto-run by the backend tests) by doing:
- Open a NEW command prompt/terminal window and type `node run.js config=test` to run the test server (this connects to the test database and wipes it clean on each run)
	- NOTE: this used to be a required step before running ANY tests BUT it has been updated so that `app/test/all.spec.js` sets the test configuration command line args and requires `run.js` which thus self-runs the test server instead of needing to run in a separate window! And it exits when done so don't need to use forever to always keep the test server running and eating up resources!
