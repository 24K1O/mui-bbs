var index = {
	main: null,
	menu: null,
	mask: null,
	show: false,
	template: '<li class="mui-table-view-cell mui-media" id="%{id}" title="%{title}" disabled="%{disabled}">' +
		'<a href="javascript:;">' +
		'<img class="mui-media-object mui-pull-left" src="%{icon}">' +
		'<div class="mui-media-body">' +
		'%{name}' +
		'<p class="mui-ellipsis">%{remark}</p>' +
		'</div>' +
		'</a>' +
		'</li>',
	start: function() {
		index.before();
		mui.init({
			swipeBack: false,
			beforeback: index.back
		});
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005
		});
		index.after();
	},
	before: function() {
		index.mask = mui.createMask(index.close);
	},
	after: function() {
		index.pReady();
		index.load();
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
	},
	load: function() {
		Ajax.post(Ajax.url.topicTypeList, {}, function(data) {
			var html = '';
			for(var i in data) {
				html += index.template.replace('%{id}', data[i].id)
					.replace('%{title}', data[i].name)
					.replace('%{disabled}', data[i].forbidInClient)
					.replace('%{icon}', Constant.hostname + data[i].icon)
					.replace('%{name}', data[i].name)
					.replace('%{remark}', data[i].remark);
			}
			document.getElementById('topicTypeList').innerHTML = html;
			mui('.mui-table-view').on('tap', '.mui-table-view-cell', index.handle);
		});
	},
	handle: function() {
		var id = this.getAttribute('id');
		var name = this.getAttribute('title');
		var forbid = this.getAttribute('disabled');
		mui.openWindow({
			id: 'html/listmain.html',
			url: 'html/listmain.html',
			extras: {
				_id: id,
				_name: name,
				_forbid: forbid
			}
		});
	}
}