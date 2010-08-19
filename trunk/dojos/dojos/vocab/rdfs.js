dojo.provide("dojos.vocab.rdfs");

//description:
//		This module provides the standard elements of the RDF Schema namespace
//		as constant values that can be used by the framework and clients.
//


dojos.vocab.rdfs = new function() {
	
	this.PREFIX = "rdfs",
	this.NSURL = "http://www.w3.org/2000/01/rdf-schema#",
	
	this.Resource = NSURL + "Resource",
	this.Class = NSURL + "Class",
	this.subClassOf = NSURL + "subClassOf",
	this.subPropertyOf = NSURL + "subPropertyOf",
	this.comment = NSURL + "comment",
	this.label = NSURL + "label",
	this.domain = NSURL + "domain",
	this.range = NSURL + "range",
	this.seeAlso = NSURL + "seeAlso",
	this.isDefinedBy = NSURL + "isDefinedBy",
	this.Literal = NSURL + "Literal",
	this.Container = NSURL + "Container",
	this.ContainerMembershipProperty = NSURL + "ContainerMembershipProperty",
	this.member = NSURL + "member",
	this.Datatype = NSURL + "Datatype"
	
}();


