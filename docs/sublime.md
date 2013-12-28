# Sublime Text 2 Notes / Tips

## Per Project Settings

- Tab Settings apparently do NOT work?!

- Find in files exclude
	- add `folder_exclude_patterns` and/or `file_exclude_patterns` to the `folders` array (this is PER PATH/folder)
	- when doing a 'Find in Files', in the `where` field, type `<[project]>` - i.e. `<myproject>`
		- it will then search using your exclude patterns
			- NOTE: there do seem to be some bugs where excluded folders still get search results.. but it's pretty good and excludes most of them

- Clearing Find results
	- just delete the contents of the file (i.e. select all then delete) like any other file?

### Example .sublime-project file
```
{
	"folders":
	[
		{
			"path": "/C/wamp/www/test/workshop902",
			"folder_exclude_patterns": [".svn", ".git", ".hg", "CVS", "node_modules", "components", "dist"],
			"file_exclude_patterns": ["*.pyc", "*.pyo", "*.exe", "*.dll", "*.obj","*.o", "*.a", "*.lib", "*.so", "*.dylib", "*.ncb", "*.sdf", "*.suo", "*.pdb", "*.idb", ".DS_Store", "*.class", "*.psd", "*.db", "*.sublime-workspace"]
		}
	],
	"settings":
	{
	}
}
```