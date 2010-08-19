dojo.provide("dojos.rdf.Graph");

// description:
//		This module provides the core abstractions for the RDF data model, that
//		is the Graph, the Statement, the URI, the Blank Node and the Literal.
// see:
//		[RDF Concepts and Abstract Syntax]
//		http://www.w3.org/TR/2004/REC-rdf-concepts-20040210/#section-Graph-syntax
//

dojo.require("dojox.lang.functional");
dojo.require("dojox.uuid.generateTimeBasedUuid");
dojo.require("dojox.uuid.Uuid");

dojo.require("dojos.rdf");
dojo.require("dojos.vocab.rdf");

dlf = dojox.lang.functional;

dojo.isNumber = function(/*anything*/ it) {
	//	description:
	//		Return true if it is a Number
	return (typeof it == "number" || it instanceof Number); // Boolean
};

dojo.isBoolean = function(/*anything*/ it) {
	//	description:
	//		Return true if it is a Boolean
	return (typeof it == "boolean" || it instanceof Boolean); // Boolean
};

dojo.declare("dojos.rdf.URI", null, {
	// description:
	//		Encapsulates the notion of a URI, this is basically a wrapper
	//		around a dojo.Url value which is used for some very basic
	//		level of validation.
	//
	
	constructor: function(/* String|URI|dojo._Url */ uri) {
		// description:
		//		Create a new URI using the provided value as the basis.
		// 
		// uri: String | URI | dojo._Url
		//		the base value, either a string, another URI or a
		//		dojo._Url value.
		//
		if (dojo.isString(uri)) {
			if (uri.slice(0,1) == "<" && uri.slice(-1) == ">") {
				uri = uri.slice(1,-1);
			}
			this.value = new dojo._Url(uri);
		} else if (uri instanceof dojo._Url) {
			this.value = uri;
		} else if (uri instanceof dojos.rdf.URI) {
			this.value = uri.getValue();
		} else {
			throw new dojos.rdf.RdfError(
					"Invalid value for new URI", 
					"dojos.rdf.URI", 
					{value: uri, type: typeof value});
		}
	},
	
	getValue: function() {
		// description:
		//		Returns the value of this URI as a dojo._Url.
		//
		return this.value;
	},
	
	isAbsolute: function() {
		// description:
		//		Returns true if this is an absolute URI, determined by the 
		//		presence of a scheme value.
		return (this.value.scheme != null);
	},
	
	toString: function() {
		return "<" + this.getValue() + ">";
	},
	
	equals: function(/* URI */ other) {
		if (other && other instanceof dojos.rdf.URI) {
			return this.toString() == other.toString();
		}
		return false;
	}
});

dojo.declare("dojos.rdf.Blank", null, {
	// description:
	//		Represents a blank, anonymous node in the RDF data model.
	//
	
	constructor: function(/* String|Blank|undefined */ value) {
		// description:
		//		Create a new blank node using value as the internal identifier.
		//		If the value is not provided a new, unique, value will be constructed.
		//
		// value: [optional] String | Blank
		//		An ID for this blank node, must be unique in the graph, it is
		//		the clients responsibility to ensure uniqueness.
		//
		if (!value) {
			var uuid = new dojox.uuid.Uuid(dojox.uuid.generateTimeBasedUuid());
			this.value = "_" + uuid.toString();
		} else if (dojo.isString(value)) {
			if (value.slice(0, 2) == "_:") {
				value = value.slice(2);
			}
			this.value = value;
		} else if (value instanceof dojos.rdf.Blank) {
			this.value = value.getValue();
		} else {
			throw new dojos.rdf.RdfError(
					"Invalid value for new BlankNode", 
					"dojos.rdf.Blank", 
					{value: value, type: typeof value});
		}
	},

	getValue: function() {
		// description:
		//		Return the string value of the blank node identifier.
		return this.value;
	},
	
	toString: function() {
		return "_:" + this.getValue();
	},

	equals: function(/* Blank */ other) {
		if (other && other instanceof dojos.rdf.Blank) {
			return this.value == other.value;
		}
		return false;
	}
});

