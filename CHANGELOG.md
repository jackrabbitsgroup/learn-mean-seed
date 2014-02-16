# 0.0.1
## Breaking Changes
- update npm module Protractor to 0.16.1, which updates chromedriver version and webdriver; to update:
	- delete the `selenium` folder in the root directory
	- run `./node_modules/protractor/bin/webdriver-manager update`

## Features
- add `config-mac.json` to support non-Windows (note, to use Linux just make a `config-linux.json` file and use that as the environment instead)
	- to update / use:
		- copy the template `config-environment.json` file to the root folder with: `cp app/config_environment.json config_environment.json`
		- set the `environment` key to `mac`

## Bug Fixes


# 0.0.0
## Breaking Changes

## Features

## Bug Fixes
