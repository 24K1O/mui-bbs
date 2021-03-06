var detailsub = {
	page: 1,
	size: 10,
	topic: 0,
	topicTemplate: '<div class="media">' +
		'<a class="pull-left" href="javascript:;">' +
		'<img class="media-object" src="%{headUrl}" alt="" width="50" height="50">' +
		'</a>' +
		'<div class="media-body">' +
		'<h4 class="media-heading">' +
		'%{nickname}' +
		'</h4>' +
		'<h6>%{createTime}</h6>' +
		'<div>' +
		'%{content}' +
		'</div>' +
		'%{listImage}' +
		'<div class="mui-clearfix"></div>' +
		'<div class="mui-pull-right">' +
		'<h6 class="mui-badge mui-badge-primary mui-badge-inverted">评论（<span id="commentCount">%{commentCount}</span>）</h6>' +
		'</div>' +
		'</div>' +
		'</div>',
	commentTemplate: '<li class="mui-table-view-cell">' +
		'<div class="media">' +
		'<a class="pull-left" href="javascript:;">' +
		'<img class="media-object" src="%{headUrl}" width="35" height="35">' +
		'</a>' +
		'<div class="media-body">' +
		'<h5 class="media-heading">%{nickname}</h5>' +
		'<h6>%{createTime}</h6>' +
		'<div>%{content}</div>' +
		'<div class="mui-clearfix"></div>' +
		'<div class="mui-pull-right">' +
		'<h6 class="mui-badge mui-badge-primary mui-badge-inverted">' +
		'<span class="mui-icon mui-icon-chatboxes" id="%{id}" title="%{nickname}"></span>' +
		'</h6>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</li>',
	start: function() {
		detailsub.before();
		mui.init({
			pullRefresh: {
				container: '#container',
				up: {
					contentdown: '',
					contentrefresh: "正在加载...",
					contentnomore: '加载完毕',
					callback: detailsub.pullUpRefresh
				}
			}
		});
		detailsub.after();
	},
	before: function() {},
	after: function() {
		detailsub.pReady();
		document.getElementById('btnSend').addEventListener('tap', function() {
			detailsub.comment();
		});
		document.getElementById('btnCancel').addEventListener('tap', function() {
			detailsub.hideEdit();
		});
	},
	pullUpRefresh: function() {
		detailsub.page = detailsub.page + 1;
		var _this = this;
		detailsub.loadComment(function(response) {
			if(response.length < detailsub.size)
				_this.endPullupToRefresh(true);
			else
				_this.endPullupToRefresh(false);
		});
	},
	pReady: function() {
		mui.plusReady(function() {
			detailsub.page = 1;
			detailsub.size = Constant.defaultPageSize;
			var self = plus.webview.currentWebview();
			detailsub.topic = self._id;
			detailsub.load();
		}); 
	},
	load: function() {
		Ajax.post(Ajax.url.topic, {
			id: detailsub.topic
		}, function(response) {
			var imageEl = '<div class="mui-table-view-cell mui-media mui-col-sm-3"><img src="%{image}" width=60 height=60></div>';
			var listImageEl = '<div class="mui-table-view mui-grid-view">%{images}</div>';
			var html = '';
			var imagesHtml = '';
			var listImageHtml = '';
			for(var j in response.listImageUrl) {
				imagesHtml += imageEl.replace('%{image}', Constant.hostname + response.listImageUrl[j]);
			}
			if(response.listImageUrl.length !=0) {
				listImageHtml = listImageEl.replace('%{images}', imagesHtml);
			}
			html += detailsub.topicTemplate
				.replace('%{createTime}', moment(new Date(response.createTime).format('yyyy-MM-dd HH:mm'), 'YYYY-MM-DD HH:mm').fromNow())
				.replace('%{headUrl}', Constant.hostname + response.clientHeadUrl)
				.replace('%{nickname}', response.clientNickName)
				.replace('%{content}', response.content)
				.replace('%{commentCount}', response.commentCount)
				.replace('%{listImage}', listImageHtml);
			document.getElementById('topic').innerHTML = html;
			detailsub.loadComment();
			document.querySelector('.comment-label').classList.remove('mui-hidden');
			document.getElementById('topic').addEventListener('tap', function() {
				detailsub.showEdit();
				detailsub.setTextareaAttribute('', '写评论');
			});
		});
	},
	loadComment: function(callback) {
		var contentEL = '%{content}';
		var replyContentEL = '回复<span style="color: blue;"> %{replyClientNickname} </span> : %{content}';
		Ajax.post(Ajax.url.commentList, {
			topicId: detailsub.topic,
			page: detailsub.page
		}, function(response) {
			var html = '';
			var contentHtml = '';
			for(var i in response) {
				if(Ajax.isEmpty(response[i].replyClientId)) {
					contentHtml = contentEL.replace('%{content}', response[i].content);
				} else {
					contentHtml = replyContentEL.replace('%{content}', response[i].content)
						.replace('%{replyClientNickname}', response[i].replyClientNickname);
				}
				html += detailsub.commentTemplate
					.replace('%{headUrl}', Constant.hostname + response[i].commentClientHeadUrl)
					.replace('%{nickname}', response[i].commentClientNickname)
					.replace('%{createTime}', moment(new Date(response[i].createTime).format('yyyy-MM-dd HH:mm'), 'YYYY-MM-DD HH:mm').fromNow())
					.replace('%{content}', contentHtml)
					.replace('%{id}', response[i].commentClientId)
					.replace('%{nickname}', response[i].commentClientNickname);
			}
			jq('#commentList').append(html);
			detailsub.addReplyListener();
			if(callback != undefined) callback(response);
		});
	}, 
	comment: function() {
		var contentEl = document.getElementById('content');
		var content = contentEl.value;
		if(Ajax.isEmpty(content)) {
			plus.nativeUI.toast('评论 / 回复 不能为空');
			return;
		}
		var author = contentEl.getAttribute('title');
		var commentUser = localStorage.getItem(Constant.keys.CLIENT_ID);
		Ajax.post(Ajax.url.commentEdit, {
			oper: 'add',
			content: content,
			"parentTopic.id": detailsub.topic,
			"parentCommentClient.id": commentUser,
			"parentReplyClient.id": author
		}, function(response) {
			detailsub.hideEdit();
			document.getElementById('commentList').innerHTML = '';
			detailsub.page = 1;
			detailsub.loadComment();
			var commentCountEl = document.getElementById('commentCount');
			commentCountEl.innerHTML = parseInt(commentCountEl.innerHTML, 10) + 1;
		});
	},
	showEdit: function() {
		document.getElementById('footer').classList.remove('mui-hidden');
	},
	hideEdit: function() {
		document.getElementById('footer').classList.add('mui-hidden');
		document.getElementById('content').value = '';
	},
	setTextareaAttribute: function(title, tip) {
		document.getElementById('content').setAttribute('title', title);
		document.getElementById('content').setAttribute('placeholder', tip);
	},
	addReplyListener: function() { 
		mui("#commentList").off('tap', '.mui-icon-chatboxes');
		mui("#commentList").on('tap', '.mui-icon-chatboxes', function() {
			var author = this.getAttribute('id');
			var commentUser = localStorage.getItem(Constant.keys.CLIENT_ID);
			if(author == commentUser) {
				plus.nativeUI.toast('不能回复自己的评论');
				return;
			}
			var nickname = this.getAttribute('title');
			detailsub.setTextareaAttribute(author, '回复' + nickname);
			detailsub.showEdit();
		});
	}
}