dojo.declare("dojos.rdf.Literal", null, {
	// description:
	//		Represents a literal object value in the RDF data model. A literal
	//		can be a simple string value, or it can be a value with either a
	//		specified language or data type.
	//

	constructor: function(/* String|Number|Boolean|Literal */ value, /* Object */ params) {
		// description:
		//		Construct a new Literal with the provide value which should be
		//		a simple type (String, Number, Boolean) or another Literal.
		//
		// value: String | Number | Boolean | Literal
		//		the new value of this literal
		// params: Object
		//		an object that can contain either "language" or "dataType".
		//
		if (dojo.isString(value) || dojo.isNumber(value) || dojo.isBoolean(value)) {
			this.value = value;
		} else if (value instanceof dojos.rdf.Literal) {
			this.value = value.getValue();
		} else {
			throw new dojos.rdf.RdfError(
					"Invalid value type for literal, not one of String, Number or Boolean", 
					"dojos.rdf.Literal", 
					{value: value, type: typeof value});
		}
		if (params) {
			if (params["language"]) {
				if (dojo.isString(params.language)) {
					this.language = params.language;
				} else {
					throw new dojos.rdf.RdfError(
						"Invalid 'language' for literal, not a String", 
						"dojos.rdf.Literal", 
						{language: params.language});
				}
			}
			if (params["dataType"]) {
				if (params.dataType instanceof dojos.rdf.URI) {
					this.dataType = params.dataType;
				} else {
					throw new dojos.rdf.RdfError(
						"Invalid 'dataType' for literal, not a URI", 
						"dojos.rdf.Literal", 
						{dataType: params.dataType});
				}
			}
		}
	},

	getValue: function() {
		// description:
		//		Return the value of this literal
		return this.value;
	},
	
	getLanguage: function() {
		// description:
		//		Return the language of this literal, or undefined.
		return this.language;
	},
	
	getDataType: function() {
		// description:
			//		Return the data type of this literal, or undefined.
		return this.dataType;
	},
	
	toString: function() {
		if (dojo.isNumber(this.value) || dojo.isBoolean(this.value)) {
			return String(this.value);
		} else if (this.language) {
			return '"' + String(this.getValue()) + '"@@' + this.language;
		} else if (this.dataType) {
			return '"' + String(this.getValue()) + '"^^' + this.dataType.toString();
		} else {
			return '"' + String(this.getValue()) + '"';
		}
	},

	equals: function(/* Literal */ other) {
		if (other && other instanceof dojos.rdf.Literal) {
			return this.value == other.value && this.language == other.language && this.dataType == other.dataType;
		}
		return false;
	}

});

