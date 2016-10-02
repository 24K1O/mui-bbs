var listsub = {
	page: 1,
	size: 10,
	topicType: 0,
	topicTypeName: '帖子列表',
	template: '<li class="mui-table-view-cell" id="%{id}">' +
		'<div class="media">' +
		'<a class="pull-left" href="javascript:;">' +
		'<img class="media-object" src="%{headUrl}" alt="" width="48" height="48">' +
		'</a>' +
		'<div class="media-body">' +
		'<h4 class="media-heading">' +
		'%{nickname}' +
		'</h4>' +
		'<h6>%{createTime} <span class="mui-pull-right mui-badge mui-badge-primary mui-badge-inverted">评论（%{commentCount}）</span></h6>' +
		'<div>' +
		'%{content}' +
		'</div>' +
		'%{listImage}' +
		'</div>' +
		'</div>' +
		'</li>',
	start: function() {
		listsub.before();
		mui.init({
			pullRefresh: {
				container: '#container',
				down: {
					contentdown: "下拉刷新",
					contentover: "释放立即刷新",
					contentrefresh: "正在刷新...",
					callback: listsub.pullDownRefresh
				},
				up: {
					contentdown: '',
					contentrefresh: "正在加载...",
					contentnomore: '加载完毕',
					callback: listsub.pullUpRefresh
				}
			}
		});
		listsub.after();
	},
	before: function() {
		window.addEventListener('refresh', function(e) {
			listsub.pullDownRefresh();
		});
	},
	after: function() {
		listsub.pReady();
	},
	pReady: function() {
		mui.plusReady(function() {
			var self = plus.webview.currentWebview();
			listsub.topicType = self._id;
			listsub.topicTypeName = self._name;
			listsub.page = 1;
			listsub.size = Constant.defaultPageSize;
			listsub.load();
		});
	},
	pullDownRefresh: function() {
		mui('#container').pullRefresh().refresh(true);
		jq('#topicList').html('');
		listsub.page = 1;
		listsub.load(function(response) {
			mui('#container').pullRefresh().endPulldownToRefresh();
		});
	},
	pullUpRefresh: function() {
		listsub.page = listsub.page + 1;
		var _this = this;
		listsub.load(function(response) {
			if(response.length < listsub.size)
				_this.endPullupToRefresh(true);
			else
				_this.endPullupToRefresh(false);
		});
	},
	load: function(callback) {
		Ajax.post(Ajax.url.topicList, {
			page: listsub.page,
			typeId: listsub.topicType
		}, function(response) {
			var imageEl = '<div class="mui-table-view-cell mui-media mui-col-sm-3" id="%{id}"><img src="%{image}" width=60 height=60></div>';
			var listImageEl = '<div class="mui-table-view mui-grid-view">%{images}</div>';
			var html = '';
			var imagesHtml = '';
			var listImageHtml = '';
			for(var i in response) {
				imagesHtml = '';
				listImageHtml = '';
				for(var j in response[i].listImageUrl) {
					imagesHtml += imageEl
						.replace('%{id}', response[i].id)
						.replace('%{image}', Constant.hostname + response[i].listImageUrl[j]);
				}
				if(response[i].listImageUrl.length !=0) {
					listImageHtml = listImageEl.replace('%{images}', imagesHtml);
				}
				html += listsub.template.replace('%{id}', response[i].id)
					.replace('%{createTime}', moment(new Date(response[i].createTime).format('yyyy-MM-dd HH:mm'), 'YYYY-MM-DD HH:mm').fromNow())
					.replace('%{headUrl}', Constant.hostname + response[i].clientHeadUrl)
					.replace('%{nickname}', response[i].clientNickName)
					.replace('%{content}', response[i].content)
					.replace('%{commentCount}', response[i].commentCount)
					.replace('%{listImage}', listImageHtml);
			}
			jq('#topicList').append(html);
			listsub.addItemListener();
			if(callback != undefined) callback(response);
		});
	},
	addItemListener: function() {
		mui(".mui-table-view").off('tap', '.mui-table-view-cell');
		mui(".mui-table-view").on('tap', '.mui-table-view-cell', function() {
			var id = this.getAttribute('id');
			mui.openWindow({
				id: 'detailmain.html',
				url: 'detailmain.html',
				extras: {
					_id: id
				}
			});
		});
	}
}