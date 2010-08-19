dojo.provide("dojos.tests.rdf.io.turtle");

dojo.require("dojos.rdf.io");
dojo.require("dojos.tests.testdata");

doh.register("dojos.tests.rdf.io.turtle", [
   
    function test_outputEmptyGraph() {
    	var g = new dojos.rdf.Graph();

    	var n = dojos.rdf.io.getHandlerForType("text/turtle");
    	doh.assertEqual("", n.format(g));
    },
    
    function test_outputGraph() {
    	var g = dojos.tests.testdata.exampleGraph6();
    	var prefixes = dojos.tests.testdata.examplePrefixes;

    	var n = dojos.rdf.io.getHandlerForType("text/turtle");
    	var o = n.format(g, { prefixes: prefixes });
    	doh.debug(o);
    	var lines = o.split("\n");
    	doh.assertTrue(14, lines.length);
    	doh.assertEqual("", lines[6]);
    	doh.assertEqual(".", lines[13]);
    },
    
    function test_outputSimpleStatement() {
		var u = new dojos.rdf.URI("http://www.amazon.com/");
		var p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#marketPlace");
		var l = new dojos.rdf.Literal("Amazon.com", {language: "en-us"});
		var s = new dojos.rdf.Statement(u, p, l);
		
    	var n = dojos.rdf.io.getHandlerForType("text/turtle");
    	var o = n.formatStatement(s);
    	doh.assertEqual("<http://www.amazon.com/> <http://v.amazon.com/vocab/1.1#marketPlace> \"Amazon.com\"@@en-us.\n", o)
    },
    
]);
