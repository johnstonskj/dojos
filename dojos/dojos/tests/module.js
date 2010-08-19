dojo.provide("dojos.tests.module");

/*
 * This is the D.O.H. entry point for testing all of the DojoS RDF modules. 
 */

try{
	/*
	 * Require each test module.
	 */
     dojo.require("dojos.tests.rdf");
     dojo.require("dojos.tests.rdf.graph");
     dojo.require("dojos.tests.rdf.model");
     dojo.require("dojos.tests.rdf.factory");
     dojo.require("dojos.tests.rdf.io.ntriples");     
     dojo.require("dojos.tests.rdf.io.turtle");     
     dojo.require("dojos.tests.rdf.io.json");     
     dojo.require("dojos.tests.data");
} catch(e) {
     doh.debug(e);
}