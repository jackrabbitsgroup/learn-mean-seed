'use strict';

/**
RPC module
@module rpc
**/

var rpcjs = require('rpc.js');
var lodash = require('lodash');
var fs = require('fs');


var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var SecurityMod = require(pathParts.services+'security/security.js');

/**
Manages RPC gateway interface
@class GatewayServer
@constructor
@param options {Object} configuration options
@param options.gateway {Gateway} rpc.js gateway object returned by rpcjs.gateway()
@param [options.opts] {Object} sub-configuration options
@param [options.opts.inputVar] {String} POST or GET input variable name where RPC message packet will be attached
@param [options.opts.jsonp] {Boolean} whether to support jsonp callbacks
@param [options.opts.socketio] {Boolean} whether to send response over socketio (not currently supported)
**/
var GatewayServer = function(options){
    this.gateway    = options.gateway;
    this.inputVar   = options.opts.inputVar;
    this.jsonp      = options.opts.jsonp;
    this.socketio   = options.opts.socketio;
};

GatewayServer.prototype = {
	/**
	Handle input request from client
	@method handle
	@param req {Object} express request object
	@param res {Object} express response object
	@param {Object} [params]
		@param {String} rpcMount i.e. '/api/auth/'
		@param {String} rpcMethod i.e. 'Auth.login'
	**/
    handle: function(req, res, params){
		var xx;
        var self        = this;
        var postData    = req.body;
        var getData     = req.query;
        var inputData;

        // get input data based on request method
        if( req.method === 'GET' ){
            // get data must be namespaced into inputVar since it's expected to a JSON string
            inputData = getData[self.inputVar];
        } else {
            // try to get data from post[inputVar], then fallback to entire post body
            inputData = postData[self.inputVar] || postData;
			if(req.files !==undefined && req.files) {
				console.log('files!');
				//if didn't come in as rpc format, add these fields and move data into 'params' field
				if(inputData.jsonrpc ===undefined) {
					var skipKeys =['method'];
					var ii;
					var deleteKeys =[];
					var paramsTemp ={};
					for(xx in inputData) {
						if(skipKeys.indexOf(xx) <0) {
							paramsTemp[xx] =inputData[xx];
							deleteKeys.push(xx);
						}
					}
					for(ii =0; ii<deleteKeys.length; ii++) {
						delete inputData[deleteKeys[ii]];
					}
					inputData.params =paramsTemp;
					inputData.jsonrpc ='2.0';
					inputData.id =1;
				}
				//do this AFTER convert inputData above!
				inputData.params.files =req.files;
				//sometimes extra nesting of files??!
				if(inputData.params.files.files !==undefined) {
					inputData.params.files =inputData.params.files.files;
				}
				
				// console.log('inputData: '+JSON.stringify(inputData));
				console.log(inputData);
			}
			// console.log('inputData: '+JSON.stringify(inputData));
        }

        // rpcjs requires strings to be passed in with 'textInput' and objects with 'input'
        // try to pass everything as 'input'
        var inputKey = 'input';
        if( lodash.isString( inputData ) ){
            try {
                inputData = JSON.parse(inputData);
            } catch(err){
                // let gateway handle this, just set it for correct processing
                inputKey = 'textInput';
            }
        }
		
		//now have option to just use old style full url's (i.e. '/api/auth/active/' instead of just '/api/auth/') so need to fill in the RPC method if this is the case
		if(params !==undefined && params.rpcMount !==undefined && params.rpcMethod !==undefined) {
			console.log(params.rpcMount+' '+params.rpcMethod);
			inputData.method =params.rpcMethod;		//set rpc method since it's likely blank since using full url to pass in method
		}
		// console.log(req._parsedUrl.pathname+' '+inputData.method);
		// console.log(inputData);

        if( inputKey === 'input' ){
            if( !lodash.isObject(inputData.params) ){
                // ensure params is an object
                inputData.params = {};
            }

			// add req and res to inputData as functions to differentiate from incoming data
			if(0) {
			lodash.extend(inputData.params, {
				_req: function(){ return req; },
				_res: function(){ return res; }
			});
			}
			else if(0) {
			lodash.extend(inputData.params, {
				_extra_: {
					_req: function(){ return req; },
					_res: function(){ return res; }
				}
			});
			}
			else if(0) {
			inputData.params ={
				data: inputData.params,
				_req: function(){ return req; },
				_res: function(){ return res; }
			};
			}
			
			//remove blank keys (i.e. so undefined check works later - rpc sends in empty strings)
			for(xx in inputData.params) {
				if(typeof(inputData.params[xx]) =='string' && inputData.params[xx].length <1) {
					delete inputData.params[xx];
				}
			}
        }

        var inputOpts = {};
        inputOpts[inputKey]  = inputData;
        inputOpts.callback   = function(output){
            if( self.jsonp ){
                res.jsonp(output);
            } else {
                res.json(output);
            }
        };

        self.gateway.input(inputOpts);
    }
};

// bare rpc schema object
var SCHEMA = {
    groups: {},
    methods: {}
};

// this method overrides each gateway's returnSchema method which is used to provide schema info to help pages
// we want to override and return a custom set of data for building a better help page
var returnSchema = function(schema){
    return function(){
        var response = {};

        for(var method in schema.methods){
            response[method] = {
                info: schema.methods[method].info,
                group: schema.methods[method].group,
                apiKey: schema.methods[method].apiKey,
                params: schema.methods[method].params,
                returns: schema.methods[method].returns
            };
        }

        return { groups: schema.groups, methods: response };
    };
};

