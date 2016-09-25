var login = {
	backClickCount: 0,
	start: function() {
		login.before();
		mui.init();
		login.after();
	},
	before: function() {},
	after: function() {
		login.pReady();
		document.getElementById('btnRegister').addEventListener('tap', function() {
			mui.openWindow('register.html', 'register.html');
		});
		document.getElementById('btnReset').addEventListener('tap', function() {
			mui.openWindow('reset.html', 'reset.html');
		});
		document.getElementById('btnLogin').addEventListener('tap', function() {
			login.login();
		});
	},
	pReady: function() {
		mui.plusReady(function() {
			if(login.isLogin()) {
				mui.openWindow('index.html', 'index.html');
			}
			plus.screen.lockOrientation("portrait-primary");
			mui.back = function(event) {
				login.backClickCount++;
				if(login.backClickCount > 1) plus.runtime.quit();
				else plus.nativeUI.toast('再按一次退出应用');
				setTimeout(function() {
					login.backClickCount = 0;
				}, 1000);
				return false;
			};
		});
	},
	isLogin: function() {
		// TODO
		var id = localStorage.getItem(Constant.keys.CLIENT_ID);
		if(Ajax.isEmpty(id)) return false;
		return true;
	},
	login: function() {
		var email = document.getElementById('email').value;
		var pass = document.getElementById('password').value;
		if(Ajax.isEmpty(email)) {
			plus.nativeUI.toast('邮箱不能为空');
			return;
		}
		if(!Constant.regex.email.test(email)) {
			plus.nativeUI.toast('邮箱格式不正确');
			return; 
		}
		if(Ajax.isEmpty(pass)) {
			plus.nativeUI.toast('密码不能为空');
			return;
		}
		Ajax.post(Ajax.url.clientLogin, {
			email: email,
			password: pass
		}, function(data) {
			localStorage.setItem(Constant.keys.CLIENT_ID, data.id);
			localStorage.setItem(Constant.keys.CLIENT_EMAIL, data.email);
			localStorage.setItem(Constant.keys.CLIENT_NICKNAME, data.nickname);
			localStorage.setItem(Constant.keys.CLIENT_HEADURL, data.headUrl);
			localStorage.setItem(Constant.keys.CLIENT_SIGNINDATE, data.signInDate);
			localStorage.setItem(Constant.keys.CLIENT_SCORE, data.score);
			mui.openWindow('index.html', 'index.html');
		});
	}
}