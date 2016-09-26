var register = {
	start: function() {
		register.before();
		mui.init();
		register.after();
	},
	before: function() {},
	after: function() {
		register.pReady();
		document.getElementById('btnRegister').addEventListener('tap', function() {
			register.register();
		});
	},
	pReady: function() {
		mui.plusReady(function() {
			plus.screen.lockOrientation("portrait-primary");
		});
	},
	register: function() {
		var email = document.getElementById('email').value;
		var pass = document.getElementById('password').value;
		var confirm = document.getElementById('confirm').value;
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
		if(pass != confirm) {
			plus.nativeUI.toast('两次密码不一致');
			return;
		}
		document.getElementById('btnRegister').setAttribute('disabled', 'disabled');
		Ajax.post(Ajax.url.clientRegister, {
			email: email,
			password: pass,
			confirm: confirm
		}, function(data) {
			plus.nativeUI.toast('注册成功');
			mui.openWindow('login.html', 'login.html');
		});
	}
}