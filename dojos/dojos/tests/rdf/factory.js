dojo.provide("dojos.tests.rdf.factory");

dojo.require("dojox.lang.functional");

dojo.require("dojos.rdf");
dojo.require("dojos.rdf.Graph");
dojo.require("dojos.tests.testdata");

dlf = dojox.lang.functional;

doh.register("dojos.tests.rdf.factory", [

   	function test_valueFactoryURI() {
   		var factory = new dojos.rdf.ValueFactory();
   		
   		var u1 = factory.createURI("http://www.amazon.com/");
   		var u2 = factory.createURI("http://www.amazon.com/");
   		var u3 = factory.createURI("http://www.target.com/");
   		var u4 = factory.createURI("http://www.target.com/");
   		
   		doh.assertTrue(u1 == u2);
   		doh.assertFalse(u2 == u3);
   		doh.assertTrue(u3 == u4);
   	},
   	
   	function test_valueFactoryBlank() {
   		var factory = new dojos.rdf.ValueFactory();
   		
   		var u1 = factory.createURI("A1");
   		var u2 = factory.createURI("A1");
   		var u3 = factory.createURI("B2");
   		var u4 = factory.createURI("B2");
   		
   		doh.assertTrue(u1 == u2);
   		doh.assertFalse(u2 == u3);
   		doh.assertTrue(u3 == u4);
   	},
   	
   	function test_valueFactoryLiteral() {
   		var factory = new dojos.rdf.ValueFactory();
   		
   		var u1 = factory.createLiteral("String One");
   		var u2 = factory.createLiteral("String One");
   		var u3 = factory.createLiteral("String Two");
   		var u4 = factory.createLiteral("String Two");
   		
   		doh.assertTrue(u1 == u2);
   		doh.assertFalse(u2 == u3);
   		doh.assertTrue(u3 == u4);

   		var u5 = factory.createLiteral("String One", {language: "en-us"});
   		var u6 = factory.createLiteral("String One", {language: "en-us"});
   		var u7 = factory.createLiteral("String One", {language: "en-gb"});
   		var u8 = factory.createLiteral("String One", {language: "en-gb"});
   		
   		doh.assertFalse(u1 == u5);
   		doh.assertTrue(u5 == u6);
   		doh.assertFalse(u6 == u7);
   		doh.assertTrue(u7 == u8);

   		var dt1 = factory.createURI("xsd:string");
   		var dt2 = factory.createURI("my:string");
   		var u9 = factory.createLiteral("String One", {dataType: dt1});
   		var u10 = factory.createLiteral("String One", {dataType: dt1});
   		var u11 = factory.createLiteral("String One", {dataType: dt2});
   		var u12 = factory.createLiteral("String One", {dataType: dt2});
   		
   		doh.assertFalse(u1 == u9);
   		doh.assertTrue(u9 == u10);
   		doh.assertFalse(u10 == u11);
   		doh.assertTrue(u11 == u12);
   	},
   	
   	function test_valueFactoryCache() {
   		var factory = new dojos.rdf.ValueFactory();
   		
   		var u1 = factory.createLiteral("String One");
   		var u2 = factory.createLiteral("String One");
   		var u3 = factory.createLiteral("String Two");
   		var u4 = factory.createLiteral("String Two");

   		var dt1 = factory.createURI("xsd:string");
   		var dt2 = factory.createURI("xsd:string");
   		var dt3 = factory.createURI("my:string");
   		var dt4 = factory.createURI("my:string");

   		var keys = dlf.keys(factory.valueMap);
   		doh.assertEqual(4, keys.length);
   	},

   	function test_valueFactoryArrays() {
   		var factory = new dojos.rdf.ValueFactory();
   		var subject = factory.createURI("http://www.amazon.com/");
   		var predicate = factory.createURI("http://www.amazon.com/vocab#something");
   		var values = ["one", "two", "three", 4, true];
   		
   		var statements = factory.arrayToStatements(subject, predicate, values);
   		doh.assertEqual(values.length, statements.length);
   		
   		doh.assertTrue(factory.arrayToStatements(subject, predicate, {}) === undefined);

   		var statements = factory.arrayToContainer(subject, predicate, values);   		
   		doh.assertEqual(values.length+2, statements.length);
   		
   		doh.assertTrue(factory.arrayToContainer(subject, predicate, {}) === undefined);
   	},
   	
   	function test_valueFactoryObjects() {
   		var factory = new dojos.rdf.ValueFactory();
   		var subject = factory.createURI("http://www.amazon.com/");
   		var predicate = factory.createURI("http://www.amazon.com/vocab#");
   		var values = {one: "one", two: "two", three: "three", four: 4, five: true};
   		
   		var statements = factory.objectToStatements(subject, predicate, values);
   		doh.assertEqual(6, statements.length);
   		
   		doh.assertTrue(factory.objectToStatements(subject, predicate, []) === undefined);
   	},
]);

