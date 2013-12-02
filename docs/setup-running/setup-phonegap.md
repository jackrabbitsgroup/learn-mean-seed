# phonegap/cordova setup

## Overview / General
- phonegap vs. cordova
	- cordova is technically the "lower level" tool that phonegap is built on but as far as I know, they're interchangeable (you can use phonegap or codora on the command line)
- versions and command line tools
	- `npm install -g cordova` OR `npm install -g phonegap` (as far as I know, it doesn't matter which one you use; just use cordova)
	- NOTE: cordova/phonegap went through a BREAKING change with plugins from 2.7.0 to 2.8.0 (they were removed). This caused problems so it was reverted back in 2.8.1 and 2.9.0 but they're officially REMOVED in 3.0.0 (and any (3rd party) plugins that aren't updated to 3.0.0 status will NOT work) so it's IMPORTANT to install the appropriate version when you build your app - specifically, if you're going to use 3rd party plugins such as Facebook Connect (which as of 2013.07.26 has NOT been updated to 3.0.0), you MUST use 2.9.0. So install with `npm install -g cordova@2.9.0`
		- OTHERWISE will get pluginConnect errors when trying to build in Eclipse..
		- http://www.infil00p.org/introducing-cordova-2-8-1-on-android/

## seed/app specific setup
NOTE: do this AFTER you've got the default phonegap app running successfully - SEE BELOW FIRST for general setup!

