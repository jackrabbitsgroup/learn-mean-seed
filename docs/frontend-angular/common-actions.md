# Common actions

## Frontend / AngularJS
Roughly in order of most to least common:
- To add a new route/page: `yo mean-seed` and select `ng-route` then follow the prompts
	
- To add a common component / module (directive or service), do **one** of:

	1. Use the local ng-directive or ng-service generator: `yo mean-seed` then select `ng-directive` or `ng-service` then follow the prompts
	
	2. OR, for non-app specific modules (i.e. ones you want to publicize and/or use across multiple apps), use the [angular-module generator](https://github.com/jackrabbitsgroup/generator-angular-module) to make a Bower component then include it.
		- These are SEPARATE, version controlled repos and only the final compiled *.min.js file (and potentially a *.less or _*.scss file as well for directives) is/are included here in this project. So all building and testing is done separately and then when the module is built, add it to `bower.json` and run `bower install`. This is the preferred method for all directives IF they're common enough to warrant other people wanting to use this module AND you're ready and willing to maintain it (since it will be out in the wild now, publicly available!).
		- Make sure to include / reference your new files (.js and optionally .less or .scss) in `buildfilesModules.json`
		