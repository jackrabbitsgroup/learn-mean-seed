# Conventions / Style Guide

TODO: Add final set of compiled and merged conventions.

In general, we try to follow "standards" with regard to javascript coding conventions. NOTE: see the below conventions as they OVERWRITE anything listed in the below links.
- http://javascript.crockford.com/code.html
- https://github.com/rwldrn/idiomatic.js/ (from http://addyosmani.com/blog/javascript-style-guides-and-beautifiers/ )
- https://npmjs.org/doc/coding-style.html

Additionally, all code is linted by grunt and thus must pass linting tests. The most important thing, however, is that all code be CONSISTENT and follow the same conventions. Here are some specifics:
- TAB characters should be used to indent, not spaces. (We use 4 spaces per tab.)
- Use YUIDoc-style documentation for all files: a general description at the top plus a table of contents (@toc) that summarizes the main functions and parts of the file. Each function should have its inputs and outputs (@param) detailed, together with example usage.
- Test files should be named with a `.spec.js` suffix as per the Jasmine specification.