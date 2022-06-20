
$(document).ready(function(){
	$('#query').keyup(function(){
		if(this.last == $('#query').val()) return;
		this.last = $('#query').val();
		clearTimeout(this.future);
		this.future = setTimeout(function(){
			Input.query($('#query').val());
		},800)
	});
	$('#query').keydown(function(e){
		var stop = function(e){
			e.stopPropagation(); 
		}; 
		e = window.event ? window.event : e;
		switch(e.which){
			case 37: Input.less(); stop(e); return false;
			case 38: Input.up(); stop(e);  return false;
			case 39: Input.more(); stop(e); return false;
			case 40: Input.down(); stop(e); return false;
			case 13: Input.select(); stop(e); return false;
			case 27: Input.reset(); stop(e); return false;
		}
	});
	
	State.load();
	if(window.location.hash.substring(1) == 0) {
		// If we don't have a deck to load, maybe show the formatted input box
		$(inputOpen).toggleClass("selected");
		$(input).toggleClass("selected");
		UI.toggleEditable(true);
	}
	else { 
		// Looks like a deck
		UI.toggleEditable(false);
	}
});