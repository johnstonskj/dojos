dojo.provide("dojos.data");

// description:
//

dojo.require("dojox.lang.functional");

dojo.require("dojos.rdf.Graph");

dlf = dojox.lang.functional;

dojos.data = new function() {

	this.toHierarchicalObject = function(/* Graph */ graph) {
		var _object = {
			items: []
		};
		dojo.forEach(graph.listSubjects(), function(subject) {
			var subjectObj = { children: [] };
			if (subject instanceof dojos.rdf.URI) {
				subjectObj.subject = subject.getValue().toString();
			} else {
				subjectObj.subject = subject.toString();
			}
			
			dojo.forEach(graph.listPredicatesFor(subject), function(predicate) {
				var predicateObj = { children: [] };
				predicateObj.predicate = predicate.getValue().toString();
				
				dojo.forEach(graph.listObjectsFor(subject, predicate), function(object) {
					var objectObj = { lang: null, datatype: null };
					if (object instanceof dojos.rdf.Literal) {
						var value = object.getValue();
						objectObj.type = 'literal';
						if (dojo.isNumber(value) || dojo.isBoolean(value)) {
							objectObj.value = value;
						} else {
							objectObj.value = value;
						}
						if (object.getLanguage()) {
							objectObj.lang = object.getLanguage();
						}
						if (object.getDataType()) {
							objectObj.datatype = object.getDataType();
						}
					} else if (object instanceof dojos.rdf.Blank) {
						objectObj.type = 'bnode';
						objectObj.value = object.toString();
					} else {
						objectObj.type = 'uri';
						objectObj.value = object.getValue().toString();
					}
					predicateObj.children.push(objectObj);
				});
				subjectObj.children.push(predicateObj);
			});
			_object.items.push(subjectObj);
		});
		return _object;
	};

	this.toObject = function(/* Graph */ graph) {
		var _object = {
			items: []
		};
		dojo.forEach(graph.listStatements(), function(statement) {
			var _statement = {
				objectLanguage: null,
				objectDataType: null
			};
			
			var subject = statement.getSubject();
			if (subject instanceof dojos.rdf.URI) {
				_statement.subject = subject.getValue().toString();
			} else {
				_statement.subject = subject.toString();
			}
			
			var predicate = statement.getPredicate();
			_statement.predicate = predicate.getValue().toString();
			
			var object = statement.getObject();
			if (object instanceof dojos.rdf.Literal) {
				var value = object.getValue();
				_statement.objectType = 'literal';
				if (dojo.isNumber(value) || dojo.isBoolean(value)) {
					_statement.object = value;
				} else {
					_statement.object = value;
				}
				if (object.getLanguage()) {
					_statement.objectLanguage = object.getLanguage();
				}
				if (object.getDataType()) {
					_statement.objectDataType = object.getDataType();
				}
			} else if (object instanceof dojos.rdf.Blank) {
				_statement.objectType = 'bnode';
				_statement.object = object.toString();
			} else {
				_statement.objectType = 'uri';
				_statement.object = object.getValue().toString();
			}
			_object.items.push(_statement);
		});
		return _object;
	};
		
}();