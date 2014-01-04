# Lesson Format

Each lesson will be its own page and will typically have the following:

- title - A brief, descriptive header for the lesson.
- location - The path to the page's files.
- summary - Optional. 1-2 sentence summary of the lesson.
- prereqs - A list of links to lessons (or possibly external pages) that the student should be familiar with.
- body - Place any and all of the lesson's text and html here.
- challenges - A list of tasks for the student to do to test knowledge gained from the lesson.
- sandbox - A blank div intended for students to add or edit code. May be pre-filled with code as necessary. Students should not need to edit any html outside this container.

Teachers are strongly encouraged to copy an existing lesson's html file and simply edit as needed.

## Boilerplate HTML
```js
<div class='lesson' ng-controller='[SomeCtrl]'>
	<div class ='lesson-title'>[Some Title]</div>
	<div class ='lesson-location'> {{pagesFullPath + '[some/path]'}} </div>
	<div class ='lesson-summary'>
		[Some Summary]
	</div>
	
	<div class ='lesson-prereqs'>
		<h4>Prereqs:</h4>
		<a class='a-block' ng-href='{{appPathLink}}[some-link]'>[Some Link Title]</a>
	</div>
	
	<div class ='lesson-body'>
		[Some Description / Teaching / Example Code]
		<code>[Some code here]</code>
	</div>
	
	<div class ='lesson-challenges'>
		<h4>Challenges:</h4>
		<div>1. [Task #1 - add as many as needed]</div>
	</div>
	
	<div class ='lesson-sandbox'>
		
	</div>
</div>
```