dojo.declare("dojos.rdf.Statement", null, {
	// description:
	//		Represents the Statement, or triple, concept in the RDF data model. 
	//		[RDF Concepts and Abstract Syntax] defines a triple as "An RDF triple 
	//		contains three components: the subject [...], the predicate [...],
	//		the object [...] An RDF triple is conventionally written in the 
	//		order subject, predicate, object.
	//		This API is loosely based on the API for the Model class in Jena 
	//		with the explicit addition of the ValueFactory which is closer to 
	//		Sesame.
	//
	
	constructor: function(/* URI|Blank|String */ subject, /* URI|String */ predicate, /* URI|Blank|Literal|String|Number|Boolean */ object, /* URI */ context) {
		// description:
		//		Construct a new Statement object
		//
		// subject: URI | Blank | String
		// predicate: URI | String
		// object: URI | Blank | Literal | String | Number | Boolean
		// context: [optional] URI
		//
		if (context) {
			if (dojo.isString(context)) {
				this.context = new dojos.rdf.URI(context);
			} else  if (context instanceof dojos.rdf.URI) {
				this.context = context;
			} else {
				throw new dojos.rdf.RdfError(
					"Invalid 'context' for statement, not a URI", 
					"dojos.rdf.Statement", 
					{context: context, type: typeof context});
			}
			if (!context.isAbsolute()) {
				throw new dojos.rdf.RdfError(
						"Invalid 'context' for statement, not an absolute URI", 
						"dojos.rdf.Statement", 
						{context: context});
			}
		}
		
		if (dojo.isString(subject)) {
			this.subject = new dojos.rdf.URI(subject);
		} else if (subject instanceof dojos.rdf.URI || subject instanceof dojos.rdf.Blank) {
			this.subject = subject;
		} else {
			throw new dojos.rdf.RdfError(
				"Invalid 'subject' for statement, not a resource", 
				"dojos.rdf.Statement", 
				{subject: subject, type: typeof subject});
		}
		if (this.subject instanceof dojos.rdf.URI && !this.subject.isAbsolute()) {
			throw new dojos.rdf.RdfError(
					"Invalid 'subject' for statement, not an absolute URI", 
					"dojos.rdf.Statement", 
					{subject: this.subject});
		}
		
		if (dojo.isString(predicate)) {
			this.predicate = new dojos.rdf.URI(predicate);
		} else  if (predicate instanceof dojos.rdf.URI) {
			this.predicate = predicate;
		} else {
			throw new dojos.rdf.RdfError(
				"Invalid 'predicate' for statement, not a URI", 
				"dojos.rdf.Statement", 
				{predicate: predicate, type: typeof predicate});
		}
		if (!this.predicate.isAbsolute()) {
			throw new dojos.rdf.RdfError(
					"Invalid 'predicate' for statement, not an absolute URI", 
					"dojos.rdf.Statement", 
					{predicate: this.predicate});
		}
		
		if (dojo.isString(object) || dojo.isNumber(object) || dojo.isBoolean(object)) {
			this.object = new dojos.rdf.Literal(object);
		} else if (object instanceof dojos.rdf.URI || object instanceof dojos.rdf.Blank || object instanceof dojos.rdf.Literal) {
			this.object = object;
		} else {
			throw new dojos.rdf.RdfError(
				"Invalid 'object' for statement, not a resource or literal", 
				"dojos.rdf.Statement", 
				{object: object, type: typeof object});
		}
		if (this.object instanceof dojos.rdf.URI && !this.object.isAbsolute()) {
			throw new dojos.rdf.RdfError(
					"Invalid 'object' for statement, not an absolute URI", 
					"dojos.rdf.Statement", 
					{object: this.object});
		}
	},

	getContext: function() {
		// description:
		//		Return the context of this statement
		return this.subject;
	},

	getSubject: function() {
		// description:
		//		Return the subject of this statement
		return this.subject;
	},

	getPredicate: function() {
		// description:
			//		Return the predicate of this statement
		return this.predicate;
	},

	getObject: function() {
		// description:
			//		Return the object of this statement
		return this.object;
	},

	toString : function() {
		return this.subject.toString() + " " + this.predicate.toString() + " " + this.object.toString() + " .";
	},

	equals: function(/* Statement */ other) {
		var equal = false;
		if (other && other instanceof dojos.rdf.Statement) {
			if (this.context) {
				equal = 
					this.context.equals(other.context) && 
					this.subject.equals(other.subject) &&
					this.predicate.equals(other.predicate) &&
					this.object.equals(other.object);
			} else {
				equal =
					this.subject.equals(other.subject) &&
					this.predicate.equals(other.predicate) &&
					this.object.equals(other.object);
			}
		}
		return equal;
	}

});