var buildGateways = function(endpoints){
    var gateways = {};
    lodash.forIn(endpoints, function(config, endpoint){
        var endpointSchema = lodash.cloneDeep(SCHEMA);
        lodash.forIn(config.modules, function(mod)
		{
            lodash.extend( endpointSchema.groups, mod.schema.groups );
            lodash.extend( endpointSchema.methods, mod.schema.methods );
        });

        gateways[endpoint] = rpcjs.gateway({
            schema: endpointSchema
        });

        gateways[endpoint].returnSchema = returnSchema(endpointSchema);
	
    });
		
    return gateways;
};

var defaults = {
    // must be passed in, expected to be a keyed object of modules (see below for example)
    endpoints:      {},
    mount:          '/api/',
    autoDoc:        true,
    autoDocUrl:     'help',
    // override default template with file path
    autoDocFile:    false,
    inputVar:       'rpc',
    // @todo: implement?
    socketio:       false,
    jsonp:          false
};

// example of defaults.endpoints
/*
endpoints = {
    '': {
        // use '' to attach endpoint to mount point
        // see below for rest of data structure
    },
    v1: {
        modules: {
            mod1: {
                api: {
                    schema: {
                        groups: {}, // rpc.js format expected
                        methods: {} // rpc.js format expected
                    }
                }
            },
            mod2: {
                api: {
                    schema: {
                        groups: {}, // rpc.js format expected
                        methods: {} // rpc.js format expected
                    }
                }
            }
        },
        middleware: [] // express middleware to apply to endpoint
    },
    admin: {...},
    auth: {...}
}
*/

/**
RPC Module function
@method exports
@param options {Object} configuration options
@param options.endpoints {Object} RPC schema endpoints
@param options.mount {Object} URL to provide RPC access on
@param options.autoDoc {Boolean} whether to route rpc.js help page
@param options.autoDocUrl {String} help page's URL endpoint (gets appended to `mount`)
@param options.autoDocFile {String} file path which overrides rpc.js' default help page template
@param options.inputVar {String} incoming POST or GET variable where RPC protocol message should be attached to
@param options.socketio {Boolean} whether to provide socketio interface
@param options.jsonp {Boolean} whether to support jsonp callbacks
@return {undefined} configures express app middleware to function as RPC API
**/
module.exports = function(app, server, options, db)
{
    var opts = lodash.extend({}, defaults, options);

    var mount = opts.mount;

    // append '/' to mount if not present for consistent routing
    if( mount.charAt( mount.length-1 ) !== '/' ){
        mount += '/';
    }

    var autoDocUrl = opts.autoDocUrl;

    // remove leading '/' if present
    if( autoDocUrl.charAt(0) === '/' ){
        autoDocUrl = autoDocUrl.substr(1);
    }

    var endpoints   = opts.endpoints;
    var gateways    = buildGateways(endpoints);

    lodash.forIn(gateways, function(gateway, endpoint)
	{
        var middleware  = endpoints[endpoint].middleware || [];
        var eMount      = mount + endpoint;

        // ensure endpoint mount has trailing slash
        if(eMount.charAt(eMount.length-1) !== '/'){
            eMount += '/';
        }

        var rpc = new GatewayServer({
            gateway:    gateway,
            opts:       opts
        });
		
		var supportFullUrls =true;		//true to support full urls (i.e. '/api/auth/active/') instead of just group namespaces
		if(supportFullUrls) {
			var xx, xx1;
			var url1, method1;
			if(endpoints[endpoint].modules[endpoint] && endpoints[endpoint].modules[endpoint].schema)
			{
				for(xx1 in endpoints[endpoint].modules[endpoint].schema.methods) {
					(function (xx) {
						//assume methods are in format '[namespace].[method]' so break off just the method part
						method1 =xx.slice((xx.indexOf('.')+1), xx.length);
						url1 =eMount+method1;
						
						app.all( url1, SecurityMod.init({'db': db}), middleware, function(req, res) {
							// need to explicitly set `this` for rpc object; otherwise, it's undefined since it's being called by express
							rpc.handle.call(rpc, req, res, {rpcMount: eMount, rpcMethod: xx});
						});
						url1 +='/';		//add trailing slash and make that work too
						app.all( url1, SecurityMod.init({'db': db}), middleware, function(req, res) {
							// need to explicitly set `this` for rpc object; otherwise, it's undefined since it's being called by express
							rpc.handle.call(rpc, req, res, {rpcMount: eMount, rpcMethod: xx});
						});
					}(xx1));
				}
			}
		}
	
		//standard RPC routing (group url namespaces such as '/api/auth' instead of '/api/auth/active/')
        app.all( eMount, SecurityMod.init({'db': db}), middleware, function(req, res){
		// app.all( eMount, middleware, function(req, res){
            // need to explicitly set `this` for rpc object; otherwise, it's undefined since it's being called by express
            rpc.handle.call(rpc, req, res, {});
        });
        if( opts.autoDoc ){
            app.get( eMount + autoDocUrl, middleware, function(req, res){
                if( opts.autoDocFile ){
                    res.end( fs.readFileSync(opts.autoDocFile));
                } else {
                    res.end(gateway.uiHtml());
                }
            });
        }
		
    });
};
