var listsub = {
	page: 1,
	size: 10,
	start: function() {
		listsub.before();
		mui.init({
			pullRefresh: {
				container: '#container',
				down: {
					callback: listsub.pullDownRefresh
				},
				up: {
					contentrefresh: '正在加载...',
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
	},
	pullDownRefresh: function() {

	},
	pullUpRefresh: function() {

	},
	pReady: function() {
		mui.plusReady(function() {});
	} 
}