dojo.provide("dojos.tests.rdf.io.json");

dojo.require("dojos.rdf.io");
dojo.require("dojos.tests.testdata");

doh.register("dojos.tests.rdf.io.json", [
   
    function test_outputEmptyGraph() {
    	var g = new dojos.rdf.Graph();

    	var n = dojos.rdf.io.getHandlerForType("application/json");
    	doh.assertEqual("{}", n.format(g));
    },
    
    function test_outputGraph() {
    	var g = dojos.tests.testdata.exampleGraph6();
    	var prefixes = dojos.tests.testdata.examplePrefixes;

    	var n = dojos.rdf.io.getHandlerForType("application/json");
    	var o = n.format(g);
    	doh.debug(o);
    	// TODO: actually test something
    },
    
    function test_parseInput() {
    	var testData = {
    		"http://www.amazon.com/": {
    			"http://v.amazon.com/vocab/1.1#marketPlace": [
    			    { "type": "literal", "value": "Amazon.com" }                                          
    			],
    			"http://v.amazon.com/vocab/1.1#merchant": [
    			    { "type": "literal", "value": "Amazon", "lang": "en-us" }
    			],
    			"http://v.amazon.com/vocab/1.1#locale": [
    			    { "type": "bnode", "value": "_:A1" }
    			]
    		},
    		"_:A1": {
    			"http://v.amazon.com/vocab/1.1#country": [
    			    { "type": "literal", "value": "US" },
    			    { "type": "literal", "value": "CA" }
    			 ],
    			 "http://v.amazon.com/vocab/1.1#language": [
    			    { "type": "literal", "value": "en-US" }
    			 ]
    		}
    	};
    	var json = dojo.toJson(testData);
    	
    	var n = dojos.rdf.io.getHandlerForType("application/json");
    	var graph = n.parseInput(json);
    	
    	doh.assertEqual(6, graph.size());

    	var o = n.format(graph);
    	doh.debug(o);
    	// TODO: actually test something
    }
    
]);
