dojo.provide("dojos.tests.rdf");

dojo.require("dojos.rdf");

doh.register("dojos.tests.rdf", [
   
    function test_qname() {
    	var prefixes = {
    		"": "http://example.org/default/",
    		"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    		"rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    		"xsd": "http://www.w3.org/2001/XMLSchema#",
    		"dc": "http://purl.org/dc/elements/1.1/"
    	};
    	doh.assertEqual("rdf:about", dojos.rdf.qname("http://www.w3.org/1999/02/22-rdf-syntax-ns#about", prefixes));
    	doh.assertEqual("xsd:int", dojos.rdf.qname("http://www.w3.org/2001/XMLSchema#int", prefixes));
    	doh.assertEqual(":foo", dojos.rdf.qname("http://example.org/default/foo", prefixes));
    	doh.assertEqual(undefined, dojos.rdf.qname("http://example.org#int", prefixes));
    	doh.assertEqual(undefined, dojos.rdf.qname("http://www.w3.org/1999/02/22-rdf-syntax-ns#about", {}));
    	doh.assertEqual(undefined, dojos.rdf.qname("", prefixes));
    },
    
    function test_uriref() {
    	var prefixes = {
        		"": "http://example.org/default/",
        		"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        		"rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        		"xsd": "http://www.w3.org/2001/XMLSchema#",
        		"dc": "http://purl.org/dc/elements/1.1/"
        	};
    	doh.assertEqual("<http://www.w3.org/1999/02/22-rdf-syntax-ns#about>", dojos.rdf.uriref("rdf:about", prefixes).toString());
    	doh.assertEqual("<http://www.w3.org/2001/XMLSchema#int>", dojos.rdf.uriref("xsd:int", prefixes).toString());
    	doh.assertEqual("<http://example.org/default/foo>", dojos.rdf.uriref(":foo", prefixes)).toString();
    	doh.assertEqual(undefined, dojos.rdf.uriref("ex:name", prefixes));
    	doh.assertEqual(undefined, dojos.rdf.uriref("xsd:int", {}));
    	doh.assertEqual(undefined, dojos.rdf.uriref("", prefixes));
    }
    
]);
