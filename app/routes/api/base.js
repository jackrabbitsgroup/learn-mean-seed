'use strict';

var lodash = require('lodash');

/**
Base class for API modules which implement RPC methods

The JSON-RPC API uses [rpc.js](https://github.com/hugorodrigues/rpc.js) which provides a unified RPC interface with an interactive documentation page.

A custom RPC Server interface is provided at `modules/rpc/index.js`.

In order for a module to integrating into the RPC framework, it must provide certain interfaces in compliance with the `rpc.js` (the external library) specification. To facilitate compliance, a helper function is provided at `modules/utils.js`:

```javascript
var utils = require('./modules/utils');
var buildRpcSchema = utils.buildRpcSchema;
```

To use `buildRpcSchema`, it's expected that a module implement the following design pattern:

```javascript

var group = 'my-module';
var info = 'My awesome foo module';
var namespace = 'MyModule';

var foo = {
    info: 'Foo method',
    params: {
        bar: { required: true, type: 'string', info: 'Bar variable' },
        baz: { required: false, type: 'boolean', info: 'Baz variable' }
    },
    action: function(params, out){
        // @note: it's imperative that the variable name be used instead of `this`
        // see below for further details
        foo.method(params, out.win, out.fail);
    },
    method: function(params, success, fail){
        // perform action
        if(err){
            fail(err.message);
        } else {
            success(returnData);
        }
    }
}

// ...
// define additional public methods
// ...

var rpcMethods = {
    foo: foo
    // add other public methods
}

// build rpc.js schema
var schema = buildRpcSchema(group, info, namespace, methods);

modules.exports = {
    schema: schema,
    // expose methods for easier access by other modules besides RPC Server
    // recommended but not required
    methods: {
        foo: foo.method
        // ...
        // add other public methods
        // ..
    }
}
```

A few notes on some of the reasoning behind this implementation:

Defining an `action:` and `method:`
:   To make testing the `method` easier and independent of the `rpc.js` implementation.

Having `success` and `fail` callbacks on `method:`
:   Again to make things easier to test and to maintain async compatibility.

Using the `object`'s variable name in `action:` to call `method:`
:   Originally, the `this` variable was used, `this.method`, but the `this` variable is not bound to the `object` when called outside of its module. Another solution would be to use `bind` to set `this` or to use `new` to create a bound instance, but that imposes too much overhead and could easily be missed when creating a new module. Using the `object` directly is a simpler, more straight-forward approach.

**/
module.exports = RpcApiBase;

/**
Build rpc schema object in compliance with rpc.js requirements
@toc 6.
@method buildRpcSchema
@param group {String} group name
@param info {String} group info description
@param namespace {String} namespace for RPC methods
@param methods {Object} collection of methods which following rpc.js expectation
@param methods.info {String} method info description
@param methods.params {Object} input params to method
@param methods.action {Function} RPC method
@return {Object} rpc.js compliant schema object
**/
function buildRpcSchema(group, info, namespace, methods) {
	// Set up rpc.js compliant schema
	var schema = {
		groups: {},
		methods: {}
	};

	schema.groups[group] = {
		name:   group,
		info:   info
	};

	// ensure namespace ends with '.'
	if(namespace.charAt(namespace.length-1) !== '.'){
		namespace += '.';
	}

	lodash.forIn(methods, function(method, methodKey){
		schema.methods[namespace+methodKey] = {
			group:  group,
			info:   method.info,
			params: method.params,
			action: method.action,
			returns: method.returns
		};
	});

	return schema;
}

function RpcApiBase(options){
    this.options = options;
    this.namespace = options.namespace;
    this.group = options.group;
    this.info = options.info;
    this.schema = buildRpcSchema(this.group, this.info, this.namespace, this.getRpcMethods());
}

// helper functions
RpcApiBase.prototype = {
	/*
    handleError: function(cb){
        return function(err){
            cb(500, err.message || err);
        };
    }
	*/
	/**
	@param {Object} out rpc out object for calling out.fail
	@param {Object|String} err Error object with 'msg' key OR string of error message
	@param {Object} params
	*/
	handleError: function(out, err, params) {
		// out.fail(500, err.msg || err);
		out.fail(500, err);
    }
};

RpcApiBase.prototype.getRpcMethods = function(){
    throw new Error("Inherited class must implement it's own getRpcMethods()");
};

