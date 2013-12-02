# Backend / Node.js

`express` is used as the (lightweight) framework with MongoDB as the database. There is NO VIEW (just controller and models) as all view code is on the frontend exclusively. The backend is slim in that the vast majority of the time it only deals with interacting with the database. The 'controllers' are just the route management and the 'models' are just the functions that do the work of CRUD (create, read, update, delete) on the database. The steps are:
1. incoming request --> controller: the controller (router) receive a request (HTTP, AJAX from frontend)
2. controller --> model: the controller calls the appropriate model function to do the actual processing (CRUD)
3. model: the model does the work and returns the result
4. model --> controller: the controller takes the result from the model (typically via a promise or other asynchronous method)
5. controller --> outgoing response: the controller sends the result back as a response
All of the above is handled in 2 files - both in the `modules/controllers` folder.


## Common / Non-modularized / Site-specific files
You'll likely have to edit these files at some point.
- `app/modules/services/security/security.js`

### `common` directory files most likely/often to be updated
- db_schema.json
- config [all config files if have to make updates]
- modules
	- services
		- security/security.js
- routes
	- api
		- index.js
		- rpc
			- api-help.html
- test
	- all.spec.js
