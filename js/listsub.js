var listsub = {
	page: 1,
	size: 10,
	topicTypeKey: 'TOPIC_TYPE_ID',
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
//		'<div class="mui-table-view mui-grid-view">' +
//		'%{images}' +
//		'</div>' +
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
	before: function() {},
	after: function() {
		listsub.pReady();
		listsub.page = 1;
		listsub.size = Constant.defaultPageSize;
		listsub.load();
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
			if(response.length <= listsub.size)
				_this.endPullupToRefresh(true);
			else
				_this.endPullupToRefresh(false);
		});
	},
	pReady: function() {
		mui.plusReady(function() {});
	},
	load: function(callback) {
		console.info('load' + localStorage.getItem(listsub.topicTypeKey))
		Ajax.post(Ajax.url.topicList, {
			page: listsub.page,
			typeId: localStorage.getItem(listsub.topicTypeKey)
		}, function(response) {
			var imageEl = '<div class="mui-table-view-cell mui-media mui-col-sm-3" id="%{id}"><img src="%{image}" width=60 height=60></div>';
			var html = '';
			var imagesHtml = '';
			for(var i in response) {
				imagesHtml = '';
				for(var j in response[i].listImageUrl) {
					imagesHtml += imageEl
						.replace('%{id}', response[i].id)
						.replace('%{image}', Constant.hostname + response[i].listImageUrl[j]);
				}
				html += listsub.template.replace('%{id}', response[i].id)
					.replace('%{createTime}', moment(new Date(response[i].createTime).format('yyyy-MM-dd HH:mm'), 'YYYY-MM-DD HH:mm').fromNow())
					.replace('%{headUrl}', Constant.hostname + response[i].clientHeadUrl)
					.replace('%{nickname}', response[i].clientNickName)
					.replace('%{content}', response[i].content)
					.replace('%{commentCount}', response[i].commentCount)
//					.replace('%{images}', imagesHtml);
			}
			console.info(html);
			jq('#topicList').append(html);
			console.info('after');
			listsub.addItemListener();
			if(callback != undefined) callback(response);
		});
	},
	addItemListener: function() {
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