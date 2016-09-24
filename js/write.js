var write = {
	files: [],
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

			/*document.getElementById('btnAdd').addEventListener('tap', function() {
				if(write.fileCount < 3) {
					plus.gallery.pick(function(imagepath) {
						write.add(imagepath);
					});
				} else {
					plus.nativeUI.toast('最多可添加3张图片');
				}
			});*/
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
		write.files.push(imagepath);
	},
	upload: function() {
		mui.plusReady(function() {
			plus.nativeUI.showWaiting();
			if(write.files.length > 0) {
				for(var i in write.files) {
					var data = Constant.convertToBase64JPG(write.files[i], 200, 200, 1);
					write.images.push(data);
				}
				plus.nativeUI.closeWaiting();
			} else {
				plus.nativeUI.closeWaiting();
			}
		});
	},
	publish: function() {
		write.upload();
		var content = document.getElementById('content').value;
		var base64Image = '';
		for(var i in write.images) {
			base64Image += write.images[i] + ',';
		}
		base64Image = base64Image.substring(0, base64Image.length - 1);
		var self = plus.webview.currentWebview();
		var client = localStorage.getItem(Constant.keys.CLIENT_ID);
		client = 1; // TODO
		console.info(self._id);
		Ajax.post(Ajax.url.topicEdit, {
			oper: 'add',
			"parentClient.id": client,
			"parentTopicType.id": self._id,
			content: content,
			base64Image: base64Image
		}, function(response) {
			mui.openWindow({
				id: 'listmain.html',
				url: 'listmain.html',
				extras: {
					_id: self._id,
					_name: self._name
				}
			});
		});
	}
}