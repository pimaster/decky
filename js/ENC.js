
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
	},
	setCodeEnc: function(s){
		s = s.toLowerCase();
		s = s.replace(/\d/g, (char) => {
			var c = char.charCodeAt(0);
			return String.fromCharCode(c + 17);
		});
		return s;
	},
	setCodeDec: function(s){
		s = s.replace(/[A-Z]/g, (char) => {
			var c = char.charCodeAt(0);
			return String.fromCharCode(c-17);
		});
		return s;
	}
}
ENC.len = ENC.dat.length;
