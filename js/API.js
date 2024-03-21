
API = {
	basics: ["Plains","Island","Swamp","Mountain","Forest"],
	basicLandSets: ["THB","2XM","ZEN","UST"],
	// Search by name (and set)
	nameSearch: function(name){
		console.log("Name Search not implemented")
	}
	query: function(... args){
		console.log("Query not implemented")
		var name = args[0].trim();
		var set = args.length > 2 ? args[1] : null;
		var fun = args[args.length - 1];
	},
	queryExact: function(... args){
		console.log("Query Exact not implemented")
		var name = args[0];
		var set = args.length > 2 ? args[1] : null;
		var fun = args[args.length - 1];
		if(Array.isArray(name)){
		}
	},
	getCardBySet: function(name, set){
		if(!set) return API.cacheNames[name];
		if(API.cacheNames[name]){
			return API.cacheNames[name].filter(i => i.set = set);
		}
		return null;
	},
	// The exact card ID
	fetch: function(id, fun){
		console.log("Fetch not implemented")
	},
	cacheNames: {},
	cacheIds: {}
};
