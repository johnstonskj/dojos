dojo.provide("dojos.rdf.io.ntriples");

// description:
//		This module implements the handler API and is able to parse and
//		output graphs in NTriple format.
//
// see:
//		<URL> ?
//

dojo.require("dojos.rdf.Graph");

dojos.rdf.io.ntriples = new function() {

	var ntriple = /^\s*(<[^>]*>|_:\w+)\s+(<[^>]*>)\s+(<[^>]*>|_:\w+|"[^"]*")\s*.\s*$/;
	
	function parse(/* String */ line, /* Graph */ graph) {
		var parsed = ntriple.exec(line);
		if (parsed) {
			var subject = parsed[1];
			if (subject.slice(0,1) == "<") {
				subject = graph.createURI(subject);
			} else {
				subject = graph.createBlank(subject);
			}
			var predicate = graph.createURI(parsed[2]);
			var object = parsed[3];
			if (object.slice(0,1) == "<") {
				object = graph.createURI(object);
			} else if (object.slice(0, 2) == "_:") {
				object = graph.createBlank(object);
			}
			var statement = graph.createStatement(subject, predicate, object);
			return statement;
		} else {
			throw new dojos.rdf.RdfError(
				"Could not parse input line as NTriples", 
				"dojos.rdf.io.ntriples.parseInput", 
				{input: line});
		}
	};
	
	this.parseInput = function(/* String */ input) {
		var graph = new dojos.rdf.Graph();
		dojo.forEach(input.split("\n"), function(line) {
			line = line.trim();
			if (line) {
				var statement = parse(line, graph);
				graph.add(statement);
			}	
		});
		return graph;
	};

	this.format = function(/* Graph */ graph, /* Object */ options) {
		output = [];
		self = this;
		dojo.forEach(graph.listStatements(), function(statement) {
			output.push(self.formatStatement(statement));
		});
		return output.join("");
	};
	
	this.formatStatement = function(/* Statement */ statement) {
		var buffer = [];
		buffer.push(statement.getSubject().toString());
		buffer.push(" ");
		buffer.push(statement.getPredicate().toString());
		buffer.push(" ");
		if (statement.getObject() instanceof dojos.rdf.Literal) {
			/*
			 * Standard serialization supports Turtle.
			 */
			buffer.push('"' + statement.getObject().getValue() + '"');
		} else {
			buffer.push(statement.getObject());
		}
		buffer.push(".\n");
		return buffer.join("");
	};
	
}();