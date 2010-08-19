dojo.provide("dojos.tests.rdf.io.ntriples");

dojo.require("dojos.rdf.io");
dojo.require("dojos.tests.testdata");

doh.register("dojos.tests.rdf.io.ntriples", [
   
    function test_outputEmptyGraph() {
    	var g = new dojos.rdf.Graph();

    	var n = dojos.rdf.io.getHandlerForType("text/plain");
    	doh.assertEqual("", n.format(g));
    },
    
    function test_outputGraph() {
    	var g = dojos.tests.testdata.exampleGraph4();

    	var n = dojos.rdf.io.getHandlerForType("text/plain");
    	var lines = n.format(g).split("\n");
    	doh.assertTrue(4, lines.length);
    },
    
    function test_outputSimpleStatement() {
		var u = new dojos.rdf.URI("http://www.amazon.com/");
		var p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#marketPlace");
		var l = new dojos.rdf.Literal("Amazon.com");
		var s = new dojos.rdf.Statement(u, p, l);
		
    	var n = dojos.rdf.io.getHandlerForType("text/plain");
    	var o = n.formatStatement(s);
    	doh.assertEqual("<http://www.amazon.com/> <http://v.amazon.com/vocab/1.1#marketPlace> \"Amazon.com\".\n", o)
    },
    
    function test_outputSimpleStatements() {
		var s1 = new dojos.rdf.URI("http://www.amazon.com/");
		var s2 = new dojos.rdf.Blank("A1");
		var p1 = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#thingOne");
		var p2 = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#thingTwo");
		var l = new dojos.rdf.Literal("Amazon.com");
		
    	var n = dojos.rdf.io.getHandlerForType("text/plain");

    	var o1 = n.formatStatement(new dojos.rdf.Statement(s1, p1, s2));
    	doh.assertEqual("<http://www.amazon.com/> <http://v.amazon.com/vocab/1.1#thingOne> _:A1.\n", o1);
    	var o2 = n.formatStatement(new dojos.rdf.Statement(s2, p2, l));
    	doh.assertEqual("_:A1 <http://v.amazon.com/vocab/1.1#thingTwo> \"Amazon.com\".\n", o2);
    },
    
    function test_parseEmptyString() {
    	var parser = dojos.rdf.io.getHandlerForType("text/plain");
    	var graph = parser.parseInput("");
    	doh.assertEqual(0, graph.size());
    },
    
    function test_parseEmptyOne() {
    	var parser = dojos.rdf.io.getHandlerForType("text/plain");
    	var graph = parser.parseInput('<http://example.org/things/thingOne> <http://example.org/vocab#name> "thingOne" .');
    	doh.assertEqual(1, graph.size());
    },
    
    function test_parseBadInput() {
    	var parser = dojos.rdf.io.getHandlerForType("text/plain");
    	try {
    		var graph = parser.parseInput('<http://example.org/things/thingOne> http://example.org/vocab#name "thingOne" .');
			throw "Fail: parser#parseInput should not accept unqualifed URI";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
    	}
    }
]);
