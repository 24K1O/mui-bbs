var index = {
	main: null,
	menu: null,
	mask: null,
	show: false,
	mode: 'main-move',
	start: function() {
		index.before();
		mui.init({
			swipeBack: false,
			beforeback: index.back
		});
		index.after();
	},
	before: function() {
		index.mask = mui.createMask(index.close);
	},
	after: function() {
		index.pReady();
		document.querySelector('.mui-icon-bars').addEventListener('tap', index.open);
		window.addEventListener('dragright', function(e) {
			e.detail.gesture.preventDefault();
		});
		window.addEventListener('dragleft', function(e) {
			e.detail.gesture.preventDefault();
		});
		window.addEventListener("swiperight", index.open);
		window.addEventListener("swipeleft", index.doclose);
		window.addEventListener("menu:swipeleft", index.doclose);
		mui.menu = function() {
			if(index.show) {
				index.doclose();
			} else {
				index.open();
			}
		}
	},
	pReady: function() {
		mui.plusReady(function() {
			index.main = plus.webview.currentWebview();
			setTimeout(function() {
				index.menu = mui.preload({
					id: 'menu',
					url: 'menu.html',
					styles: {
						left: 0,
						width: '70%',
						zindex: 9997
					}
				});
			}, 300);
		});
	},
	open: function() {
		if(!index.show) {
			index.menu.show('none', 0, function() {
				index.menu.setStyle({
					left: '0%',
					transition: {
						duration: 150
					}
				});
			});
			index.mask.show();
			index.show = true;
		}
	},
	doclose: function() {
		index.close();
		index.mask.close();
	},
	close: function() {
		if(index.show) {
			index.menu.setStyle({
				left: '-70%',
				transition: {
					duration: 150
				}
			});
			setTimeout(function() {
				index.menu.hide();
			}, 200);
			index.show = false;
		}
	},
	back: function() {
		if(index.show) {
			index.doclose();
			return false;
		} else {
			index.menu.close('none');
			return true;
		}
	}
}