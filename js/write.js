var write = {
	images: [],
	fileCount: 0,
	start: function() {
		write.before();
		mui.init();
		write.after();
	},
	before: function() {},
	after: function() {
		write.pReady();
	},
	pReady: function() {
		mui.plusReady(function() {
			plus.screen.lockOrientation("portrait-primary");
			document.getElementById('btnAdd').addEventListener('tap', function() {
				if(write.fileCount < 3) {
					plus.gallery.pick(function(imagepath) {
						write.add(imagepath);
					});
				} else {
					plus.nativeUI.toast('最多可添加3张图片');
				}
			});
			document.getElementById('btnPublish').addEventListener('tap', write.publish);
		});
	},
	add: function(imagepath) {
		var imageListEl = document.getElementById('imageList');
		var imageEl = document.createElement('img');
		imageEl.width = 60;
		imageEl.height = 60;
		imageEl.src = imagepath;
		imageEl.className = 'image';
		imageListEl.appendChild(imageEl);
		write.fileCount++;
		write.upload(imagepath);
	},
	upload: function(imagepath) {
		mui.plusReady(function() {
			if(!Ajax.isEmpty(imagepath)) {
				var image = new Image(); 
		        image.src = imagepath; 
		        image.onload = function() { 
		           var data = Constant.convertToBase64(image, 200, 200);
		           write.images.push(data);
		        } 
			}
		});
	},
	publish: function() {
		var content = document.getElementById('content').value;
		if(Ajax.isEmpty(content)) {
			plus.nativeUI.toast('内容不能为空');
			return;
		}
		var base64Image = '';
		for(var i in write.images) {
			base64Image += write.images[i] + ',';
		}
		base64Image = base64Image.substring(0, base64Image.length - 1);
		var client = localStorage.getItem(Constant.keys.CLIENT_ID);
		var self = plus.webview.currentWebview();
		Ajax.post(Ajax.url.topicEdit, {
			oper: 'add',
			"parentClient.id": client,
			"parentTopicType.id": self._id,
			content: content,
			base64Image: base64Image
		}, function(response) {
			var list = plus.webview.getWebviewById('listsub.html');
			mui.fire(list, 'refresh');
			plus.webview.currentWebview().close();
		});
	}
}