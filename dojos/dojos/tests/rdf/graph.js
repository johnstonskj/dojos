dojo.provide("dojos.tests.rdf.graph");

dojo.require("dojos.rdf.Graph");
dojo.require("dojos.tests.testdata");

doh.register("dojos.tests.rdf.graph", [
   
    function test_graphEmpty() {
    	var g = new dojos.rdf.Graph();
    	doh.assertTrue(g.isEmpty());
    },

    function test_graphNotEmpty() {
		var g = dojos.tests.testdata.exampleGraph4();
		
    	doh.assertFalse(g.isEmpty());
    	doh.assertEqual(4, g.size());
    },
    
    function test_graphContains() {
		var graph = dojos.tests.testdata.exampleGraph4();
		var statements = graph.listStatements();
		
		doh.assertEqual(4, graph.size());
		dojo.forEach(statements, function(s, i) {
			doh.assertTrue(graph.contains(s));
		});
    },
    
    function test_graphDeDup() {
    	var s = dojos.tests.testdata.exampleStatement();
		var g1 = dojos.tests.testdata.exampleGraph4();
		var g2 = dojos.tests.testdata.exampleGraph4();
		
    	doh.assertEqual(4, g1.size(), "Check initial size");
    	
    	doh.assertTrue(g1.contains(s), "Check containment");
    	
    	doh.assertFalse(g1.add(s));
    	doh.assertEqual(4, g1.size(), "Check de-dup on add one");
    	
    	g1.addAll(g2);
    	doh.assertEqual(4, g1.size(), "Check de-dup on add all");
    },
    
    function test_graphRemove() {
		var graph = dojos.tests.testdata.exampleGraph4();
		var statements = graph.listStatements();
		
		doh.assertEqual(4, graph.size());
		dojo.forEach(statements, function(s, i) {
			doh.assertTrue(graph.remove(s));
			doh.assertFalse(graph.remove(s));
			doh.assertEqual(statements.length - (i + 1), graph.size());
		});
		doh.assertEqual(0, graph.size());
    },
    
    function test_graphFactory() {
    	var g1 = new dojos.rdf.Graph();
    	var g2 = new dojos.rdf.Graph();
    	
    	/*
    	 * Prove that by default all graphs share a common value map
    	 */
    	doh.assertTrue(g1.values === g2.values);

    	var g3 = new dojos.rdf.Graph();
    	g3.values = new dojos.rdf.ValueFactory();
    	
    	doh.assertFalse(g1.values === g3.values);
    },
    
    function test_graphLists() {
		var g = dojos.tests.testdata.exampleGraph4();
		
    	doh.assertEqual(4, g.listStatements().length, "Listing all statements");
    	doh.assertEqual(1, g.listSubjects().length, "Listing discrete subjects");
    	doh.assertEqual(4, g.listPredicates().length, "Listing discrete predicates");
    	doh.assertEqual(4, g.listObjects().length, "Listing discrete objecst");

    	var s1 = new dojos.rdf.URI("http://www.amazon.com/");
    	var s2 = new dojos.rdf.URI("http://www.example.com/");
    	doh.assertEqual(4, g.listPredicatesFor(s1).length, "Listing predicates for valid subject");
    	doh.assertEqual(0, g.listPredicatesFor(s2).length, "Listing predicates for invalid subject");

    	var p1 = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#marketPlace");
    	var p2 = new dojos.rdf.URI("http://www.example.com/something");
    	doh.assertEqual(1, g.listObjectsFor(s1, p1).length, "Listing objects for valid subject/predicates");
    	doh.assertEqual(0, g.listObjectsFor(s1, p2).length, "Listing objects for invalid subject/predicates");
    	doh.assertEqual(0, g.listObjectsFor(s2, p1).length, "Listing objects for invalid subject/predicates");
    	doh.assertEqual(0, g.listObjectsFor(s2, p2).length, "Listing objects for invalid subject/predicates");
    },

    function test_graphReification() {
    	var graph = new dojos.rdf.Graph();
    	
		var statement = graph.createStatement("http://example.org", "http://www.example.org/vocab#name", "My Name");
		graph.add(statement);
		doh.assertEqual(1, graph.size());

		graph.reify(statement);
		doh.assertEqual(4, graph.size());
		
		doh.assertFalse(graph.contains(statement));
    }

]);
