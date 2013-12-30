# Lessons

Lessons will have 'tags' and that's how they'll be identified and searched for but we'll also follow some folder and naming conventions for organization. This is similar to a category organization structure.


### Video Game Fun
We've toyed with the idea of making this teaching/learning like a video game with 'lessons' being 'levels', 'courses' being 'stages' or 'worlds' and being able to select a difficulty at the start. Then the levels would be the same but would be easier or harder concepts requiring less or more prior knowledge.


### Sparknotes, Docs, Linking
Lessons should cover the UNIQUE and/or "sparknotes version" of topics when possible (i.e. just link to existing tutorials if they already exist - such as angularjs.org, yeoman's writing generators tutorial). We're focusing on teaching the 20% they'll use 80% of the time so everything we teach should be TARGETED and SPECIFIC to a particular USE CASE (to MEAN Seed), not a general core principle - just link to existing resources for those.

Similarly, keep text to a minimum and focus on demos and examples instead. Use the 'docs' folder in 'pages' for QUICK (a few sentences) summaries of things and the LINK to BLOG posts or 3rd party resources for more details. No paragraphs or essays within the lessons or docs themselves.


### Levels / Layers / Difficulties
Lessons should have "difficulty levels" (layers) such that each lesson (or group of lessons) has the same end result but the percentage of code the student writes is less for easier levels. Harder levels also introduce more obscure nuances. On a basic level, all code/projects start with USING ("as is") 3rd party code and become more customized and "written from scratch" with time and we'll follow this as well. Basically they start with using high level, pre-built tools/code and then take ownership of it bit by bit until they're building their own. In general easy to hard difficulty looks like:

1. 'use' - using existing code (i.e. a directive we've written - this doubles as documentation and training on individual (public) modules we've written) with customization just being passing in different options.
	1. just copy-paste the base / simple case
	2. add in options / parameters
2. 'build' - creating new code from scratch (i.e. writing their own directive)
3. 'nuances' - this is similar to a targeted collection of Q&A (i.e. an "AngularJS" tagged section of StackOverflow) in that it addresses some more complex principles and 'gotchas' that are time savers for advanced coders but that aren't "required" to know (since they're not common enough to come up a lot).


### Simple, Specific, Small
Lessons should be simple, specific, and small - typically each lesson should only teach ONE thing. Group lots of lessons together to teach multiple related things; do NOT combine them all into one big lesson. KISS (Keep It Simple Stupid) and modular (just like code). This high modularization allows easy and specific referencing in other lessons and ensures we don't overwhelm students.
In general each 'use' lesson group should have a 'basic' and one or more 'options' lessons.


## Structure

### Page / Lesson Structure
- see [lesson-format.md](lesson-format.md)


### File / Folder Structure
- see [lesson-folder-structure.md](lesson-folder-structure.md)
