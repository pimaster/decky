
State = {
	load: function(){
		s = window.location.hash.substring(1);
		console.log("Loading state: " + s);
		if(s.length > 0){
			state = JSON.parse(decodeURIComponent(s));
			
			var idsToDeckFun = function(allIds){
				Candy.loading(true);
				var ids = Array.from(new Set(allIds));
				API.fetch(ids, function(data){
					for(var v of allIds)
					{
						card = API.cacheIds[v];
						if(card)
							Deck.cards.push(card);
					}
					Deck.display();
					Candy.loading(false);
				});
			}
			
			if(state.c && state.c.length > 0) {
				var ids = state.c.filter(val => !!val);
				idsToDeckFun(ids);
			}
			if(state.c2){
				var ids = [];
				var s = 0;
				while(s < state.c2.length)
					ids.push(ENC.dec(state.c2.slice(s,s+=4)));
				idsToDeckFun(ids);
			}
			if(state.cbg){
				backgroundURL.value = state.cbg.u;
				backgroundScale.value = state.cbg.s;
				backgroundOffsetX.value = state.cbg.x;
				backgroundOffsetY.value = state.cbg.y;
				UI.backgroundUpdate();
			}
			if(state.v){
				viewSelector.value = state.v;
				UI.viewChange(true);
			}
		}
	},
	save: function(){
		var ids = Deck.cards.map(v => parseInt(v.multiverseid));
		ids = ids.map(v => ENC.enc(v).padStart(4,"0"));
		var state = {
			// c Was version 1 that was an array of ids
			// c: ids
			// c2 is version 2 that is 4 char that is base 66
			c2: ids.join(""),
			v: viewSelector.value
		};
		if(backgroundURL.value.length > 0){
			state.cbg = {
				u: backgroundURL.value,
				s: backgroundScale.value,
				x: backgroundOffsetX.value,
				y: backgroundOffsetY.value
			}
		}
		window.location.hash = encodeURI(JSON.stringify(state));
	},
	loadText: function(){
		Candy.loading(true);
		Deck.cards = [];
		var lines = [];
		var input = $("#TextInput").val().split("\n")
		var decode = [];
		for(var line of input){
			var orig = line;
			if(line.length > 0){
				if(line.startsWith("//")) {
					continue; // Ignore comments
					lines.push(orig);
				}
				var parts = line.trim().split(" ");
				var count = 1;
				var set = "";
				var test = parts[0].replaceAll("x", "");
				if(parseInt(test)){
					count = parseInt(test);
					line = line.substr(parts[0].length + 1);
				}
				var name = line.trim();
				test = parts[parts.length - 1];
				if(/\(...\)/.test(test)){
					set = test.substr(1,3);
					name = line.substring(0, line.length - (test.length + 1));
				}
				decode.push({
					orig: orig,
					count: count,
					name: name,
					set: set
				});
			}
		}
		console.log("Iterated");
		
		var fetchLineF = function(){
			var item = decode.shift();
			console.log(`Looking for ${item.name} from ${item.set}`);
			
			API.queryExact(item.name, item.set, function(data, cached){
				if(data && data.length >= 1){
					while(item.count-- > 0)
						Deck.cards.push(data[0])
					lines.push(item.orig);
				}else{
					lines.push("// " + item.orig);
				}
				
				$("#TextInput").val(lines.join("\n"));
				if(decode.length > 0) {
					Deck.display(true);
					setTimeout(fetchLineF, cached ? 1 : 50);
				}else{
					Deck.display();
					Candy.loading(false);
				}
			});
			
		}
		fetchLineF();
		Candy.inputToggle(); // Close the side bars
	}
};
