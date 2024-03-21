
API_scryfall = {
	basics: ["Plains","Island","Swamp","Mountain","Forest"],
	basicLandSets: ["THB","2XM","ZEN","UST"],

	nameSearch: function(name, fun){
		var r = `https://api.scryfall.com/cards/autocomplete?q=${name}`
		return R.getJSON(r, function(data, status, req){
			if(data.data){
				var newdata = {cards:[]}
				data.data.forEach(e =>{
					newdata.cards.push({name:e, multiverseid:0})
				}
					)
				fun(newdata, status, req)
			}
		})
	},

	// Search by name (and set)
	query: function(... args){
		var name = args[0].trim();
		var set = args.length > 2 ? args[1] : null;
		var fun = args[args.length - 1];
		var r = `https://api.scryfall.com/cards/named?exact=${name}`
		if(!!set)
			r += `&set=${set}`
		return R.getJSON(r, function(data, status,req){
			fun(data, status,req)
		})

	},
	queryExact: function(... args){

		var aName = args[0];
		var aSet = args.length > 2 ? args[1] : null;
		var fun = args[args.length - 1];

		console.log({m:"Query Exact", n:aName, s:aSet})

		var names = Array.isArray(aName) ? aName : [aName]
		var sets = Array.isArray(aName) ? sets : [aSet]

		var toSearch = []
		for(var i = 0; i < names.length; i++){
			if(API.cacheNames[names[i]] === undefined)
				toSearch.push({name:names[i],set:sets[i]})
		}
		console.log(`Looking for ${names.join(" ")}`)

		var toResult = function(){
			var results = []
			for(var i = 0; i < names.length; i++){
				results.push(API.getCardBySet(names[i],sets[i]))
			}
			return Array.isArray(aName) && results.length > 0 ? results : results[0]
		}
		if(toSearch.length > 0){
			if(!Array.isArray(aName)){
				var url = `https://api.scryfall.com/cards/search?q=!"${aName}"&unique=prints`
				R.getJSON(url, function(data,status,req){
					data.data.forEach(card => {
						card = API_scryfall.fixCard(card)
						if(!card) return
						if(API.cacheNames[card.name] == null || !API.cacheNames[card.name].all){
							API.cacheNames[card.name] = []
							API.cacheNames[card.name].all = true
						}
						API.cacheNames[card.name].push(card)
					})
					fun(toResult())
				})
			}
			else{
				var start = 0
				var jump = 75
				var fetchy = function(){
					var postData = {identifiers:[]}
					toSearch.slice(start, start+=jump).forEach(e => {
						var obj = {name:e.name}
						if(!!e.set)
							obj.set = e.set
						postData.identifiers.push(obj)
						})
					R.postJSON("https://api.scryfall.com/cards/collection", postData, function(data, status, req){
						console.log(`Found ${data.data.length}`)
						var newdata = data.data.map(el => API_scryfall.fixCard(el))
						newdata.forEach(card => {
							if(API.cacheNames[card.name] == null)
								API.cacheNames[card.name] = []
							API.cacheNames[card.name].push(card)
						})
						if(start < toSearch.length)
							setTimeout(fetchy, 100)
						else
							fun(toResult())
					})
				}
				fetchy()
			}
		}
		else{
			fun(toResult())
		}
	},
	// The exact card ID
	fetch: function(id, fun){
		requestIds = id
		if(!Array.isArray(id))
			requestIds = [id]

		var toSearch = requestIds.filter(e => API.cacheIds[e] == null && e > 0)
		var toResult = function(){
			var results = id.map(e => API.cacheIds[e])
			return Array.isArray(id) ? results : results[0]
		}
		if(toSearch.length > 0){
			var start = 0
			var jump = 75
			var fetchy = function(){
				var postData = {identifiers:[]}
				console.log(`Fetching from ${start} to ${start+jump} of ${toSearch.length}`)
				toSearch.slice(start,start+=jump).forEach(e => postData.identifiers.push({multiverse_id:e}))
				R.postJSON("https://api.scryfall.com/cards/collection", postData, function(data, status, req){
					var newdata = data.data.map(el => API_scryfall.fixCard(el))
					newdata.forEach(card => {
						if(card)
							API.cacheIds[card.multiverseid] = card
					})
					if(start < toSearch.length)
						setTimeout(fetchy, 100);
					else
						fun(toResult())

				})	
			}
			fetchy();
		}else{
			fun(toResult())
		}
	},
	fixCard: function(card){
		card = {...card}
		if(card.multiverse_ids.length == 0) return null
		card.multiverseid = card.multiverse_ids[0]
		card.setName = card.set_name
		card.imageUrl = `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`
		return card;
	},

	init: function(){
		console.log('Switching to Scryfall API')

		API.nameSearch = API_scryfall.nameSearch
		API.query = API_scryfall.query
		API.queryExact = API_scryfall.queryExact
		API.fetch = API_scryfall.fetch	
	}
};

API_scryfall.init();