1. `git pull` to get updated files (if you're working and changing files locally you can skip this step)
	1. if app config files changed, you'll have to update your local versions accordingly - @todo - document this better
2. run `grunt phonegap`
	1. this build then copies over the following folders/files to the phonegap app `assets/www` folder you created (it will put it in ALL the specific platforms - i.e. `platforms/android`, `platforms/ios`, etc.). NOTE: only android and ios are automatically copied over currently!
		1. `app/src/index.html`
		2. `app/src/build` folder
		3. `app/src/common/font` and `app/src/common/img` folders (you may or may not need the `img` folder depending on if you're using images in the mobile version - when in doubt leave it copied but if you're NOT using some/all images, remove them to reduce the Phonegap packaged file size)
3. refresh then run the app in Phonegap (i.e. in Eclipse for Android or xCode for iOS)



## general setup (not seed/app specific - i.e. to just get the default phonegap app running successfully)

- In general, follow these guides below. This readme is only for gotchas during the process.
	- http://docs.phonegap.com/en/2.9.0/guide_cli_index.md.html#The%20Cordova%20Command-line%20Interface
		- Actually SKIP the above; just use your specific platform guide!
	- http://docs.phonegap.com/en/2.9.0/guide_getting-started_index.md.html#Platform%20Guides

1. ensure you have a recent version of node.js (i.e. v0.10.12 or higher) since you'll get "no method 'tmpdir'" error later on otherwise.
	1. check node version with `node -v`
	2. upgrade
		1. Windows: by redownloading the installer from the nodejs website and re-running it.
		2. Mac/Linux: I think you can run commands from terminal to do this but I'm not sure and I just re-downloaded & re-installed it from the nodejs website and that worked.
2. `[sudo] npm install -g cordova`


From here, instructions are platform specific

### Android
- short version of instructions (copied from http://docs.phonegap.com/en/2.9.0/guide_getting-started_android_index.md.html#Android%20Platform%20Guide )
	- [cd to directory you want to put phonegap - for this seed use a new `app/src/deploys` folder]
	- `cordova create phonegap com.[project] "[Project Name]"`
	- `cd phonegap`
	- `cordova platform add android`
	- `cordova build`
	- Open Eclipse and create new project from existing code then browse to this folder and the platforms/android subdirectory then press 'ok'
		- clean project & fix any errors
		- run on Android device
- to build your actual project (i.e. once you've got it working with the default phonegap app files)
	- delete all files/folders in the `assets/www` directory EXCEPT:
		- `res` folder
		- `config.xml`, `cordova.js`, `cordova_plugins.json` files
	- add in your HTML, CSS, JS, image, etc. files (should be production ready versions ideally - concatenated, minified, etc.)
	- run the app and it should work! debug any issues your code may have :(
	- integrate phonegap plugins (i.e. Facebook Connect)
	
1. update your Android SDK to the most recent version (EVEN if you'll be using a lower (min) version, Cordova will only work with the most recent SDK installed). http://stackoverflow.com/questions/11058816/using-apache-cordova-phonegap-with-android-2-x
	1. For Windows I open the "Android SDK Manager" program and then upgrade/install things from there.
		1. There's a bunch of packages but they seem to install one at a time and only the "SDK Platform Android 4.2.2" is required so just skip the rest..?
2. Once you get to the Eclipse part/steps, right click on your project, go to 'Properties' then the 'Android' nav on the left, then for 'Project Build Target' select the one that matches you device then press the 'OK' button.
	1. if you went to an older SDK version, you'll likely now have errors (i.e. in the 'AndroidManifest.xml' file) because the older SDK version doesn't support new properties; remove them then refresh the app / do a 'clean' and the errors should go away.
		1. for example, for Android 2.3 'hardwareAccelerated' and 'screenSize' are not supported so remove them
		

### iOS
- do NOT use the beginning parts of the ios platform guide; you can just install and use the cordova command line tools instead:
	- install them: `sudo npm install -g cordova`
	- create app:
		- [cd to directory you want to put phonegap - for this seed use a new `app/src/deploys` folder]
		- `cordova create phonegap com.[project] "[Project Name]"`
		- `cd phonegap`
		- `cordova platform add ios`
		- `cordova build`
- after you've built the ios app, open/import it to xCode by going to the phonegap `platforms/ios` folder and double clicking the `.xcodeproj` file
	- run it in xCode (you'll need Apple Developer credentials, provisioning profiles, etc. to run on an actual device)
	
	
## Facebook Connect Phonegap
In general follow these instructions (they're pretty good) https://github.com/phonegap/phonegap-facebook-plugin
	NOTE: There are many versions of the plugin; it used to be davejohnson but now it's been moved (though this one is still 2 months old it seems (as of 2013.07.26) so may not work with 2.9.0? I tried and couldn't get it working..)
NOTES / exceptions / issues:
MAKE SURE to use the appropriate cordova/phonegap version that MATCHES the facebook connect phonegap plugin support (i.e. as of this writing, 3.0.0 is NOT supported so you MUST use 2.9.0. And do NOT use 2.8.0 as that was a breaking one.

### Android
- if not using an emulator, can skip the 'Install the Facebook SDK for Android and the Facebook APK' Facebook part from here: Install the Facebook SDK for Android and the Facebook APK. Just need to download the folder / files for the import to Eclipse step.
- the `<script src="facebook_js_sdk.js"></script>` is IMPROPERLY named in the example; should be HYPENS `-` instead of underscores (make sure it matches the actual file name, i.e. `<script src="facebook-js-sdk.js"></script>`
	- do NOT include the standard `<script type='text/javascript' src='https://connect.facebook.net/en_US/all.js'></script>` script as well for phonegap version; the phonegap connect plugin replaces this facebook sdk.
- generating Facebook hash: http://stackoverflow.com/questions/4388992/key-hash-for-android-facebook-app

General (older) notes:
1. Android: Follow the instructions with the FB Connect Phonegap plugin BUT at the end have to change Java Compiler to 1.6 otherwise it will throw errors..  (right click on the project then go to properties -> java compiler on left)
2. To get Android FB Connect to work with SSO (single sign on), which is auto default if the user has the native FB app installed on their phone, you need to add the signing certificate hash to the Facebook App settings (via the developer app on facebook)
	1. Getting this hash is a bit complicated & not well documented � for windows:
		1. Download cygwin & install it (make sure to choose/install the openssl package)
		2. Run cygwin (NOTE: if you run �cmd� & use the command line it will appear to work but will give an incorrect hash!!) then run the below command and enter the password �android�.
			1. NOTE: there are many ways for it to fail silently (will generate a hash and you have no way of knowing it�s incorrect!). The one way to know it is incorrect though is if you don�t get prompted for a password!
				1. NOTE: enter the keystore password, not the alias password
					1. Also �Bmce+9..� tend to be bad keys (mean you did something wrong)
			2. NOTE: the tutorials aren�t for windowsXP so will give �~./android� as the debug.keystore path, which won�t work on windowsXP! make sure you enter the correct location/path (& all other info � one typo or incorrect path will cause an incorrect hash!)
				1. For the release hash, have to replace all values accordingly (alias, keystore path, prompt password)
				keytool �exportcert �alias androiddebugkey �keystore �C:\documents and settings\luke\.android\debug.keystore� | openssl sha1 �binary | openssl base64
3. Facebook switched to OAuth which has 2 significant changes, both of which need to be fiddled with to work:
	1. only �scope� (instead of �perms�) can be used. But the phonegap sdk still has perms... so it doesn�t work... so I just replaced all �perms� with �scope� in the 2 javascript files (pg-plugin-fb-connect.js & facebook_js_sdk.js)
	2. getAuthResponse doesn�t work; phoneGap still uses session SO have to check for (response.authResponse || response.session) . Also, FB.getAuthResponse will be undefined and throw an error so have to check for FB.session as well.
		1. Also need to map params since session uses user_id, access_token, etc. but auth uses userID, accessToken, etc...
4. iOS Facebook Single Sign On (& others with oAuth??) � doesn�t give user id anymore after log in; only gives access token & need to use that with the open graph api & �me� call to get the user id... : https://graph.facebook.com/me?access_token=ACCESS_TOKEN
	1. UNLIKE android, don�t need to set any hash or anything on the facebook developer settings; just need to check/turn on the �SSO� option (it will give an error prompt when saving that an Apple App Store Id is required but it seems to work without any fields filled in..)
