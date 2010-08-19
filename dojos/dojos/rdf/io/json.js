dojo.provide("dojos.rdf.io.json");

// description:
//		This module implements the handler API and is able to parse and
//		output graphs in JSON format.
//
// see:
//		[RDF JSON Specification]
//		http://n2.talis.com/wiki/RDF_JSON_Specification
//

dojo.require("dojox.lang.functional");

dojo.require("dojos.rdf.Graph");

dlf = dojox.lang.functional;

dojos.rdf.io.json = new function() {

	this.parseInput = function(/* String */ input) {
		var graph = new dojos.rdf.Graph();
		var object = dojo.fromJson(input);
		dlf.forIn(object, function(predicates, _subject) {
			dlf.forIn(predicates, function(objects, _predicate) {
				dojo.forEach(objects, function(_object) {
					var subject;
					if (_subject.slice(0, 2) == "_:") {
						subject = graph.createBlank(_subject);
					} else {
						subject = graph.createURI(_subject);
					}
					var predicate = graph.createURI(_predicate);
					var object;
					if (_object.type == "bnode") {
						object = graph.createBlank(_object.value);
					} else if (_object.type == "uri") {
						object = graph.createURI(_object.value);
					} else {
						var params = {
							language: _object["lang"],
							dataType: _object["datatype"]
						}
						object = graph.createLiteral(_object.value, params);
					}
					graph.add(graph.createStatement(subject, predicate, object));
				});
			});
		});
		return graph;
	};

	this.toObject = function(/* Graph */ graph) {
		var _object = {};
		dojo.forEach(graph.listSubjects(), function(subject) {
			var _subject;
			if (subject instanceof dojos.rdf.URI) {
				_subject = subject.getValue().toString();
			} else {
				_subject = subject.toString();
			}
			_object[_subject] = {};
			dojo.forEach(graph.listPredicatesFor(subject), function(predicate) {
				var _predicate = predicate.getValue().toString();
				_object[_subject][_predicate] = [];
				dojo.forEach(graph.listObjectsFor(subject, predicate), function(object) {
					var subjectObj = {};
					if (object instanceof dojos.rdf.Literal) {
						var value = object.getValue();
						subjectObj.type = 'literal';
						if (dojo.isNumber(value) || dojo.isBoolean(value)) {
							subjectObj.value = value;
						} else {
							subjectObj.value = value;
						}
						if (object.getLanguage()) {
							subjectObj.lang = object.getLanguage();
						}
						if (object.getDataType()) {
							subjectObj.datatype = object.getDataType();
						}
					} else if (object instanceof dojos.rdf.Blank) {
						subjectObj.type = 'bnode';
						subjectObj.value = object.toString();
					} else {
						subjectObj.type = 'uri';
						subjectObj.value = object.getValue().toString();
					}
					_object[_subject][_predicate].push(subjectObj);
				});
			});
		});
		return _object;
	};
	
	this.format = function(/* Graph */ graph, /* Object */ options) {
		return dojo.toJson(this.toObject(graph));
	};
	
	this.formatStatement = function(/* Statement */ statement) {
		return undefined;
	};
	
}();