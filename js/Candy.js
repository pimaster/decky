
Candy = {
	animate: true,
	inputToggle: function(e){
		var sel = $(".selected")
		UI.reset("Candy");
		sel.removeClass("selected");
		if(e){
			var tar = $("#" + $(e.target).parents(".key").attr("id") + "Open");
			if(!sel.is(tar)) {
				tar.toggleClass("selected");
				$(e.target).parents(".key").toggleClass("selected");
			}
		}
		return false;
	},
	tickleQuery: function(){
		if(Candy.animate){
			console.log("tickle")
			var start = parseFloat(document.documentElement.style.getPropertyValue("--query-y-offset"));
			var jump = .3;
			if (start > -60)
				jump *= -1;
			var twiddle = function(){
				start += jump
				document.documentElement.style.setProperty("--query-y-offset", `${start}px`);
				if(start < -50 && start > -70)
					setTimeout(twiddle ,10);
			};
			twiddle();
		}
	}
}

document.documentElement.style.setProperty("--query-y-offset", "-50px");	