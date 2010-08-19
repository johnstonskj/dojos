dojo.provide("dojos.vocab.rdf");

// description:
//		This module provides the standard elements of the RDF syntax namespace
//		as constant values that can be used by the framework and clients.
//

dojos.vocab.rdf = new function() {
	
	this.PREFIX = "rdf",
	this.NSURL = "http://www.w3.org/1999/02/22-rdf-syntax-ns#",

	/*
	 * Syntax names
	 */
	this.RDF = this.NSURL + "RDF",
	this.Description = this.NSURL + "Description",
	this.ID = this.NSURL + "ID",
	this.about = this.NSURL + "about",
	this.parseType = this.NSURL + "parseType",
	this.resource = this.NSURL + "resource",
	this.li = this.NSURL + "li",
	this.nodeID = this.NSURL + "nodeID",
	this.dataType = this.NSURL + "dataType",
	
	/*
	 * RDF Classes
	 */
	this.Seq = this.NSURL + "Seq",
	this.Bag = this.NSURL + "Bag",
	this.Statement = this.NSURL + "Alt",
	this.Statement = this.NSURL + "Statement",
	this.Property = this.NSURL + "Property",
	this.XMLLiteral = this.NSURL + "XMLLiteral",
	this.List = this.NSURL + "List",
	this.PlainLiteral = this.NSURL + "PlainLiteral",
	
	/*
	 * RDF Properties
	 */
	this.subject = this.NSURL + "subject",
	this.predicate = this.NSURL + "predicate",
	this.object = this.NSURL + "object",
	this.type = this.NSURL + "type",
	this.value = this.NSURL + "value",
	this.first = this.NSURL + "first",
	this.rest = this.NSURL + "rest",
	
	/*
	 * RDF resources
	 */
	this.nil = this.NSURL + "nil"
	
}();


