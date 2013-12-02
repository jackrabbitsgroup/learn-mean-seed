# Common actions


## Backend / Node.js
- Add a new api route group. To add an individual api call to an existing group, just edit the files below accordingly.
	1. Create a new folder in `app/modules/controllers` with the name of your new api endpoint namespace and fill it with the following files. In general, just copy an existing route and then edit the files to fit your new route.
		1. [your-module].api.js		The rpc route setup (endpoints, parameters, function calls)
		2. [your-module].js		The controller/model file that interacts with the database and actually does the work
		3. [your-module].test.js		Jasmine-node tests for these new routes
	2. `require` your new api file and set up the router endpoints in `app/routes/api/index.js`.
	3. Update `app/test/all.spec.js` to include and run your new tests. Typically, 3 additions need to be made:
		1. `require` [your-module].test.js file at the top.
		2. Call it in the `initModules` function. (Pass in the db, api, and any other modules you need access in your test file.)
		3. Actually run your tests. In general, these should have a `run` function that returns a promise when all tests are complete.
	4. Add an html link to `app/routes/api/rpc/api-help.html` to add your api to the reference. (The links are somewhere around line 365.)

- Add a new service or library of functions. Do **one** of:
	1. Build publicly - create a npm module and publish it then include it via `npm install`
	2. Build locally
		1. Create a new folder in `app/modules/services` with your file.
		2. `require` your new module in `app/routes/api/index.js` and pass it in to the any controller modules that need to use it.

- Add a new database collection
	1. Update `app/db_schema.json` with the new collection. Fields are technically optional but highly recommended: we use pure mongo-db-native, so a strict schema is NOT enforced. Fields listed here are just for documentation purposes.
	
	
## TODO
- create yeoman subgenerators for all common actions
	- backend/node
		- new api route/controller
		- new local service