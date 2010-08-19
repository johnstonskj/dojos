dojo.provide("dojos.tests.rdf.model");

dojo.require("dojos.rdf");
dojo.require("dojos.rdf.Graph");
dojo.require("dojos.tests.testdata");

doh.register("dojos.tests.rdf.model", [

   	function test_error() {
   		var e = new dojos.rdf.RdfError("Example exception", "dojos.tests.rdf.dataModel");
   		doh.assertTrue(e instanceof dojos.rdf.RdfError);
   	},
   	
   	function test_blank() {
   		var b1 = new dojos.rdf.Blank("1234");
   		var b2 = new dojos.rdf.Blank("1234");
   		var b3 = new dojos.rdf.Blank("5678");
   		
   		doh.assertFalse(b1 == b2);
   		doh.assertTrue(b1.equals(b2));
   		doh.assertFalse(b1.equals(b3));
   		
   		doh.assertEqual("_:1234", b1.toString());

   		var b4 = new dojos.rdf.Blank();
   		var b5 = new dojos.rdf.Blank();

   		doh.assertTrue(dojo.isString(b4.getValue()));
   		doh.assertTrue(dojo.isString(b5.getValue()));
   		doh.assertFalse(b1 == b2);
   		
   		var b4 = new dojos.rdf.Blank("_:1234");
   		var b5 = new dojos.rdf.Blank("_:5678");

   		doh.assertTrue(b1.equals(b4));
   		doh.assertTrue(b3.equals(b5));
   		
   		doh.assertEqual("_:1234", b4.toString());
   	},
   	
   	function test_blankBadValues() {
		try {
			s = new dojos.rdf.Blank([]);
			throw "Fail: Blank should not accept an array";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
		
		try {
			s = new dojos.rdf.Blank({});
			throw "Fail: Blank should not accept an object";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
   	},
   	
   	function test_uri() {
   		var u1 = new dojos.rdf.URI("http://www.amazon.com/");
   		var u2 = new dojos.rdf.URI("http://www.amazon.com/");
   		var u3 = new dojos.rdf.URI("http://www.example.com/");
   		
   		doh.assertFalse(u1 == u2);
   		doh.assertTrue(u1.equals(u2));
   		doh.assertFalse(u1.equals(u3));
   		
   		doh.assertEqual("<http://www.amazon.com/>", u1.toString());
   		
   		var u4 = new dojos.rdf.URI("<http://www.amazon.com/>");
   		var u5 = new dojos.rdf.URI("<http://www.example.com/>");
   		
   		doh.assertTrue(u1.equals(u4));
   		doh.assertTrue(u3.equals(u5));
   		
   		doh.assertEqual("<http://www.amazon.com/>", u4.toString());
   	},
   	
   	function test_uriBadValues() {
		try {
			s = new dojos.rdf.URI(null);
			throw "Fail: URI should not accept null";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
		
		try {
			s = new dojos.rdf.URI([]);
			throw "Fail: URI should not accept an array";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
		
		try {
			s = new dojos.rdf.URI({});
			throw "Fail: URI should not accept an object";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
   	},
   	
   	function test_uriAbsolute() {
   		var u1 = new dojos.rdf.URI("http://www.amazon.com/");
   		var u2 = new dojos.rdf.URI("/foo");
   		var u3 = new dojos.rdf.URI("bar");
   		
   		doh.assertTrue(u1.isAbsolute());
   		doh.assertFalse(u2.isAbsolute());
   		doh.assertFalse(u3.isAbsolute());

   		var u4 = new dojos.rdf.URI("ftp://ftp.amazon.com/pub");
   		var u5 = new dojos.rdf.URI("mailto:simonjo@amazon.com");
   		var u6 = new dojos.rdf.URI("uri:urn:uuid:982374983427598475");

   		doh.assertTrue(u4.isAbsolute());
   		doh.assertTrue(u5.isAbsolute());
   		doh.assertTrue(u6.isAbsolute());
   	},
   	
   	function test_literal() {
   		var l1 = new dojos.rdf.Literal("Amazon.com");
   		var l2 = new dojos.rdf.Literal("Amazon.com", {language: "en-us"});
   		var l3 = new dojos.rdf.Literal("Amazon.com", {dataType: new dojos.rdf.URI("xsd:int")});
   		
   		doh.assertEqual("\"Amazon.com\"", l1.toString());
   		doh.assertEqual("\"Amazon.com\"@@en-us", l2.toString());
   		doh.assertEqual("\"Amazon.com\"^^<xsd:int>", l3.toString());

   		doh.assertEqual("1234", new dojos.rdf.Literal(1234).toString());
   		doh.assertEqual("1234.01", new dojos.rdf.Literal(1234.01).toString());
   		doh.assertEqual("true", new dojos.rdf.Literal(true).toString());

   		var l4 = new dojos.rdf.Literal("Amazon.com");
   		doh.assertFalse(l1 == l4);
   		doh.assertTrue(l1.equals(l4));
   		doh.assertFalse(l1.equals(l2));
   		doh.assertFalse(l1.equals(l3));
	},

   	function test_literalBadValues() {
		try {
			s = new dojos.rdf.Literal(null);
			throw "Fail: Literal should not accept null";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
		
		try {
			s = new dojos.rdf.Literal([]);
			throw "Fail: Literal should not accept an array";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
		
		try {
			s = new dojos.rdf.Literal({});
			throw "Fail: Literal should not accept an object";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
	},
	
	function test_statement() {
		var u = new dojos.rdf.URI("http://www.amazon.com/");
		var p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#marketPlace");
		var l = new dojos.rdf.Literal("Amazon.com");
		var s = new dojos.rdf.Statement(u, p, l);
		
		try {
			s = new dojos.rdf.Statement(l, p, l);
			throw "Fail: Subject#subject should not accept a literal";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
		try {
			s = new dojos.rdf.Statement(null, p, l);
			throw "Fail: Subject#subject should not accept a null";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}

		try {
			s = new dojos.rdf.Statement(u, l, l);
			throw "Fail: Subject#predicate should not accept a literal";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
		try {
			s = new dojos.rdf.Statement(u, null, l);
			throw "Fail: Subject#predicate should not accept a null";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}

		try {
			s = new dojos.rdf.Statement(u, p, null);
			throw "Fail: Subject#object should not accept a null";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
		var s2 = new dojos.rdf.Statement(u, p, l);
		var s3 = new dojos.rdf.Statement(u, u, l);
   		doh.assertFalse(s == s2);
   		doh.assertTrue(s.equals(s2));
   		doh.assertFalse(s.equals(s3));
   	},
   	
	function test_statementAbsolute() {
		var u1 = new dojos.rdf.URI("http://www.amazon.com/");
		var u2 = new dojos.rdf.URI("/page/thing");
		var p = new dojos.rdf.URI("http://v.amazon.com/vocab/1.1#marketPlace");
		var l = new dojos.rdf.Literal("Amazon.com");

		try {
			s = new dojos.rdf.Statement(u2, p, l);
			throw "Fail: Subject#subject should not accept a relative URI";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}

		try {
			s = new dojos.rdf.Statement(u1, u2, l);
			throw "Fail: Subject#predicate should not accept a relative URI";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
		
		try {
			s = new dojos.rdf.Statement(u1, p, u2);
			throw "Fail: Subject#object should not accept a relative URI";
		} catch (e) {
			if (!(e instanceof dojos.rdf.RdfError)) {
				throw e;
			}
		}
   	}
]);

