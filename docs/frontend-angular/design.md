# Design

When possible, use vectors (icon font, svg) instead of rasterized images (jpg, png, gif). If you do use rasterized images, use the smallest file size possible UNLESS you need transparency, in which case you must use png.

## Vectors
### Icon Fonts
- for single color vectors
- steps
	- build an Adobe Illustrator file with a square grid (i.e. 25 x 25 pixels each, though it doesn't matter what size as it's a vector) and put one icon inside each grid / box
		- make sure each icon is a compound path (single layer / flattened) otherwise overlapping paths will invert when imported / copied into the font program
	- copy each icon to a font program (i.e. FontCreator) to create your font. This will usually save as a .ttf file
	- create the other font formats (.otf, .eot, .woff, .svg) using http://www.font2web.com/
	- copy your fonts into the `app/src/common/fonts` directory
	- add your new font to the `app/src/common/less/fonts.less` file
	- create a new `app/src/common/less/font-icon-[your font name].less` file that defines classes for each icon. Make sure to include this file with less/grunt so it's loaded
	- use/reference your icons by CSS class name
		- i.e. `<span class='icon-home'></span>`

### SVG
- for more complicated / multi-color vectors

## Non-vectors
### Images
- steps
	- 'export to Web and Devices' from Adobe Illustrator to save the image file
	- copy / move the file (or save directly) into `app/src/common/img` folder
	- use the image by referencing it in HTML with <img ng-src='{{appPathImg}}/my-image.png' />