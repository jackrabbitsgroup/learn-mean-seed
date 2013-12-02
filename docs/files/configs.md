# Configs

## Configs
`app/configs` holds the configuration files for the entire app, for EVERY environment. Configs are paired - for EACH environment there's a regular config (*.json) and a test config (*.test.json). The default `config.json` should work for your localhost (local development) so you shouldn't need to change anything. However, if you have issues or get errors when running grunt or viewing the site, create a NEW pair of config files and copy/set `config_environment.json` to use these new configs.

### Creating a new config pair

1. select a unique name for your new config (i.e. assuming this is for a local/localhost environment and your name is 'john', call it `localjohn` - we'll use this name for the rest of the steps; just replace it accordingly).
2. copy `config.json` and rename it `config-localjohn.json`. Then open this file and edit the values appropriately to match your environment. Typically this means changing (at least) the following:
	1. `operatingSystem` to whatever computer you're using (i.e. `windows` or `mac`)
	2. `forever` to `0`
	3. `server.domain` to `localhost`
	4. blank out the `sauceLabs` values so the Protractor tests will run locally using the Selenium Standalone Server.
3. copy `config-localjohn.json` and rename it `config-localjohn.test.json` and edit the values appropriately for your TEST environment. Typically this means changing the following:
	1. `server.port` (to a DIFFERENT port than you're using on the non test config)
	2. `server.socketPort` (to a DIFFERENT port than you're using on the non test config)
	3. `db.database` - i.e. to the same value as `app.name`
4. copy and set the `config_environment.json` to use this environment with: `cp app/config_environment.json config_environment.json` and then edit the file to set the `environment` key of your new environment: `localjohn`.

