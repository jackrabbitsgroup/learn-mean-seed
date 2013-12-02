# Frontend (AngularJS)

## Common components and conventions to be aware of and use
- LESS / styles
	- classes: Any of the LESS files in the main `less` folder should be used within HTML files. These are pre-defined common classes. BEFORE you define any styles, make sure to check these first and use them. If a style class doesn't already exist, in general create it here (unless it's super specific and will never be used again). Currently we follow this "Twitter Bootstrap style" where most pages do NOT have their own stylesheet but rather leverage pre-existing common components (directives which have their own stylesheets and/or common classes) rather than using lots of variables and mixins.
	- mixins & variables (anything in `less/mixins` and `less/variables`)
- javascript: directives & services
	- anything in the `bower_components` and/or `lib` folder (3rd party dependencies - i.e. `moment.js`)
	- `modules/directives` and `modules/services`
	
## Best practices
- MODULARIZE!!
- try to make everything a directive (if it interacts with the DOM) or service (if it does NOT interact with the DOM)
	- directives should NOT have any backend API calls or HTTP requests in them and in general should NOT modify data (use a service for that). They should simply take data and display it. They can call services to manipulate data.
	- services are where ALL data manipulation and formatting should happen
		- do NOT alter data in contollers - call a service function instead (services should typically exist for each model/data type and should have CRUD operation functions. With regards to data, controllers should ideally only have an equal assignment sign `=` for returns from function calls (to services).
		- services CAN have backend API calls if the service is a model. Model services are common and the model typically will have a `read` function that will load from one of three places (in order):
			- javascript/memory
			- localStorage
			- backend (via API/AJAX call)
				- if necessary, services may have 'transformFromBackend' and 'transformForBackend' functions that convert/format data between frontend (which may need additional display data/fields/values) and backend.
- keep controllers as slim as possible - they should ONLY handle wiring - just a bunch of function calls between different things (setting up directives, making API/AJAX calls, making service function calls)
	
## A note on how to structure common/reusable LESS/SCSS/style components
There are TWO ways to pre-define styles. There are pros and cons to each and in general the "Classes" approach is better at first and for simpler things but the "Mixins" approach is better where higher customization is needed. But the most important thing is to pick one approach and stick to it so all the HTML files are similarly structured and consistent.

1. Mixins: define styles within a LESS/SCSS mixin then define a class that uses that mixin.
	1. Pros:
		1. All changes are kept within LESS/SCSS/CSS files (no need to touch HTML files to change styles)
	2. Cons:
		1. Each HTML element needs it's own UNIQUELY named (i.e. namespaced) class. This leads to very verbose HTML files with long class names
		2. Reading an HTML file requires also having the LESS/SCSS file open to be able to understand how things are styled (the HTML file is not self-explanatory and not very useful by itself)
2. Classes: define common classes with LESS/SCSS files then reference those common classes within the HTML files
	1. Pros:
		1. Once the classes are learned, reading HTML files become self-explanatory since these common classes will show up often.
		2. Many new pages/files will require little to no new classes or styles defined (some pages won't even have a new LESS/SCSS file at all).
		3. Ensures a themed and consistent look throughout the site due to the shared classes.
	2. Cons:
		1. Have to be careful with these "global classes" to ensure no conflicts with namespacing
		2. Can make it difficult to customize things away from these global classes. Can require leveraging CSS selector precedence rules (which is messy and bad for performance) to overwrite the common styles. Without careful arhitecting from the start, it can become difficult to extend the common classes.
		3. Can lead to having many (common) classes on an element to achieve the desired look and may still need a custom class and styles - at this point it's easier to just use ONE custom class and mixins to achieve the desired look.
	3. Best practices:
		1. Keep common classes simple and modularized so it's easy to extend them.
		2. Do NOT apply styles to basic core elements (i.e. <li> or <form> elements) or with nested CSS selectors (i.e. `form input` or `form >div`) since this makes it very hard to over-ride these and can lead to unexpected behavior when you want a NON-STYLED div that accidentally is styled from these descendent and nested style rules that you weren't aware of when you wrote the HTML. It should NEVER happen that styles are applied without the developer's knowledge - every "global style" should require adding a class to the element. NOTE: Twitter Bootstrap does this and hence this rule - it's super annoying to try to over-ride Twitter Bootstrap and very time consuming and difficult to debug weird stylings that are inherited without your knowledge.. And then once you diagnose the problem it requires lots of descendent or nested selectors to over-write those default global styles which leads to bad code and bad performance. There should be virtually NO descendent or nested selectors - just pure, singular classes - except in VERY rare circumstances. This requires typing more classes in the HTML markup but pays off in the long run.

## Dependencies (3rd party resource libraries - roughly in order of most to least used)
The goal is to limit dependencies (and have them Angular specific when used) as much as possible. jQuery and jQuery UI is currently NOT used so avoid it except in very extreme cases (since adding it will incur a 75 to 200kb cost!). Use AngularJS's built in jQLite. See http://docs.angularjs.org/api/angular.element for more information.
Put ALL dependencies in `bower.json` (ideally) or in the `lib` folder (if not bower supported) to clearly designate that these files are 3rd party code.

IMPORTANT: When adding 3rd party code, make sure to desiginate them as such (minified) in `buildfilesModules.json` so these files are NOT linted and minified by grunt since we should be getting already minified files and don't want to mess with 3rd party code. Double minification can cause issues.


## Frameworks, MVC (Model View Controller) and Flow
AngularJS is an MVC (Model View Controller) Javscript frontend framework. 'Views' are the HTML template partial files, the 'controllers' are the javascript controllers and 'models' take a bit broader definition as both are the $scope variable data bindings (used in the HTML templates) and as javascript data stored (i.e. in memory or localStorage - typically copies of backend AJAX retrieved data). Angular directives (modularized components holding the 'view', 'controller' and 'model' for this component) and services (data - mostly 'models') are the most widely used components.

The typical steps (or flow) of the frontend architecture is:

1. index.html --> router: `index.html` is the main entry point for ALL pages and does the initial setup (loading all resources). Via Angular's `ng-view` directive, this goes to `common/js/app.js` to route to the appropriate page
2. router + auth --> load specific page (partial): `common/js/app.js` is the router to go the correct page (as specified in the URL). This also first checks authentication (i.e. see if the user is logged in or not) and redirects accordingly. Any common, pre-page-load action happens via functions called here. Currently it's just `modules/services/auth`. Upon successfully authentication, the specific page is called/loaded.
3. page partial --> page controller + directives: The correct page partial is loaded and that HTML partial (almost always) references the relevant javascript controller (which holds the $scope and other javascript data used for rendering the page and stuffing the HTML template). Any Angular directives are also called via the HTML partial.
4. page controller --> services: controllers dependency inject any Angular services they need and use them accordingly.
5. current page --> new page: Via <a ng-href> HTML links or direct $location.url redirects via the javascript controller, user actions lead to changing to new pages (go back to step 2 with the router).
