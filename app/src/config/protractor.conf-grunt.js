<%
var cfgJson = grunt.config('cfgJson');
%>
<%
var cfgTestJson = grunt.config('cfgTestJson');
%>
// A reference configuration file.
exports.config = {
	// ----- How to setup Selenium -----
	//
	// There are three ways to specify how to use Selenium. Specify one of the
	// following:
	//
	// 1. seleniumServerJar - to start Selenium Standalone locally.
	// 2. seleniumAddress - to connect to a Selenium server which is already
	//    running.
	// 3. sauceUser/sauceKey - to use remote Selenium servers via SauceLabs.

	// The location of the selenium standalone server .jar file.
	seleniumServerJar: './selenium/selenium-server-standalone-2.35.0.jar',
	// The port to start the selenium server on, or null if the server should
	// find its own unused port.
	// seleniumPort: null,
	seleniumPort: 4444,
	// Chromedriver location is used to help the selenium standalone server
	// find chromedriver. This will be passed to the selenium jar as
	// the system property webdriver.chrome.driver. If null, selenium will
	// attempt to find chromedriver using PATH.
	chromeDriver: './selenium/chromedriver',
	// Additional command line options to pass to selenium. For example,
	// if you need to change the browser timeout, use
	// seleniumArgs: ['-browserTimeout=60'],
	seleniumArgs: [],

	// If sauceUser and sauceKey are specified, seleniumServerJar will be ignored.
	// The tests will be run remotely using SauceLabs.
	<%
	if(cfgJson.sauceLabs.user && cfgJson.sauceLabs.key) {
	print("sauceUser: '"+cfgJson.sauceLabs.user+"',\n");
	print("\tsauceKey: '"+cfgJson.sauceLabs.key+"',\n");
	}
	else {
	print('sauceUser: null,\n');
	print('\tsauceKey: null,\n');
	}
	%>

	// The address of a running selenium server. If specified, Protractor will
	// connect to an already running instance of selenium. This usually looks like
	seleniumAddress: null,
	// seleniumAddress: 'http://192.168.1.6:4444/wd/hub',
	// seleniumAddress: 'http://localhost:4444/wd/hub',

	// ----- What tests to run -----
	//
	// Spec patterns are relative to the location of this config.
	specs: [
		// 'spec/*_spec.js',
		// '../test/e2e/**/*.scenarios.js',
		// '../../test/e2e/**/*.scenarios.js',		//need extra ../ because inside one more directory!
		<%
		var filePaths = grunt.config('filePathsTestProtractor');
		for(var ii=0; ii<filePaths.length; ii++) {
			if(ii !=0) {
				print('\t\t');
			}
			print('"../../'+filePaths[ii] + '",\n');
		}
		%>
	],

	// ----- Capabilities to be passed to the webdriver instance ----
	//
	// For a full list of available capabilities, see
	// https://code.google.com/p/selenium/wiki/DesiredCapabilities
	// and
	// https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
	capabilities: {
		'browserName': 'chrome'
		// 'browserName': 'phantomjs'
		// 'browserName': 'firefox'
	},

	// A base URL for your application under test. Calls to protractor.get()
	// with relative paths will be prepended with this.
	// baseUrl: 'http://localhost:8000',
	baseUrl: 'http://<% print(cfgTestJson.server.domain); %>:<% print(cfgTestJson.server.port); %>',

	// Selector for the element housing the angular app - this defaults to
	// body, but is necessary if ng-app is on a descendant of <body>  
	rootElement: 'body',

	// A callback function called once protractor is ready and available, and
	// before the specs are executed
	// You can specify a file containing code to run by setting onPrepare to
	// the filename string.
	onPrepare: function() {
		// At this point, global 'protractor' object will be set up, and jasmine
		// will be available. For example, you can add a Jasmine reporter with:
		//     jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
		//         'outputdir/', true, true));
	},

	// ----- Options to be passed to minijasminenode -----
	jasmineNodeOpts: {
		// onComplete will be called just before the driver quits.
		onComplete: null,
		// If true, display spec names.
		isVerbose: false,
		// If true, print colors to the terminal.
		showColors: true,
		// If true, include stack traces in failures.
		includeStackTrace: true,
		// Default time to wait in ms before a test fails.
		defaultTimeoutInterval: 30000
	}
};