dojo.declare("dojos.rdf.ValueFactory", null, {
	// description:
	//		This class is used to provide a cache for values within graphs,
	//		for example the same URI will be used in many statements, as will
	//		common blank nodes. This cache prevents excessive memory usage.
	//
	
	constructor: function() {
		// description:
		//		Create a new, empty, value factory.
		//
		this.valueMap = {};
	},
	
	createURI: function(/* String|URI */ uri) {
		// description:
		//		Create a new URI, or return a cached one if it already exists.
		//
		// uri: String | URI
		//		The URI value to create.
		//
		var key = "uri::" + uri;
		if (dojo.isString(uri)) {
			if (!this.valueMap[key]) {
				this.valueMap[key] = new dojos.rdf.URI(uri);
			}
			return this.valueMap[key];
		} else if (uri instanceof dojos.rdf.URI) {
			if (!this.valueMap[key]) {
				this.valueMap[key] = uri;
			}
			return uri;
		}
		return undefined;
	},

	createBlank: function(/* String|Blank */ id) {
		// description:
		//		Create a new Blank node, or return a cached one if it already exists.
		//
		// id: String | Blank
		//		The Blank node id to create.
		//
		var key = "bnode::" + id;
		if (!id) {
			var blank = new dojos.rdf.Blank(id);
			return this.createBlank(blank);
		} else {
			if (dojo.isString(id)) {
				if (!this.valueMap[key]) {
					this.valueMap[key] = new dojos.rdf.Blank(id);
				}
				return this.valueMap[key];
			} else if (id && id instanceof dojos.rdf.Blank) {
				if (!this.valueMap[key]) {
					this.valueMap[key] = id;
				}
				return id;
			}
		}
		return undefined;
	},

	createLiteral: function(/* String|Number|Boolean|Literal */ value, /* Object */ params) {
		// description:
		//		Create a new Literal, or return a cached one if it already exists.
		//
		// value: String | Number | Boolean | Literal
		//		The literal value.
		// params: Object
		//		An object that can contain one of the following keys: language - a 
		//		language code to qualify the value, dataType - a URI for the data
		//		type of the value.
		//
		var key = "literal::" + typeof value + ":" + value;
		if (params && params["language"]) {
			key = key + ":language=" + params.language;
		}
		if (params && params["dataType"]) {
			key = key + ":dataType=" + params.dataType;
		}
		if (dojo.isString(value) || dojo.isNumber(value) || dojo.isBoolean(value)) {
			if (!this.valueMap[key]) {
				this.valueMap[key] = new dojos.rdf.Literal(value, params);
			}
			return this.valueMap[key];
		} else if (value instanceof dojos.rdf.Literal) {
			if (!this.valueMap[key]) {
				this.valueMap[key] = value;
			}
			return value;
		}
		return undefined;
	},
	
	arrayToStatements: function(/* URI|Blank */ subject, /* URI */ predicate, /* Array */ values) {
		// description:
		//		Create an array of statements, with the same subject and 
		//		predicate but each to contain a value from the array 
		//		provided. Note that the returned array may contain 
		//		duplicate statements if the array contains duplicate values,
		//		these would be filtered when added to a Graph.
		//
		// subject: URI | Blank
		//		The subject for each new statement
		// predicate: URI
		//		The predicate for each new statement
		// values: Array
		//		An array of values, these can be simple values (String, Number,
		//		Boolean) or they can be URI, Blank or Literal RDF types.
		//
		if (dojo.isArray(values)) {
			var statements = [];
			var self = this;
			dojo.forEach(values, function(value) {
				if (dojo.isString(value) || dojo.isNumber(value) || dojo.isBoolean(value)) {
					statements.push(
						new dojos.rdf.Statement(subject, predicate, self.createLiteral(value))
					);
				} else if (value instanceof dojos.rdf.URI || value instanceof dojos.rdf.Blank || value instanceof dojos.rdf.Literal) {
					statements.push(
						new dojos.rdf.Statement(subject, predicate, value)
					);
				} else {
					// ignore
				}
			});
			return statements;
		}
		return undefined;
	},
	
	arrayToContainer: function(/* URI|Blank */ subject, /* URI */ predicate, /* Array */ values, /* URI */ containerClass) {
		// description:
		//		Create an array of statements, The subject and predicate
		//		denote a container (of type containerClass) with a new
		//		statement for each value from values.
		//		Note that the returned array may contain 
		//		duplicate statements if the array contains duplicate values,
		//		these would be filtered when added to a Graph.
		//
		// subject: URI | Blank
		//		The subject for each new statement
		// predicate: URI
		//		The predicate for each new statement
		// values: Array
		//		An array of values, these can be simple values (String, Number,
		//		Boolean) or they can be URI, Blank or Literal RDF types.
		// containerClass: [optional] URI
		//		Indicates the class of the container, usually one of rdf:Seq,
		//		rdf:Bag, rdf:Alt. The default is rdf:Bag.
		//
		if (!containerClass) {
			containerClass = this.createURI(dojos.vocab.rdf.Bag);
		}
		if (dojo.isArray(values)) {
			var statements = [];
			var blank = this.createBlank();
			var li = this.createURI(dojos.vocab.rdf.li);
			statements.push(
				new dojos.rdf.Statement(subject, predicate, blank)
			);
			statements.push(
				new dojos.rdf.Statement(blank, this.createURI(dojos.vocab.rdf.type), containerClass)
			);
			var self = this;
			dojo.forEach(values, function(value) {
				if (dojo.isString(value) || dojo.isNumber(value) || dojo.isBoolean(value)) {
					statements.push(
						new dojos.rdf.Statement(blank, li, self.createLiteral(value))
					);
				} else if (value instanceof dojos.rdf.URI || value instanceof dojos.rdf.Blank || value instanceof dojos.rdf.Literal) {
					statements.push(
						new dojos.rdf.Statement(blank, li, value)
					);
				} else {
					// ignore
				}
			});
			return statements;
		}
		return undefined;
	},
	
	objectToStatements: function(/* URI|Blank */ subject, /* URI */ predicateNS, /* Object */ values) {
		// description:
		//		Create an array of statements, where the subject is common
		//		but the predicates and objects are taken from the simple
		//		object provided using the properties of the object.
		//		Note that the returned array may contain 
		//		duplicate statements if the array contains duplicate values,
		//		these would be filtered when added to a Graph.
		//		If the object is a Dojo instance (contains the property
		//		"declaredClass" this will be used as the type of the
		//		subject, else the value of "typeof" will be used.
		//
		// subject: URI | Blank
		//		The subject for each new statement.
		// predicateNS: URI
		//		The URI representing the namespace for each predicate, this
		//		will be the URL base where the name of the object property
		//		will be added to make the actual predicate URI.
		// values: Object
		//		An object whose property names will become the predicates 
		//		and whose values will become the object for a new statement. 
		//
		if (dojo.isObject(values) && !dojo.isArray(values)) {
			var statements = [];
			if (values["declaredClass"]) {
				statements.push(
					new dojos.rdf.Statement(
						subject, 
						this.createURI(dojos.vocab.rdf.type), 
						this.createURI("uri:javascript:" + values["declaredClass"]))
				);
			} else {
				statements.push(
					new dojos.rdf.Statement(
						subject, 
						this.createURI(dojos.vocab.rdf.type), 
						this.createURI("uri:javascript:" + typeof values))
				);
			}
			var self = this;
			dlf.forIn(values, function(value, key) {
				var predicate = new dojos.rdf.URI(predicateNS + key);
				if (dojo.isString(value) || dojo.isNumber(value) || dojo.isBoolean(value)) {
					statements.push(
						new dojos.rdf.Statement(subject, predicate, self.createLiteral(value))
					);
				} else if (value instanceof dojos.rdf.URI || value instanceof dojos.rdf.Blank || value instanceof dojos.rdf.Literal) {
					statements.push(
						new dojos.rdf.Statement(subject, predicate, value)
					);
				} else {
					// ignore
				}
			});
			return statements;
		}
		return undefined;
	}
});

