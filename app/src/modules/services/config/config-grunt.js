/*
//0. init
//1. load
//2. save
*/

/*
holds state / app level properties (i.e. logged in status, session id, etc.) that are needed across multiple controllers/etc.
*/

'use strict';

angular.module('app').
provider('appConfig', function(){
	this.server ='';

<%
var cfgJson = grunt.config('cfgJson');
%>
	this.dirPaths ={
	'appPath':'<% print(cfgJson.server.appPath); %>',
	'appPathLink':'<% print(cfgJson.server.appPath); %>',
	'appPathLocation':'<% print(cfgJson.server.appPath); %>',
	'staticPath': '<% print(cfgJson.server.staticPath); %>',
	'pagesPath': 'modules/pages/',			//need to prepend staticPath for use
	'rootPath': '/',
	//'serverUrl': "http://"+window.location.host+"/",
	'serverUrl': "http://<% print(cfgJson.server.domain); %>/",
	//'serverPath': "http://"+window.location.host+":<% print(cfgJson.portSocketIO); %>/",
	'serverPath': "http://<% print(cfgJson.server.domain); %>:<% print(cfgJson.server.socketPort); %>/",
	'publicPath': "http://<% print(cfgJson.server.domain); %>:<% print(cfgJson.server.port); %>/",
	'homeDirectory': false,
	'images':"common/img/",		//will have staticPath prepended to it
	'uploads':"uploads/",		//will have appPath prepended to it
	'ajaxUrlParts':{
		//'main':"http://"+window.location.host+":<% print(cfgJson.server.port); %>/"
		'main':"http://<% print(cfgJson.server.domain); %>:<% print(cfgJson.server.port); %>/"
	},
	'ajaxUrl':{
		'api':"http://<% print(cfgJson.server.domain); %>:<% print(cfgJson.server.port); %>/api/"
	},
	'useCorsUrls':{
		'all': <% print(cfgJson.cors.frontendUseCors); %>
	}
	};
	this.emailDomain ="emailDomainHere.com";
	this.info ={
	'emailContact':'talk@',		//emailDomtain will be appended in init
	'emailNoReply':'noreply@',		//emailDomtain will be appended in init
	'appName':'AppNameHere',
	'appTitle':'<% print(cfgJson.app.title); %>',
	//'androidMarketLink':'http://play.google.com/store/apps/details?id=com.phonegap.x',
	'websiteLink':'http://domainHere.com/',
	'fbAppId':'<% print(cfgJson.facebook.appId); %>',
	//'fbPerms':"email,user_birthday,offline_access,publish_stream",
	'fbPerms':"email,user_birthday",
	'twitterHandle':'handleHere',
	'googleClientId':'<% print(cfgJson.google.clientId); %>',
	'timezone':{
		'name':'',
		'offset':'',
		'minutes':''
	}
	};

	//data / state storage
	this.data ={};
	this.state ={'loggedIn':false};
	
	//will hold the raw cfgJson object unaltered
	this.cfgJson ={};

	this.$get = function() {
		return {
			hosts: this.hosts,
			//serverInfo: this.serverInfo,
			//server: this.server,
			dirPaths: this.dirPaths,
			emailDomain: this.emailDomain,
			info: this.info,
			data: this.data,
			state: this.state,
			cfgJson: this.cfgJson,

			//1.
			/*
			@param
				mainKey =string of main key that matches a variable above, i.e.: 'state', 'date' (default)
			*/
			load: function(key, params) {
				var defaults ={'mainKey':'data'};
				params =angular.extend(defaults, params);
				var val =false;
				if(this[params.mainKey][key] !==undefined)
					val =this[params.mainKey][key];
				return val;
			},

			//2.
			/*
			@param
				mainKey =string of main key that matches a variable above, i.e.: 'state', 'date' (default)
			*/
			save: function(key, value, params) {
				var defaults ={'mainKey':'data'};
				params =angular.extend(defaults, params);
				this[params.mainKey][key] =value;
			}
		};
	};

	//0.
	this.init =function(params) {
		// this.dirPaths.images =this.dirPaths.appPath+this.dirPaths.images;
		this.dirPaths.images =this.dirPaths.staticPath+this.dirPaths.images;
		this.dirPaths.uploads =this.dirPaths.appPath+this.dirPaths.uploads;
		this.dirPaths.homeDirectory =this.dirPaths.serverUrl;

		this.info.emailContact +=this.emailDomain;
		this.info.emailNoReply +=this.emailDomain;
		
		//get timezone offset
		var getOffsetFromMinutes =function(minutesTotal, params) {
			var ret ={'z':'', 'minutes':minutesTotal};
			var posNegSwitch =false;		//not sure if should be "420" or "-420" so this toggles it..
			
			var posNeg ='+';
			if(posNegSwitch) {
				posNeg ='-';
				ret.minutes =ret.minutes *-1;
			}
			if(minutesTotal <0) {
				posNeg ='-';
				if(posNegSwitch) {
					posNeg ='+';
				}
				minutesTotal =minutesTotal *-1;		//force positive
			}
			var hours = Math.floor(minutesTotal /60).toString();
			var minutes =(minutesTotal %60).toString();
			if(hours.length ==1) {
				hours ='0'+hours;
			}
			if(minutes.length ==1) {
				minutes ='0'+minutes;
			}
			ret.z =posNeg+hours+':'+minutes;
			return ret;
		};
		
		var minutesTotal =new Date().getTimezoneOffset();
		var ret1 =getOffsetFromMinutes(minutesTotal, {});
		this.info.timezone.offset =ret1.z;
		this.info.timezone.minutes =ret1.minutes;
		
		/*
		var timezone = jstz.determine();
		this.info.timezone.name =timezone.name();
		//get offset
		var xx;
		for(xx in jstz.olson.timezones) {
			if(jstz.olson.timezones[xx] ==this.info.timezone.name) {
				var minutesTotal =xx.slice(0, xx.indexOf(','));
				this.info.timezone.offset =getOffsetFromMinutes(minutesTotal, {}).z;
				break;
			}
		}
		*/
		// console.log('timezone: '+this.info.timezone.name+' '+this.info.timezone.offset+' '+this.info.timezone.minutes);
		//end: get timezone offset
		
		
		
		
		
		<%
		// copy over cfg json
		//GRUNT TEMPLATING
		function isArray(array1, params) {
			if(Object.prototype.toString.apply(array1) === "[object Array]")
			{
				return true;
			}
			else {
				return false;
			}
		}
		
		function printTabs(depth, params) {
			var ii;
			var html ='';
			for(ii =0; ii<depth; ii++) {
				html+='\t';
			}
			return html;
		}
		
		/**
		@param {Object} html
			@param {String} start
			@param {String} end
		@param {Object} params
			@param {Number} arrayDepth Counter for how deep we are (i.e. used for how many tab characters to print)
		*/
		function printArray(array1, html, params) {
			var newArray, aa, wrapChar, index1;
			var closeHtml ='';
			// var chars ={
				// quote: '"',
				// wrapper: "'";
			// };
			params.arrayDepth++;
			if(!array1) {		//to avoid errors if null
				// return array1;
				html.start+=printTabs(params.arrayDepth, {})+'""\n';
				return html;
			}
			if(!params) {
				params ={};
			}
			if(!params.skipKeys || params.skipKeys ===undefined) {
				params.skipKeys =[];
			}
			if(typeof(array1) !="object") {		//in case it's not an array, just return itself (the value)
				// return array1;
				html.start+=printTabs(params.arrayDepth, {})+array1+'\n';
				return html;
			}
			if(isArray(array1))
			{
				// newArray =[];
				// html.tabsStart+='\t';
				html.start+='[\n';
				// html.tabsEnd.slice(0, html.tabsEnd.length-2);
				// html.end =printTabs(params.arrayDepth, {})+"],\n"+html.end;
				closeHtml =printTabs((params.arrayDepth-1), {})+'],\n';
				for(aa=0; aa<array1.length; aa++)
				{
					if(array1[aa] && (typeof(array1[aa]) =="object")) {
						// newArray[aa] =printArray(array1[aa], params);		//recursive call
						html +=printArray(array1[aa], html, params);
					}
					else {
						// newArray[aa] =array1[aa];
						wrapChar ='"';
						if(typeof(array1[aa]) =='number' || typeof(array1[aa]) =='boolean') {
							wrapChar ='';
						}
						html.start +=printTabs(params.arrayDepth, {})+wrapChar+array1[aa].toString()+wrapChar+',\n';
						// html.start +=printTabs(params.arrayDepth, {})+'"'+array1[aa]+'",\n';
					}
				}
				//strip ending comma IF it exists at the end
				index1 =html.start.lastIndexOf(',');
				if(index1 >=html.start.length-2) {
					html.start =html.start.slice(0, html.start.length-2)+'\n';
				}
			}
			else		//associative array)
			{
				// newArray ={};
				// html.tabsStart+='\t';
				html.start+='{\n';
				// html.end =printTabs(params.arrayDepth, {})+"},\n"+html.end;
				closeHtml =printTabs((params.arrayDepth-1), {})+'},\n';
				for(aa in array1)
				{
					html.start+=printTabs(params.arrayDepth, {})+'"'+aa+'":';
					var goTrig =true;
					for(var ss =0; ss<params.skipKeys.length; ss++)
					{
						if(params.skipKeys[ss] ==aa)
						{
							goTrig =false;
							break;
						}
					}
					if(goTrig)
					{
						if(array1[aa] && (typeof(array1[aa]) =="object")) {
							// newArray[aa] =printArray(array1[aa], params);		//recursive call
							html =printArray(array1[aa], html, params);
						}
						else {
							// newArray[aa] =array1[aa];
							wrapChar ='"';
							if(typeof(array1[aa]) =='number' || typeof(array1[aa]) =='boolean') {
								wrapChar ='';
							}
							html.start +=wrapChar+array1[aa].toString()+wrapChar+',\n';
							// html.start +='"'+array1[aa]+'",\n';
						}
					}
				}
				//strip ending comma IF it exists at the end
				index1 =html.start.lastIndexOf(',');
				if(index1 >=html.start.length-2) {
					html.start =html.start.slice(0, html.start.length-2)+'\n';
				}
			}
			html.start+=closeHtml;
			params.arrayDepth--;
			// return newArray;
			return html;
		}
		
		var html ={
			start: '',
			end: '',
			tabsStart: '',
			tabsEnd: '',
		};
		html =printArray(cfgJson, html, {arrayDepth:2});
		//strip ending comma and replace with semicolon
		html.start =html.start.slice(0, html.start.length-2)+';\n';
		print("this.cfgJson ="+html.start+html.end);
		
		// for(var xx in cfgJson) {
			// print("this.cfgJson."+xx+" ='"+cfgJson[xx]+"';\n");
		// }
		//END: GRUNT TEMPLATING
		%>
		
		
		
		
	};

	this.init();		//call to init stuff
});