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
		window.addEventListener('refresh', function(e) {
			menu.refresh();
		});
		window.addEventListener('notRead', function(e) {
			menu.notRead();
		})
		menu.refresh();
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
			menu.read();
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
		/*document.getElementById('share').addEventListener('tap', function() {
			mui.plusReady(function() {
				plus.nativeUI.alert(' 此应用太污，不建议分享！');
			});
			menu.close();
		});*/
		document.getElementById('version').addEventListener('tap', function() {
			mui.plusReady(function() {
				version.auto = false;
				version.start();
			});
			menu.close();
		});
		document.getElementById('about').addEventListener('tap', function() {
			mui.openWindow('html/about.html', 'html/about.html');
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
	},
	refresh: function() {
		document.getElementById('headUrl').setAttribute('src', Constant.hostname + localStorage.getItem(Constant.keys.CLIENT_HEADURL));
		document.getElementById('nickname').innerHTML = localStorage.getItem(Constant.keys.CLIENT_NICKNAME);
	},
	notRead: function() {
		Ajax.post(Ajax.url.messageNotRead, {
			id: localStorage.getItem(Constant.keys.CLIENT_ID)
		}, function(data) {
			var readCountEl = document.getElementById('readCount');
			if(parseInt(data, 10) > 0) {
				readCountEl.innerHTML = parseInt(data, 10);
				readCountEl.classList.remove('mui-hidden');
			} else {
				readCountEl.classList.add('mui-hidden');
			}
		});
	},
	read: function() {
		Ajax.post(Ajax.url.messageRead, {
			id: localStorage.getItem(Constant.keys.CLIENT_ID)
		}, function(data) {
			document.getElementById('readCount').classList.add('mui-hidden');
		});
	}
}