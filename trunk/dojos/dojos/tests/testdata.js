dojo.provide("dojos.tests.testdata");

dojos.tests.testdata = new function() {
	
	this.examplePrefixes = {
		"": "http://example.org/default/",
		"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		"rdfs": "http://www.w3.org/2000/01/rdf-schema#",
		"xsd": "http://www.w3.org/2001/XMLSchema#",
		"dc": "http://purl.org/dc/elements/1.1/",
		"amzn": "http://v.amazon.com/vocab/1.1#"
	};
	
	this.exampleStatement = function() {
		var u = new dojos.rdf.URI("http://www.amazon.com/");
		var p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#marketPlace");
		var l = new dojos.rdf.Literal("Amazon.com");
		var s = new dojos.rdf.Statement(u, p, l);
		
		return s;
	};
	
	this.exampleGraph1 = function() {
		var g = new dojos.rdf.Graph();
		g.add(this.exampleStatement());
		
		return g;
	};
	
	this.exampleGraph4 = function() {
		var g = new dojos.rdf.Graph();

		var u = new dojos.rdf.URI("http://www.amazon.com/");
		var p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#marketPlace");
		var l = new dojos.rdf.Literal("Amazon.com");
		g.add(new dojos.rdf.Statement(u, p, l));
		
		p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#merchant");
		l = new dojos.rdf.Literal("Amazon");
		g.add(new dojos.rdf.Statement(u, p, l));
		
		p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#country");
		l = new dojos.rdf.Literal("US");
		g.add(new dojos.rdf.Statement(u, p, l));
		
		p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#language");
		l = new dojos.rdf.Literal("en-US");
		g.add(new dojos.rdf.Statement(u, p, l));
		
		return g;
	};
	
	this.exampleGraph6 = function() {
		var g = new dojos.rdf.Graph();

		var u = new dojos.rdf.URI("http://www.amazon.com/");
		var p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#marketPlace");
		var l = new dojos.rdf.Literal("Amazon.com");
		g.add(new dojos.rdf.Statement(u, p, l));
		
		p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#merchant");
		l = new dojos.rdf.Literal("Amazon");
		g.add(new dojos.rdf.Statement(u, p, l));

		p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#locale");
		var b = new dojos.rdf.Blank("A1");
		g.add(new dojos.rdf.Statement(u, p, b));

		p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#country");
		l = new dojos.rdf.Literal("US");
		g.add(new dojos.rdf.Statement(b, p, l));

		l = new dojos.rdf.Literal("CA");
		g.add(new dojos.rdf.Statement(b, p, l));

		p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#language");
		l = new dojos.rdf.Literal("en-US");
		g.add(new dojos.rdf.Statement(b, p, l));
		
		return g;
	};
	
}();
