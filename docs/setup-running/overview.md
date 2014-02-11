# Setup and Running Overview

1. Assumptions / Computer Basics
	1. See [assumptions.md](assumptions.md)
2. Global Install / Setup Server
	1. See appropriate instructions:
		1. Mac: [server-mac.md](server-mac.md)
		2. Windows: [server-windows.md](server-windows.md)
		3. Linux: [server-linux.md](server-linux.md)
3. Local Install / Get & Setup Code
	1. New app: See [setup-detailed.md](setup-detailed.md)
	2. Existing app / code repository: See [cloning.md](cloning.md)
4. Run the app
	1. See [running.md](running.md)
5. Make code changes
	1. Use the generator-mean-seed [generators](https://github.com/jackrabbitsgroup/generator-mean-seed/blob/master/docs/generators/modules.md)
		1. Run generators with `yo mean-seed` from the command line
	2. See [workflow.md](workflow.md)
6. Go live
	1. To deploy to a (linux) server so others can see your code at a public website URL (up until now, everything has been on 'localhost' so is only visible on YOUR personal computer), do the following:
		1. Purchase hosting (i.e. from Digital Ocean, Rackspace, AWS)
		2. See [deploy.md](deploy.md)
		