dojo.provide("dojos.rdf.io");

// description:
//		This is the main API to output and parse RDF data in various forms,
//		this can be considered a factory, but more of a registry where the
//		different handlers are registered by MIME content type. This makes
//		it easy to load resources retrieved fom the web as the Content-Type
//		header can be used to identify the correct handler.  A Handler has 
// 		to implement the standard API which consists of the methods:
//		<ul>
//		  <li>parseInput</li>
//		  <li>format</li>
//		  <li>formatStatement</li>
//		</ul>
//

dojos.rdf.io = new function() {

	// description:
	//		The map of Content-Type -> Handler.
	// tags:
	//		private
	var registry = {
		"text/plain": "dojos.rdf.io.ntriples",
		"text/turtle": "dojos.rdf.io.turtle",
		"application/json": "dojos.rdf.io.json"
	};
	
	this.registerHandler = function(/* String */ module, /* String */ contentType) {
		// description:
		//		This function can be used to register a new content handler
		//		to be used by clients. Note that modules are onload loaded
		//		on demand via getHandler or getHandlerForType.
		//
		// module: String
		//		The name of a Dojo module that implements the IO API
		// contentType: String
		//		A distinct MIME type identifying the content type
		registry[contentType] = module;
	};
	
	this.removeHandler = function(/* String */ contentType) {
		// description:
		//		Remove the handler registered for the provided content type
		//		from the registry.
		//
		// contentType: String
		//		A distinct MIME type identifying the content type
		registry[contentType] = undefined;
	};
	
	this.getHandler = function(/* String */ module) {
		// description:
		//		Retrieve the content handler by it's module name.
		//
		// module: String
		//		The name of a Dojo module that implements the IO API
		dojo.require(module);
		var mod = (eval(module));
		return mod;
	};
	
	this.getHandlerForType = function(/* String */ contentType) {
		// description:
		//		Retrieve the content handler by it's registered MIME type.
		//
		// contentType: String
		//		A distinct MIME type identifying the content type
		var module = registry[contentType];
		return this.getHandler(module);
	};
	
}();