
Input = {
	position:0,
	options:[],
	count: 1,
	reset:function(){
		this.position = 0;
		this.options = [];
		this.count = 1;
		this.display();
	},
	up:function(){
		if(this.position >0) this.position--;
		this.highlight(); 
	},
	down:function(){
		if(this.position < this.options.length - 1) this.position++;
		this.highlight();
	},
	more:function(){
		this.count++;
		$('#target #count .value').text(this.count);
	},
	less:function(){
		if(this.count > 1) this.count--;
		$('#target #count .value').text(this.count);
	},
	query:function(value){
		if(value.length <= 1) return;
		this.reset();
		value.replace(' ', ',');
		UI.reset();
		$('#query').addClass('working');
		API.nameSearch(value, function(data){
			//console.log(`Got ${data.cards.length} cards`);
			dedup = {};
			for(val of data.cards){
				if(!dedup[val.name] // Are we missing
					|| val.multiverseid > dedup[val.name].multiverseid) // This one is newer...
					dedup[val.name] = val;
			}
			sorted = Object.values(dedup).sort((a,b) => a.name.localeCompare(b.name));
			for(val of sorted){
				if(Input.options.length <= 20)
					Input.options.push(val);
			};
			UI.reset();
			Input.display();
		});
		Candy.tickleQuery();
	},
	display:function(){
		$('#target').empty();
		for(var i = 0; i < Input.options.length; i++) {
			var val = Input.options[i];
			$('#target').append(`
				<a onclick="return Input.select(${i});" class="selectable entry">${val.name}</a>`);
		};
		if(this.options.length > 0)
			$('#target').append(`
				<div id="count">
					<span class="word">Count: </span>
					<span class="value">${this.count}</span>
				</div>`);
		Input.highlight();
	},
	highlight:function(){
		$('#target .highlight').removeClass('highlight');
		if(this.position >= 0)
			$($('#target').children()[this.position]).addClass('highlight');

	},
	select:function(pos){
		pos = pos | Input.position
		var item = Input.options[pos]
		var toAdd = Input.count
		if(item) {
			var fun = function(card, total){
				if(Array.isArray(card) && card.length > 0)
					card = card[0]
				if(card){
					for(var i = 0; i < total; i++){
							Deck.cards.push(card)
					}
				}
				UI.reset()
				UI.toggleEditable(true)
				Deck.display()
			}
			if(!!item.multiverseid)
				fun(item, toAdd)
			else
				API.queryExact(item.name, function(data,status,req){
					fun(data, toAdd)
				})
		}
		$('#query').val('');
		this.reset();
	}
};