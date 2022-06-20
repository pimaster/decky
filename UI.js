
UI = {
	dragging: false,
	dragee: null,
	dragPos: null,
	dragStart: function(e, pos){
		console.log("Drag start " + pos);
		UI.dragPos = pos;
		UI.dragging = true;
		Deck.dragging();
		UI.dragee = 
		//$('<div style="height: 40px; width: 40px; background: black;"></div>'); 
		$(e.target).parents(".card").clone(false);
		UI.dragee.attr('ondragstart',null);
		UI.dragee.attr('ondrag',null);
		UI.dragee.attr('ondrop',null);
		UI.dragee.attr('ondragenter',null);
		UI.dragee.attr('ondragleave',null);
		UI.dragee.attr('ondragover',null);
		UI.dragee.attr('ondragend',null);
		UI.dragee.attr('dragable','false');
		UI.offset = {x:e.layerX, y:e.layerY};
		UI.offset = {x:-15, y:-15};
		UI.followMouse(e);
		$("#deck").append(UI.dragee);
		UI.dragee.attr("id","dragee");
		e.dataTransfer.setData("text", e.target.id);
	},
	drag: function(e){
		
	},
	dragOver: function(e){
		UI.followMouse(e);
		if(e) e.preventDefault();
		if(e) {
			card = $(e.target).parents(".card");
			$(".hover").removeClass("hover");
			if(!card.hasClass("hover")) card.addClass("hover");
		}
	},
	drop: function(e, pos){
		console.log("Drop " + pos);
		if(UI.dragPos >= 0){
			tmp = Deck.cards.splice(UI.dragPos,1)[0];
			Deck.cards.splice(pos,0,tmp);
			UI.dragPos = null;
		}
		Deck.display();
		State.save();
		$("#dragee").remove();
		if(e) e.preventDefault();
	},
	dragEnter: function(e){
		console.log("Entering");
		if(e) $(e.target).parents(".card").addClass("hover");
	},
	dragLeave: function(e){
		console.log("Exiting");
		//if(e) $(e.target).parents(".card").removeClass("hover");
	},
	dragEnd: function(e){
		console.log("Drag end");
		UI.dragging = false;
		Deck.display();
	},
	followMouse: function(e){
		if(e && UI.offset){
			UI.dragee.css({
				top: e.clientY - UI.offset.y,
				left: e.clientX - UI.offset.x
			});
		}
	},
	
	removePos: function(pos){
		Deck.cards.splice(pos,1);
		Deck.display();
	},
	
	changePos: function(pos, newId){
		Deck.resetOptions();
		API.fetch(newId, function(data){
			Deck.cards[pos] = data;
			Deck.display();
		});
	},
	toggleEditable:function(value){
		if(value == null){
			value = displayEdit.checked;
		}
		else{
			displayEdit.checked = value;
		}
		if(value)
			$("#deck").addClass("editable");
		else
			$("#deck").removeClass("editable");
		return true;
	},
	backgroundChange: function(){
		UI.backgroundUpdate();
		State.save();
		return true;
	},
	backgroundUpdate: function(){
		$("body").removeClass("custom");
		if(backgroundURL.value.length > 0) {
			document.documentElement.style.setProperty("--custom-background-url",`url(${backgroundURL.value})`);
			document.documentElement.style.setProperty("--custom-background-scale",`${backgroundScale.value}%`);
			document.documentElement.style.setProperty("--custom-background-x-offset",`${backgroundOffsetX.value}px`);
			document.documentElement.style.setProperty("--custom-background-y-offset",`${backgroundOffsetY.value}px`);
			$("body").addClass("custom")
		}
	},
	viewChange: function(){
		$("#deck").removeClass();
		$("#deck").addClass(viewSelector.value);
		return true;
	},
	reset: function(from){
		$('#query').removeClass('working');
		if(from != "Deck")
			Deck.resetOptions();
		if(from != "Candy")
			Candy.inputToggle();
	}
};
