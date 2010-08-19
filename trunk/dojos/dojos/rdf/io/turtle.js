dojo.provide("dojos.rdf.io.turtle");

//description:
//		This module implements the handler API and is able to parse and
//		output graphs in Turtle format.
//
//see:
//		<URL> ?
//

dojo.require("dojos.rdf.Graph");

dojos.rdf.io.turtle = new function() {
	
	this.parseInput = function(/* String */ input) {
		return undefined;
	};

	this.format = function(/* Graph */ graph, /* Object */ options) {
		var done = {};
		var output = [];
		var prefixes = {};
		if (options && options["prefixes"]) {
			prefixes = options.prefixes;
			for (prefix in prefixes) { 	
				output.push("@prefix " + prefix + ": <" + prefixes[prefix] + ">\n");
			}
			output.push("\n");
		}
		function outputResource(resource) {
			if (prefixes && resource instanceof dojos.rdf.URI) {
				var qname = dojos.rdf.qname(resource, prefixes);
				if (qname) {
					return qname;
				}
			}
			return resource.toString();
		}
		function doForSubject(subject, bnode) {
			if (bnode) {
				output.push("[\n");
			} else {
				output.push(outputResource(subject) + " ");
			}
			var predicates = graph.listPredicatesFor(subject);
			dojo.forEach(predicates, function(predicate, i) {
				if (i > 0 || bnode) { output.push("    "); }
				output.push(outputResource(predicate) + " ");
				var objects = graph.listObjectsFor(subject, predicate);
				dojo.forEach(objects, function(object, j) {
					if (object instanceof dojos.rdf.Blank && !done[object]) {
						doForSubject(object, true);
						done[object] = true;
					} else {
						output.push(outputResource(object));
					}
					if (j < objects.length - 1) {
						output.push(", ");
					}
				});
				if (i < predicates.length - 1) {
					output.push(";");
				}
				output.push("\n");
			});
			if (bnode) {
				output.push("]");
			} else {
				output.push(".\n");
			}
		}
		/*
		 * interesting URI subjects
		 */
		dojo.forEach(graph.listSubjects(), function(subject) {
			if (subject instanceof dojos.rdf.URI) {
				doForSubject(subject);
			}
		});
		/*
		 * blank-node subjects
		 */
		dojo.forEach(graph.listSubjects(), function(subject) {
			if (subject instanceof dojos.rdf.Blank && !done[subject]) {
				doForSubject(subject);
			}
		});
		return output.join("");
	};
	
	this.formatStatement = function(/* Statement */ statement) {
		var buffer = [];
		buffer.push(statement.getSubject().toString());
		buffer.push(" ");
		buffer.push(statement.getPredicate().toString());
		buffer.push(" ");
		buffer.push(statement.getObject());
		buffer.push(".\n");
		return buffer.join("");
	};
	
}();
