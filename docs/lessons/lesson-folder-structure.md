# Lesson Folder / File Structure

Top categories will roughly follow the core / fixed technologies: MEAN (MongoDB, Express, Angular, Node) + Yeoman (Grunt, Yo, Bower) + NPM + Git. Express.js may be omitted / bulked into node?
Plus a few other top categories: Javascript, HTML, CSS, Workflow, Testing, Quality
All lessons will be tagged and organized/grouped in many ways so the folder structure isn't extremely important since it's only one way to organize content (some/much of which WILL span multiple categories/tags) but it's still good to keep it organized as best we can.

We'll follow a modular structure just like the code and mean-seed iteslf - each category should be "self-sufficient" as much as possible. I.e. angular directives should include how to test those directives (rather than separating tests into it's own category).

Use 'singular' rather than plural when naming - i.e. 'directive' rather than 'directives'.
Use hypens '-' and lowercase for all words / names, i.e. 'my-page' rather than 'myPage' or 'my_page'


- toc - Site map / list of all lessons
	- courses - collections of lessons
- docs - SHORT summaries (a few sentences) of key concepts - i.e. 1-3 sentences on what Angular is or what an Angular Directive is. Then LINK to external Blog posts (we write) or 3rd party resources (i.e. angularjs.org) for more info. [in general this follows the structure of the rest of the folders below - one folder per main folder/category (but typically NOT with sub-folders below that). These COULD be modularized to a 'docs' folder within EACH category/sub-folder below, but since they'll be related, some may span multiple categories, and some may be more general that any categories, this seems the best way to do it.]
	- angular
	- node
	- mongo
	- grunt
	- yo
	- bower
	- npm
	- git
	- javascript
	- html
	- css
		- less
		- scss
	- workflow
	- testing
	- quality
- angular
	- directive
		- use
			- forminput
				- angular-forminput-basic
				- angular-forminput-options-text
				- angular-forminput-options-select
		- build
		- test
	- service (factory, provider, maybe other types)
		- use
		- build
		- model - a service but specifically used for data (typically handles the $http requests and localStorage calls to read and write data and keep it in sync)
			- use
			- build
		- test
	- controller (route / page)
		- build
		- test
- node
- mongo
- grunt
- yo
- bower
- npm
- git
- javascript
- html
- css
	- less
	- scss
- workflow
	- local-setup
	- server-setup
- testing
	- jasmine
	- protractor
	- code-coverage
- quality
	- linting
	- testing [see testing section, which is big enough to get it's own top level section]
	- continuous-integration
	- conventions
	- documentation
	- modular
	- performance
	- design
