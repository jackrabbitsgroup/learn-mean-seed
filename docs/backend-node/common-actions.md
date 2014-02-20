# Common actions


## Backend / Node.js
- Add a new api route/controller group: `yo mean-seed` and select `node-controller` then follow the prompts

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
		- new local service