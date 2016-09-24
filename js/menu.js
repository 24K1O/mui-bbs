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
		console.info(localStorage.getItem(Constant.keys.CLIENT_NICKNAME));
		document.getElementById('headUrl').setAttribute('src', Constant.hostname + localStorage.getItem(Constant.keys.CLIENT_HEADURL))
		document.getElementById('nickname').innerHTML = localStorage.getItem(Constant.keys.CLIENT_NICKNAME);
		
	},
	after: function() {
		mui.plusReady(function() {
			menu.main = plus.webview.currentWebview().opener();
		});
		window.addEventListener("swipeleft", menu.close);
		mui.menu = menu.close;
	},
	close: function() {
		mui.fire(menu.main, "menu:swipeleft");
	}
}