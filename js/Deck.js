
Deck = {
	cards:[],
	resetOptions: function(){
		$(".sets").empty();
	},
	dragging:function(){
		$("#card_drop").remove();
		if(UI.dragging){
			console.log("Showing dropper");
			$('#deck').append(`
				<div id="card_drop" class="card dropOnly" 
				ondrop="UI.drop(event,${Deck.cards.length})" ondragenter="UI.dragEnter(event)" ondragleave="UI.dragLeave(event)" 
				ondragover="UI.dragOver(event)" ondragend="UI.dragEnd(event)">
					<div class="container top">
						<img src="https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=133359&type=card" />
					</div>
					<div class="container bot">
						<img src="https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=133359&type=card" />
					</div>
				</div>
			`);
		}
	},
	display:function(){
		var cardMap = {}
		$('#deck').empty();
		for(var i = 0; i < this.cards.length; i++){
			var item = this.cards[i];
			$('#deck').append(`
				<div id="card_${i}" class="card" draggable="true" ondragstart="UI.dragStart(event, ${i})" ondrag="UI.drag(event)"
				ondrop="UI.drop(event,${i})" ondragenter="UI.dragEnter(event)" ondragleave="UI.dragLeave(event)" 
				ondragover="UI.dragOver(event)" ondragend="UI.dragEnd(event)">
					<div class="cardInner">
						<a class="delete" title="Delete" onclick="UI.removePos(${i}); return false;"><span>X</span></a>
						<a class="set" title="Change set" onclick="Deck.showSets(${i}); return false;"><span>@</span></a>
						<div class="sets list"></div>
						<span class="name">${item.name}</span>
						<div class="container top">
							<img src="${item.imageUrl}" />
						</div>
						<div class="container bot">
							<img src="${item.imageUrl}" />
						</div>
					</div>
				</div>`);
			var name = `${item.name} (${item.set})`;
			if(cardMap[name])
				cardMap[name]++;
			else
				cardMap[name] = 1;
		}
		var s = ""
		for(var prop in cardMap){
			s += `${cardMap[prop]}x ${prop}\n`;
		}
		$("#TextView").val(s)
		State.save();
	},
	showSets: function(pos){
		UI.reset();
		var sets = $(`#card_${pos} .sets`);
		API.queryExact(Deck.cards[pos].name, function(cards){
			cards = cards.sort((a,b) => a.setName.localeCompare(b.setName));
			for(card of cards){
				sets.append(`
					<a class="selectable" onclick="UI.changePos(${pos}, ${card.multiverseid}); return false;">
						<span>${card.setName}</span>
					</a>
					<img src="${card.imageUrl}" />`);
			}
		});
	}
};
