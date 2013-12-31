# Common Actions


## Add New Lesson

- **read docs** (if you haven't already done so)
	- [lessons/overview.md](overview.md)
	- [lessons/lesson-folder-structure.md](lesson-folder-structure.md)
	- [lessons/lesson-format.md](lesson-format.md)
- **ng-route**: run `yo mean-seed` and select the `ng-route` (sub)generator to create your new lesson page/controller/route
	- use the folder structure from the docs when creating your new lesson path
- **write your lesson** (use [lessons/lesson-format.md](lesson-format.md) for the boilerplate HTML to get started)
- **contents / toc**: add your lesson to the contents page
	- `modules/pages/toc/toc/toc.html`
- **buildfilesModuleGroups.json**: add your lesson to `buildfilesModuleGroups.json` (in 3 places - copy/follow the existing lessons there already and just add yours)
	- this is for tests and test coverage to run properly - lessons should have FAILING tests until the trainee / student takes the lesson so we need to keep tests and coverage for lessons / students separate from the development code (which still needs PASSING tests and to meet code coverage thresholds)
	- use `__` as a skip prefix (this module will NOT be included (or skipped, if used in `skipModules`)) to "comment out" that line
- **take/test lesson**: take your own lesson as if you were the student and confirm it works as expected



## Add New (Lesson) Docs Page
This is very similar to adding a new lesson except it's a bit simpler.

Keep your documentation short and link to external websites or blog posts for more info.

- **ng-route**: run `yo mean-seed` with `ng-route`
	- add to `docs` folder for your path and then nest in any appropriate sub-folders
- **write your doc** file
- **contents / toc**: add your lesson to the contents page
	- `modules/pages/toc/toc/toc.html`
- **buildfilesModuleGroups.json**: add your lesson to `buildfilesModuleGroups.json` (in 3 places - copy/follow the existing lessons docs there already and just add yours)
	- this is for tests and test coverage to run properly - lessons should have FAILING tests until the trainee / student takes the lesson so we need to keep tests and coverage for lessons / students separate from the development code (which still needs PASSING tests and to meet code coverage thresholds)
	- use `__` as a skip prefix (this module will NOT be included (or skipped, if used in `skipModules`)) to "comment out" that line
