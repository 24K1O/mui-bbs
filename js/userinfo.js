var userinfo = {
	start: function() {
		mui.init();
		userinfo.after();
	},
	after: function() {
		document.getElementById('score').innerHTML = localStorage.getItem(Constant.keys.CLIENT_SCORE);
		document.getElementById('nickname').innerHTML = localStorage.getItem(Constant.keys.CLIENT_NICKNAME);
		document.getElementById('headUrl').setAttribute('src', Constant.hostname + localStorage.getItem(Constant.keys.CLIENT_HEADURL));
		document.getElementById('btnNickname').addEventListener('tap', userinfo.modifyNickname);
		document.getElementById('headUrl').addEventListener('tap', userinfo.modifyHeadUrl);
		document.getElementById('btnPassword').addEventListener('tap', function() {
			mui.openWindow('passwordmodify.html', 'passwordmodify.html');
		});
	},
	modifyHeadUrl: function() {
		if(mui.os.plus) {
			var a = [{
				title: "拍照"
			}, {
				title: "从手机相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "修改头像",
				cancel: "取消",
				buttons: a
			}, function(b) {
				switch(b.index) {
					case 0:
						break;
					case 1:
						userinfo.camera();
						break;
					case 2:
						userinfo.gallery();
						break;
					default:
						break
				}
			})
		}
	},
	modifyNickname: function() {
		mui.plusReady(function() {
			plus.nativeUI.prompt("新昵称 : ", function(e) {
				if(e.index == 1 && !Ajax.isEmpty(e.value)) {
					Ajax.post(Ajax.url.clientModifyNickname, {
						id: localStorage.getItem(Constant.keys.CLIENT_ID),
						nickname: e.value
					}, function(response) {
						if(!Ajax.isEmpty(response)) {
							localStorage.setItem(Constant.keys.CLIENT_NICKNAME, response);
							document.getElementById('nickname').innerHTML = localStorage.getItem(Constant.keys.CLIENT_NICKNAME);
							plus.nativeUI.toast('昵称更新成功');
							var menu = plus.webview.getWebviewById('menu.html');
							console.info(JSON.stringify(menu));
							mui.fire(menu, 'refresh');
						} else {
							plus.nativeUI.toast('昵称更新失败');
						}
					});
				}
			}, "昵称更新", "请输入您的新昵称（4-12个字符） ", ["取消", "更新"]);
		});
	},
	camera: function() {
		var c = plus.camera.getCamera();
		c.captureImage(function(file) {
			plus.io.resolveLocalFileSystemURL(file, function(entry) {
				var s = entry.toLocalURL();
				userinfo.upload(s);
			}, function(err) {
				console.log(err.message);
			});
		}, function(cancel) {}, {
			filename: "_doc/head.jpg"
		});
	},
	gallery: function() {
		plus.gallery.pick(function(a) {
			plus.io.resolveLocalFileSystemURL(a, function(entry) {
				plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
					root.getFile("head.jpg", {}, function(file) {
						file.remove(function() {
							entry.copyTo(root, 'head.jpg', function(e) {
									var path = e.fullPath;
									userinfo.upload(path);
								},
								function(e) {
									console.log(e.message);
								});
						}, function(e) {
							console.log(e.message);
						});
					}, function() {
						entry.copyTo(root, 'head.jpg', function(e) {
								var path = e.fullPath;
								userinfo.upload(path);
							},
							function(e) {
								console.log(e.message);
							});
					});
				}, function(e) {
					console.log(e.message);
				})
			}, function(e) {
				console.log(e.message);
			});
		}, function(a) {}, {
			filter: "image"
		})
	},
	upload: function(url) {
		mui.plusReady(function() {
			plus.nativeUI.showWaiting('正在上传头像');
			setTimeout(function() {
				if(!Ajax.isEmpty(url)) {
					var image = new Image()
					image.src = url;
					image.onload = function() {
						var data = Constant.convertToBase64(image, 200, 200);
						Ajax.post(Ajax.url.clientModifyHeadUrl, {
							id: localStorage.getItem(Constant.keys.CLIENT_ID),
							headUrl: data
						}, function(response) {
							if(!Ajax.isEmpty(response)) {
								plus.nativeUI.closeWaiting();
								localStorage.setItem(Constant.keys.CLIENT_HEADURL, response);
								document.getElementById('headUrl').setAttribute('src', Constant.hostname + localStorage.getItem(Constant.keys.CLIENT_HEADURL));
								plus.nativeUI.toast('头像上传成功');
								var menu = plus.webview.getWebviewById('menu.html');
								mui.fire(menu, 'refresh');
							}
						});
					}
				} else {
					plus.nativeUI.closeWaiting();
				}
			}, 2000);
		});
	}
}