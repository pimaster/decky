
ENC = {
	dat: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.~",
	enc: function(val){
		r = "";
		do {
			r = this.dat[val % this.len] + r;
			val = val / this.len | 0;
		} while(val > 0)
		return r;
	},
	dec: function(val){
		r = 0;
		m = 1;
		for(var i = val.length - 1; i >= 0; i--){
			r += this.dat.indexOf(val[i]) * m;
			m *= this.len;
		}
		return r;
	}
}
ENC.len = ENC.dat.length;
