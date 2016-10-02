var signin = {
	signed: false,
	start: function() {
		mui.init();
		signin.after();
	},
	after: function() {
		signin.refresh();
		var last = new Date(localStorage.getItem(Constant.keys.CLIENT_SIGNINDATE)).format('yyyy-MM-dd');
		var now = new Date().format('yyyy-MM-dd');
		var image = '../images/unsign.png'
		if(last == now) {
			image = '../images/signed.png';
			signin.signed = true;
		}
		document.getElementById('image').setAttribute('src', image);
		document.getElementById('image').addEventListener('tap', function() {
			if(!signin.signed) {
				signin.signin();
			}
		});
	},
	signin: function() {
		mui.plusReady(function() {
			Ajax.post(Ajax.url.clientSignin, {
				id: localStorage.getItem(Constant.keys.CLIENT_ID)
			}, function(response) {
				plus.nativeUI.toast(response);
				var score = parseInt(localStorage.getItem(Constant.keys.CLIENT_SCORE), 10);
				score += 5;
				localStorage.setItem(Constant.keys.CLIENT_SCORE, score);
				localStorage.setItem(Constant.keys.CLIENT_SIGNINDATE, new Date().format('yyyy-MM-dd'));
				signin.refresh();
				document.getElementById('image').setAttribute('src', '../images/signed.png');
				
			});
		});
	},
	refresh: function() {
		document.getElementById('score').innerHTML = localStorage.getItem(Constant.keys.CLIENT_SCORE);
		document.getElementById('last').innerHTML = new Date(localStorage.getItem(Constant.keys.CLIENT_SIGNINDATE)).format('yyyy-MM-dd');
	}
}