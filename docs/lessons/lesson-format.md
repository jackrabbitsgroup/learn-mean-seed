# Lesson Format

Each lesson will typically have:

- title + summary - what this lesson is about in 1-2 sentences.
- files - a list of the files they should open to read/edit (typically the files for this page and any associated pages/files)
- prereqs - docs and lessons that the student should be familiar with first. These should all be LINKS to other pages (internal or external), NOT actual descriptions themselves. Again, modularize!
- demo / seed code (if any is necessary) to help teach this lesson
- challenges - the tasks/tests for the student to do to complete this lesson


## Boilerplate HTML
```js
<div class='lesson' ng-controller='[SomeCtrl]'>
	<div class ='lesson-title'>[Some Title]</div>
	<div class ='lesson-summary'>
		[Some Summary]
	</div>
	<div class ='lesson-location'> {{pagesFullPath + '[some/path]'}} </div>
	
	<div class ='lesson-prereqs'>
		<h4>Prereqs:</h4>
		<a class='a-block' ng-href='{{appPathLink}}[some-link]'>[Some Link Title]</a>
	</div>
	
	<div class ='lesson-body'>
		<h4>Lesson:</h4>
		[Some Description / Teaching / Example Code]
		<code>[Some code here]</code>
	</div>
	
	<div class ='lesson-challenges'>
		<h4>Challenges:</h4>
		1. [Task / test #1 - add as many as you need / are relevant]
	</div>
	
	<div class ='lesson-sandbox'>
		
	</div>
</div>
```