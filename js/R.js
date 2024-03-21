
R = {
	getJSON: function(url, fun){
		$("#apiStatus").text("Fetching");
		return $.getJSON(url, function(data, status, req){
			R.preGet(req)
			fun(data, status, req)
			$("#apiStatus").empty();
			R.postGet(req)
		});
	},
	postJSON: function(url, data, fun){
		var process = function(data, status, req){
			R.preGet(req)
			fun(data.responseJSON, status, req)
			$("#apiStatus").empty();
			R.postGet(req)
		}
		$("#apiStatus").text("Fetching");
		return $.ajax({
			url: url,
			type: "POST",
			data: JSON.stringify(data),
			contentType: "application/json",
			complete: process
		})
		//return $.post(url, JSON.stringify(data), process,"json")
	},
	preGet: function(){},
	postGet: function(){},
};