dojo.declare("dojos.rdf.Graph", null, {
	// description:
	//		Represents the notion of a graph in the RDF data model where a graph
	//		is defined in [RDF Concepts and Abstract Syntax] as "An RDF Graph is
	//		a set of RDF Triples". As the RDF data model defines a Graph as a Set
	//		the graph implementation does not allow for duplicate statements, that
	//		is where any two statements may be considered equal. 
	//		Note that at this time the implementation here does not consider a 
	//		single statement S and its reified form Sr as equal.
	//
	
	// values: ValueFactory
	//		This is a shared, common, value factory for all instances of a Graph,
	//		this implies that where a specific graph needs a distinct cache of 
	//		values it should reset the per-instance factory.
	values: new dojos.rdf.ValueFactory(),

	constructor: function(/* URI|String */ context) {
		// description:
		//		Create a new, empty, Graph. Note that this sets the per-
		//		instance this.values to the shared ValueFactory, if you
		//		need a per-instance specific factory then you should reset
		//		graph.values to a new dojos.rdf.ValueFactory.
		//
		// context: URI | String
		//		The context for the graph, sometimes called the name, so that 
		//		this instance is a "named graph". Any statement added to a 
		//		named graph has its context set to the graph context, any
		//		statement created by a named graph will similarly have its
		//		context set on creation.
		if (context) {
			if (dojo.isString(context)) {
				this.context = new dojos.rdf.URI(context);
			} else  if (context instanceof dojos.rdf.URI) {
				this.context = context;
			} else {
				throw new dojos.rdf.RdfError(
					"Invalid 'context' for Graph, not a URI", 
					"dojos.rdf.Graph", 
					{context: context, type: typeof context});
			}
			if (!context.isAbsolute()) {
				throw new dojos.rdf.RdfError(
						"Invalid 'context' for Graph, not an absolute URI", 
						"dojos.rdf.Graph", 
						{context: context});
			}
		}

		this.statements = [];
		this.index = {};
		this.values = this.__proto__.values;
	},
	
	createURI: function(/* String */ uri) {
		// description:
		//		Wrappers the local value factory to create a new URI value.
		var uri = this.values.createURI(uri);
		return uri;
	},
	
	createBlank: function(/* String */ id) {
		// description:
		//		Wrappers the local value factory to create a new blank node value.
		return this.values.createBlank(id);
	},
	
	createLiteral: function(/* String */ value, /* Object */ params) {
		// description:
		//		Wrappers the local value factory to create a new literal value.
		return this.values.createLiteral(value, params);
	},
	
	createStatement: function(/* Resource */ subject, /* URI */ predicate, /* Resource|Literal */ object) {
		// description:
		//		Wrappers the local value factory to create a new statement.
		//		Note that this will set the new statement context to the
		//		graph context.
		if (!subject instanceof dojos.rdf.URI && !subject instanceof dojos.rdf.Blank) {
			subject = this.createURI(subject);
		}
		if (!predicate instanceof dojos.rdf.URI) {
			predicate = this.createURI(predicate);
		}
		if (!object instanceof dojos.rdf.URI && !object instanceof dojos.rdf.Blank && !object instanceof dojos.rdf.Literal) {
			object = this.createLiteral(object);
		}
		var s = new dojos.rdf.Statement(subject, predicate, object, this.context);
		var exists = this._indexOf(s);
		if (exists >= 0) {
			return this.statements[exists];
		}
		return s;
	},
	
	listStatements: function() {
		// description:
		//		Return a list of all statements in the graph. Note that this
		//		will return a copy of the statements in the graph, removing
		//		statements from the returned list will have no effect on the
		//		contents of the graph.
		return this.statements.slice(0);
	},
	
	listStatementsMatching: function(/* Callback */ filter) {
		// description:
		//		Return a list of all statements in the graph for which the provided
		//		filter function returns true. The filter function will be passed
		//		each statement in turn.
		//
		// filter: Function
		//		A function that takes a single parameter which is a Statement and 
		//		returns a boolean.
		return this._iterator(filter);
	},

	listSubjects: function() {
		// description:
		//		Return a Set of all subject (URI or Blank node) values present in
		//		the graph.
		return this._iterator(undefined, "subject", true);
	},
	
	listPredicates: function() {
		// description:
		//		Return a Set of all predicate (URI) values present in
		//		the graph.
		return this._iterator(undefined, "predicate", true);
	},
	
	listPredicatesFor: function(/* URI|Blank */ subject) {
		// description:
		//		Return a Set of all predicate (URI) values for the provided
		//		subject.
		//
		// subject: URI | Blank
		//		Return only predicates for this subject
		return this._iterator(function(s) { 
			return s.subject.equals(subject);
		}, "predicate", true);
	},
	
	listObjects: function() {
		// description:
		//		Return a Set of all object (URI, Blank node or Literal) values 
		//		present in the graph.
		return this._iterator(undefined, "object");
	},
	
	listObjectsFor: function(/* URI */ subject, /* URI */ predicate) {
		// description:
		//		Return a Set of all object (URI, Blank node or Literal) values 
		//		for the provided subject and predicate.
		//
		// subject: URI | Blank
		//		Return only objects for this subject
		// predicate: URI
		//		Return only objects for this predicate
		return this._iterator(function(s) { 
			return (s.subject.equals(subject) && s.predicate.equals(predicate));
		}, "object", true);
	},
	
	contains: function(/* Statement */ statement, /* Boolean */ includeReified) {
		// description:
		//		Returns true if this graph contains this statement. 
		//		Note the context of a statement is not considered as part 
		//		of the equality test.
		//
		// statement: Statement
		//		The statement to look for.
		// includeReified: [optional] Boolean
		//		If true then also check whether the reified form of statement
		//		is included in the graph.
		var plain = (this._indexOf(statement) >= 0);
		if (!plain && includeReified) {
			return this.isReified(statement);
		}
		return plain;
	},

	containsAll: function(/* Array|Graph */ other) {
		// description:
		//		Returns true if this graph contains all the statements from 
		//		"other".
		//
		//	other: Array | Graph
		//		Either another graph or an array of statements.
		if (dojo.isArray(other)) {
			return every(other, function(statement) {
				return this.contains(statement);
			});
		} else {
			return every(other.listStatements(), function(statement) {
				return this.contains(statement);
			});
		}
	},
	
	containsAny: function(/* Array|Model */ other) {
		// description:
			//		Returns true if this graph contains any of the statements from 
			//		"other".
			//
			//	other: Array | Graph
			//		Either another graph or an array of statements.
		if (dojo.isArray(other)) {
			return some(other, function(statement) {
				return this.contains(statement);
			});
		} else {
			return some(other.listStatements(), function(statement) {
				return this.contains(statement);
			});
		}
	},
	
	add: function(/* Statement */ statement) {
		// description:
		//		Add the statement to the graph, the graph is considered as a set
		//		of statements so duplicate statements will not be added. Also
		//		new statements added to a named graph will have their context set
		//		to the context of the graph, in this case this will result in a 
		//		new statement which is a copy of the original.
		//		Returns true if the statement was added to the graph or false if
		//		it could not (for example, it is a duplicate of an existing
		//		statement).
		//
		// statement: Statement
		//		The statement to add.
		var idx = this._indexOf(statement);
		if (idx == -1) {
			/*
			 * Adopt this statement
			 */
			if (this.context) {
				if (!this.context.equals(statement.context)) {
					statement = new dojos.rdf.Statement(
						statement.getSubject(),
						statement.getPredicate(),
						statement.getObject(),
						this.context
					);
				}
			}
			/*
			 * Now add
			 */
			this.statements.push(statement);
			this.index[statement.toString()] = this.statements.length - 1;
			return true;
		}
		return false;
	},
	
	addAll: function(/* Array|Graph */ other) {
		// description:
		//		Add all the statements in "other" to this graph.
		//
		// other: Array | Graph
		//		Either another graph or an array of statements.
		var self = this;
		if (dojo.isArray(other)) {
			dojo.forEach(other, function(statement) {
				self.add(statement);
			});
		} else {
			dojo.forEach(other.listStatements(), function(statement) {
				self.add(statement);
			});
		}
	},
	
	remove: function(/* Statement */ statement) {
		// description:
		//		Remove the statement from the graph. Returns true if the
		//		statement was removed, false if it could not be found 
		//		in the graph.
		//
		// statement: Statement
		//		The statement to remove.
		var idx = this._indexOf(statement);
		if (idx >= 0) {
			this.statements.splice(idx, 1);
			delete this.index[statement.toString()];
	   		dlf.forIn(this.index, function(value, key, object) {
	   			if (object[key] > idx) {
	   				object[key] = value - 1;
				}
	   		});
			return true;
		}
		return false;
	},
	
	removeAll: function(/* Array|Graph */ other) {
		// description:
		//		Remove all the statements in "other" from this graph.
		//
		// other: Array | Graph
		//		Either another graph or an array of statements.
		var self = this;
		if (dojo.isArray(other)) {
			dojo.forEach(other, function(statement) {
				self.remove(statement);
			});
		} else {
			dojo.forEach(other.listStatements(), function(statement) {
				self.remove(statement);
			});
		}
	},
	
	empty: function() {
		// description:
		//		Remove all statements from this graph.
		this.statements = [];
		this.index = {};
	},
	
	isEmpty: function() {
		// description:
		//		Returns true if this graph contains no statements.
		return this.size() == 0;
	},
	
	size: function() {
		// description;
		//		Returns the size of this graph, that is the number of 
		//		statements contained in the graph.
		return this.statements.length;
	},

	isReified: function(/* Statement */ statement) {
		// description:
		//		Returns true if this graph contains the reified form of
		//		the statement provided.
		//
		// statement: Statement
		//		The statement to check for.
		var statements = this._reify(statement);
		
		return this.containsAll(statements);
	},

	reify: function(/* Statement */ statement) {
		// description:
		//		reify the provided statement in the graph. All triples
		//		of the reified form will be added to the graph and the
		//		array of such statements will be returned to the caller.
		//
		// statement:
		//		The statement to reify
		var statements = this._reify(statement);
		
		this.addAll(statements);
		this.remove(statement);
		
		return statements;
	},

	_reify: function(/* Statement */ statement) {
		// description:
		//		Internal function to generate the reified form of a statement.
		// tags:
		//		private
		var statements = [];
		
		var bnode = new dojos.rdf.Blank();
		statements.push(new dojos.rdf.Statement(
			bnode, 
			this.createURI(dojos.vocab.rdf.type), 
			this.createURI(dojos.vocab.rdf.Statement)));
		statements.push(new dojos.rdf.Statement(
			bnode, 
			this.createURI(dojos.vocab.rdf.subject), 
			statement.getSubject()));
		statements.push(new dojos.rdf.Statement(
			bnode, 
			this.createURI(dojos.vocab.rdf.predicate), 
			statement.getPredicate()));
		statements.push(new dojos.rdf.Statement(
			bnode, 
			this.createURI(dojos.vocab.rdf.object), 
			statement.getObject()));
		
		return statements;
	},
	
	_indexOf: function(/* Statement */ statement) {
		// description:
		//		Internal function to find a statement in the graph.
		// tags:
		//		private
		var idx = this.index[statement.toString()];
		return (idx === undefined ? -1 : idx);
	},
	
	_iterator: function(/* Callback */ filter, /* String */ key, /* boolean */ dedup) {
		// description:
		//		Internal function to iterate over all statements in the graph.
		// tags:
		//		private
		var self = this;
		var keys = [];
		var results = [];
		dojo.forEach(self.statements, function(statement) {
			if (!filter || filter(statement)) {
				if (key) {
					if (dedup) {
						if (!keys[statement[key].toString()]) {
							keys[statement[key].toString()] = statement[key]
							results.push(statement[key]);
						}
					} else {
						results.push(statement[key]);
					}
				} else {
					if (dedup) {
						if (!keys[statement.toString()]) {
							keys[statement.toString()] = statement
							results.push(statement);
						}
					} else {
						results.push(statement);
					}
				}
			}
		});
		return results;
	}
});
