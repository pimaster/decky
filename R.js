
R = {
	getJSON: function(r, fun){
		$("#apiStatus").text("Fetching");
		return $.getJSON(r, function(data, status, req){
			$("#apiRemaining").text(req.getResponseHeader("ratelimit-remaining") + ' requests remain');
			fun(data, status, req);
			$("#apiStatus").empty();
		});
	}
};
