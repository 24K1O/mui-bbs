var menu = {
	main: null,
	start: function() {
		menu.before();
		mui.init({
			keyEventBind: {
				backbutton: false,
				menubutton: false
			}
		});
		menu.after();
	},
	before: function() {
		document.getElementById('headUrl').setAttribute('src', Constant.hostname + localStorage.getItem(Constant.keys.CLIENT_HEADURL));
		document.getElementById('nickname').innerHTML = localStorage.getItem(Constant.keys.CLIENT_NICKNAME);
	},
	after: function() {
		mui.plusReady(function() {
			menu.main = plus.webview.currentWebview().opener();
		});
		window.addEventListener("swipeleft", menu.close);
		mui.menu = menu.close;
		document.getElementById('userInfo').addEventListener('tap', function() {
			mui.openWindow('html/userinfo.html', 'html/userinfo.html');
			menu.close();
		});
		document.getElementById('message').addEventListener('tap', function() {
			mui.openWindow('html/messagemain.html', 'html/messagemain.html');
			menu.close();
		});
		document.getElementById('signIn').addEventListener('tap', function() {
			mui.openWindow('html/signin.html', 'html/signin.html');
			menu.close();
		});
		document.getElementById('chat').addEventListener('tap', function() {
			mui.openWindow('html/chat.html', 'html/chat.html');
			menu.close();
		});
		document.getElementById('share').addEventListener('tap', function() {
			mui.plusReady(function() {
				plus.nativeUI.alert('此功能10 正在开发中');
			});
			menu.close();
		});
		document.getElementById('versionInfo').addEventListener('tap', function() {
			mui.openWindow('html/versioninfo.html', 'html/versioninfo.html');
			menu.close();
		});
		document.getElementById('feedback').addEventListener('tap', function() {
			mui.openWindow('html/feedback.html', 'html/feedback.html');
			menu.close();
		});
		document.getElementById('logout').addEventListener('tap', menu.logout);
	},
	close: function() {
		mui.fire(menu.main, "menu:swipeleft");
	},
	logout: function() {
		mui.plusReady(function() {
			menu.close();
			plus.nativeUI.confirm("您是否确定注销当前用户", function(e) {
				if(e.index == 1) {
					localStorage.clear();
					mui.openWindow('login.html', 'login.html');
				}
			}, "注　销", ["取消", "确定"]);
		});
	}
}