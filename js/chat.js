var chat = {
	data: null,
	usertemplate: '<div class="msg-item">' +
		'<span class="nickname">%{nickname}</span>' +
		'<img class="msg-user-img" src="%{headUrl}" />' +
		'<div class="msg-content">' +
		'<div class="msg-content-inner">%{content}</div>' +
		'<div class="msg-content-arrow"></div>' +
		'</div>' +
		'<div class="mui-item-clear"></div>' +
		'</div>',
	selftemplate: '<div class="msg-item msg-item-self">' +
		'<img class="msg-self-img" src="%{headUrl}" atl="%{nickname}"/>' +
		'<div class="msg-content">' +
		'<div class="msg-content-inner">%{content}</div>' +
		'<div class="msg-content-arrow"></div>' +
		'</div>' +
		'<div class="mui-item-clear"></div>' +
		'</div>',
	id: 0,
	headUrl: '',
	nickname: '',
	start: function() {
		mui.init();
		chat.data = new Wilddog('https://yourserverurl/chat');
		chat.data.on('child_added', chat.receive);
		chat.after();
	},
	after: function() {
		document.getElementById('btnSend').addEventListener('tap', chat.send);
		chat.id = localStorage.getItem(Constant.keys.CLIENT_ID);
		chat.headUrl = localStorage.getItem(Constant.keys.CLIENT_HEADURL);
		chat.nickname = localStorage.getItem(Constant.keys.CLIENT_NICKNAME);
		//mui.back = function() {}
	},
	send: function() {
		mui.plusReady(function() {
			var value = document.getElementById('content').value;
			if(Ajax.isEmpty(value)) return;
			var node = new Date().getTime();
			var time = new Date().format('yyyy-MM-dd HH:mm');
			chat.data.child(node).set({
				"id": chat.id,
				"nickname": chat.nickname,
				"content": value,
				"time": time,
				"headUrl": chat.headUrl
			}, function(error) {
				if(error == null) {
					document.getElementById('content').value = '';
				} else {
					plus.nativeUI.toast('发送失败');
				}
			});
		});
	},
	receive: function(response) {
		var data = response.val();
		if(chat.id == data.id) {
			var html = chat.selftemplate.replace('%{headUrl}', Constant.hostname + data.headUrl)
				.replace('%{nickname}', data.nickname)
				.replace('%{content}', data.content);
			jq('#messageList').append(html);
		} else {
			var html = chat.usertemplate.replace('%{nickname}', data.nickname)
				.replace('%{headUrl}', Constant.hostname + data.headUrl)
				.replace('%{content}', data.content);
			jq('#messageList').append(html);
		}

	}
}