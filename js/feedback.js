var feedback = {
	start: function() {
		mui.init();
		feedback.after();
	},
	after: function() {
		document.getElementById('btnSubmit').addEventListener('tap', feedback.feedback);
	},
	feedback: function() {
		mui.plusReady(function() {
			var content = document.getElementById('content').value;
			if(Ajax.isEmpty(content)) {
				plus.nativeUI.toast('反馈内容不能为空');
				return;
			}
			Ajax.post(Ajax.url.feedbackEdit, {
				oper: 'add',
				content: content,
				"parentClient.id": localStorage.getItem(Constant.keys.CLIENT_ID)
			}, function(response) {
				plus.nativeUI.toast('感谢您的反馈');
				mui.later(function() {
					plus.webview.currentWebview().close();
				}, 2000);
			});
		});
	}
}