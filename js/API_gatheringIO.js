
API_gatheringIO = {
	// Search by name (and set)
	query: function(... args){
		var name = args[0].trim();
		var set = args.length > 2 ? args[1] : null;
		var fun = args[args.length - 1];
		var r = `https://api.magicthegathering.io/v1/cards?contains=imageUrl&pageSize=80&name="${name}"|${name}`;
		if(set) r += "&set=" + set;
		return R.getJSON(r, function(data,status,req){
			if(data.cards){
				//console.log("Trying to filter out lands");
				//       Name  Set
				// aLand false true
				// !Land true irrelevant
				data.cards = data.cards.filter(card => !API_gatheringIO.basics.includes(card.name) || API_gatheringIO.basicLandSets.includes(card.set));
			}
			fun(data,status,req);
		});
	},
	queryExact: function(... args){
		var name = args[0];
		var set = args.length > 2 ? args[1] : null;
		var fun = args[args.length - 1];
		if(Array.isArray(name)){
			var toSearch = name.filter(val => API.cacheNames[val] == null)
				.map(name => `"${name}"`);		
			var r = "https://api.magicthegathering.io/v1/cards?contains=imageUrl&pageSize=100&name=" + toSearch.join("|");
			if(toSearch.length == 0) return fun();
			R.getJSON(r, function(data, result, ajax){
				if(data.cards && data.cards.length > 0){
					for(card of data.cards){
						if(API.cacheNames[card.name] == null)
							API.cacheNames[card.name] == [];
						if(card.imageUrl)
							API.cacheNames[card.name].push(card);
					}
				}
				return fun();
			});
		} else {
			if(API_gatheringIO.cacheNames[name]) return fun(API_gatheringIO.getCardBySet(name,set), true);
			var nameSearch = name;
			if(!nameSearch.includes("'")) // We can only do exact searches on names WITHOUT a single ', API bug/quirk
				nameSearch = `"${nameSearch}"`;
			var r = `https://api.magicthegathering.io/v1/cards?contains=imageUrl&pageSize=100&name=${nameSearch}`;
			if(API.basics.includes(name)){
				r += "&set=" + API.basicLandSets.join("|");
			}
			return R.getJSON(r, function(data){
				if(data.cards && data.cards.length > 0){
					API.cacheNames[name] = [];
					for(card of data.cards)
						if(card.imageUrl){ // A card we can show
							if(name.includes("'")){ // Special quote check
								if(name == card.name)
									API.cacheNames[name].push(card)
							}else{
								API.cacheNames[name].push(card)
							}
						}
				}
				return fun(API_gatheringIO.getCardBySet(name,set));
			});
		}
	},
	// The exact card ID
	fetch: function(id, fun){
		if(Array.isArray(id)){
			var toResult = function(){
				r = []
				for(var i = 0; i < id.length; i++){
					r.push(API.cacheIds[id]);
				}
				return r;
			}
			var toSearch = id.filter(function(val){ return API.cacheIds[val] == null; });
			if(toSearch.length > 0){
				var start = 0;
				var jump = 30;
				var fetchy = function() {
					var q = "https://api.magicthegathering.io/v1/cards/?multiverseid=";
					q += toSearch.slice(start, start + jump).join("|");
					start += jump;
					R.getJSON(q, function(data){
						if(data.cards){
							for(var i = 0; i < data.cards.length; i++){
								API.cacheIds[data.cards[i].multiverseid] = data.cards[i]
							}
						}
						if(start < toSearch.length){
							fetchy();
						}else{
							fun(toResult());
						}
					});
				};
				fetchy();
			}
			else{
				fun(toResult());
			}
		}
		else
		{
			if(API.cacheIds[id]) return fun(API.cacheIds[id]);
			return R.getJSON("https://api.magicthegathering.io/v1/cards/" + id, function(data){
				if(data.card){
					API.cacheIds[data.card.multiverseid] = data.card;
				}
				return fun(data.card);	
			});
		}
	},

	init: function(){

		API.nameSearch = API_gatheringIO.query
		API.query = API_gatheringIO.query
		API.queryExact = API_gatheringIO.queryExact
		API.fetch = API_gatheringIO.fetch

		R.preGet = function(req){
			$("#apiRemaining").text(req.getResponseHeader("ratelimit-remaining") + ' requests remain');
		}
	}
};

API_gatheringIO.init();

