var messagesub = {
	page: 1,
	size: 10,
	template: '<li class="mui-table-view-cell" id="%{id}" title="%{title}" disabled="%{isSystem}">' +
		'<span class="mui-ellipsis-2">%{content}</span>' +
		'<h6 class="mui-pull-right">%{time}</h6>' +
		'</li>',
	start: function() {
		mui.init({
			pullRefresh: {
				container: '#container',
				down: {
					contentdown: "下拉刷新",
					contentover: "释放立即刷新",
					contentrefresh: "正在刷新...",
					callback: messagesub.pullDownRefresh
				},
				up: {
					contentdown: '',
					contentrefresh: "正在加载...",
					contentnomore: '加载完毕',
					callback: messagesub.pullUpRefresh
				}
			}
		});
		messagesub.after();
	},
	after: function() {
		messagesub.pReady();
	},
	pReady: function() {
		mui.plusReady(function() {
			messagesub.page = 1;
			messagesub.size = Constant.defaultPageSize;
			messagesub.load();
		});
	},
	pullDownRefresh: function() {
		mui('#container').pullRefresh().refresh(true);
		jq('#messageList').html('');
		messagesub.page = 1;
		messagesub.load(function(response) {
			mui('#container').pullRefresh().endPulldownToRefresh();
		});
	},
	pullUpRefresh: function() {
		messagesub.page = messagesub.page + 1;
		var _this = this;
		messagesub.load(function(response) {
			if(response.length < messagesub.size)
				_this.endPullupToRefresh(true);
			else
				_this.endPullupToRefresh(false);
		}); 
	},
	load: function(callback) {
		Ajax.post(Ajax.url.messageList, {
			page: messagesub.page,
			receiveId: localStorage.getItem(Constant.keys.CLIENT_ID)
		}, function(response) {
			var html = '';
			for(var i in response) {
				html += messagesub.template.replace('%{id}', response[i].id)
					.replace('%{time}', moment(new Date(response[i].createTime).format('yyyy-MM-dd HH:mm'), 'YYYY-MM-DD HH:mm').fromNow())
					.replace('%{title}', response[i].topicId)
					.replace('%{isSystem}', response[i].type == 0)
					.replace('%{content}', messagesub.getContent(response[i]));
			}
			jq('#messageList').append(html);
			messagesub.addItemListener();
			if(callback != undefined) callback(response);
		});
	},
	addItemListener: function() {
		mui(".mui-table-view").off('tap', '.mui-table-view-cell');
		mui(".mui-table-view").on('tap', '.mui-table-view-cell', function() {
			var id = this.getAttribute('id');
			var isSystem = this.getAttribute('disabled');
			var topicId = this.getAttribute('title');
			if(isSystem == true || isSystem == 'true') {
				mui.openWindow({
					id: 'messagedetail.html.html',
					url: 'messagedetail.html',
					extras: {
						_id: id
					}
				});
			} else {
				mui.openWindow({
					id: 'detailmain.html',
					url: 'detailmain.html',
					extras: {
						_id: topicId
					}
				});
			}
		});
	},
	getContent: function(data) {
		if(data.type == 0) {
			return '<span style="color:blue">系统消息</span> : ' + data.content;
		} else if(data.type == 1) {
			return '<span style="color:blue">' + data.clientNickName + '</span> 评论了你的帖子 : ' + data.content;
		} else if(data.type == 2) {
			return '<span style="color:blue">' + data.clientNickName + '</span> 回复了你的评论 : ' + data.content;
		} else {
			return data.content;
		}
	}
}