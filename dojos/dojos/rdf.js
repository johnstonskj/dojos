dojo.provide("dojos.rdf");

// description:
//		This module contains basic functions used throughout the package
//		mainly for namespace manipulation.
//

dojos.rdf = new function() {
	
	this.qname = function(/* String|URI */ uri, /* Object */ prefixes) {
		// description:
		//		Construct a qname from the given URI by looking up
		//		the URI root in the map of prefixes provided and
		//		returning the new QName, or null of the URI could
		//		not be mapped.
		//
		// uri: a fully-qualified URI.
		// prefixes: an object where the keys are prefixes and the
		//		values are the namespace URIs.
		//
		// example:
		// | var qname = dojos.rdf.qname(
		// |     "http://www.w3.org/2001/XMLSchema#int",
		// |     { "xsd": "http://www.w3.org/2001/XMLSchema#" });
		// | // qname == "xsd:int"
		//
		var _uri = uri;
		if (uri instanceof dojos.rdf.URI) {
			_uri = uri.getValue().toString();
		}
		if (_uri && prefixes) {
			var parts;
			if (_uri.indexOf("#") >= 0) {
				var idx = _uri.lastIndexOf("#");
				parts = [_uri.slice(0, idx+1), _uri.slice(idx+1)];
			} else {
				var idx = _uri.lastIndexOf("/");
				parts = [_uri.slice(0, idx+1), _uri.slice(idx+1)];
			}
			if (parts.length == 2) {
				for (prefix in prefixes) {
					if (prefixes[prefix] == parts[0]) {
						return prefix + ":" + parts[1];
					}
				}
			}
		}
		return undefined;
	};
	
	this.uriref = function(/* String */ qname, /* Object */ prefixes) {
		// description:
		//		Construct a URI from the given QName by looking up
		//		the prefix->URI in the provided object and constructing
		//		a new URI, or null if the prefix is not a key in the map.
		//
		// qname: a name of the form "ns:name" following standard XML.
		// prefixes: an object where the keys are prefixes and the
		//		values are the namespace URIs.
		//
		if (qname && prefixes) {
			var parts = qname.split(":");
			if (parts.length == 2) {
				var uri = prefixes[parts[0]];
				if (uri) {
					var lastChar = uri.slice(-1);
					if (lastChar == "#" || lastChar == "/") {
						return new dojos.rdf.URI(uri + parts[1]);
					} else {
						return new dojos.rdf.URI(uri + "#" + parts[1]);
					}
				}
			}
		}
		return undefined;
	};
	
	this.RdfError = function(/* String */ message, /* String */ origin, /* Object */ params) {
		this.message = message;
		this.origin = origin;
		this.params = params;
	};
}();
