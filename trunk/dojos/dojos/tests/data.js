dojo.provide("dojos.tests.data");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojox.lang.functional");

dojo.require("dojos.data");

dlf = dojox.lang.functional;

doh.register("dojos.tests.data", [
   
    function test_toObject() {
    	var graph = dojos.tests.testdata.exampleGraph6();
    	var object = dojos.data.toObject(graph);
    	
    	doh.assertEqual(6, dlf.keys(object.items).length);
    },
    
    function test_toHierarchicalObject() {
    	var graph = dojos.tests.testdata.exampleGraph6();
    	var object = dojos.data.toHierarchicalObject(graph);

    	doh.assertEqual(2, dlf.keys(object.items).length);
    	doh.assertEqual(3, dlf.keys(object.items[0].children).length);
    	doh.assertEqual(2, dlf.keys(object.items[1].children).length);
    	doh.assertEqual(2, dlf.keys(object.items[1].children[0].children).length);
    },
    
    function test_ReadStore() {
    	var graph = dojos.tests.testdata.exampleGraph6();
    	var data = dojos.data.toObject(graph);
    	
    	var store = new dojo.data.ItemFileReadStore({
    		data: data
    	});
    	
		var result = new doh.Deferred();
    	var gotItems = function(items, request) {
    		var allOk = false;
    		
    		allOk = (items.length == 6);
    		
    		allOk = allOk && dlf.every(items, function(item) {
    			return  store.getValue(item, "subject") !== undefined &&
    					store.getValue(item, "predicate") !== undefined &&
						store.getValue(item, "object") !== undefined &&
						store.getValue(item, "objectType") !== undefined;
    		});
    		if (!allOk) {
    			doh.debug("Not all rows are correctly formatted");
    		}
    		result.callback(allOk);
    	};
    	store.fetch({onComplete: gotItems});
    	return result;
    },
    
    function test_ReadHierarchicalStore() {
    	var graph = dojos.tests.testdata.exampleGraph6();
    	var data = dojos.data.toHierarchicalObject(graph);
    	
    	var store = new dojo.data.ItemFileReadStore({
    		data: data,
    		hierarchical: true
    	});

		var result = new doh.Deferred();
    	var gotItems = function(items, request) {
    		
    		var allOk = false;
    		
    		allOk = (items.length == 2);
    		
    		allOk = allOk && dlf.every(items, function(item) {
    			try {
					var children = store.getValue(item, "children");
	    			var childrenOk = children && store.isItem(children);
	    			return childrenOk && (store.getValue(item, "subject") !== undefined);
    			} catch (e) {
    				console.log(e);
    				return false;
    			}
    		});
    		if (!allOk) {
    			doh.debug("Not all rows are correctly formatted");
    		}
    		result.callback(allOk);
    	};
    	store.fetch({onComplete: gotItems});
    	return result;
    },
]);
