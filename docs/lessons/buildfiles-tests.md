# Buildfiles & Tests

The lessons use tests to mark 'completion' of that lesson, meaning the raw lessons will have FAILING tests that the trainee needs to get to pass. However, for development of the lessons themselves we need to have 100% passing tests, meaning we need to keep SEPARATE the 'development code' and the 'lessons code'.

'Development code' is the code that the trainERS write - the lessons themselves PLUS the seed code.
'Lessons code' is the code that the trainEES write - to COMPLETE / take the lesson.

To achieve this separation:

- `buildfilesModuleGroups`
	- `testsProtractorNoLessons` and `testsUnitNoLessons` are used for the development code tests. These should NOT have lessons tests included, which SHOULD have some failures until the trainee completes the lessons.
	- `testsLessons` is used for the lessons code tests. The trainee will include/exclude tests / modules here as (s)he progress through the lessons.
	
Use `grunt lessons` and `grunt-lessons-*` grunt tasks to run the lessons specific building/testing (i.e. for use by trainEES). Use all existing grunt tasks as normal (for the NON-lessons/development code).