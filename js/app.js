var Constant = {
	hostname: 'http://192.168.0.102',
	defaultPageSize: 10,
	keys: {
		GLOBAL_ID: 'globalid',
		CLIENT_ID: 'clientid',
		CLIENT_EMAIL: 'clientemail',
		CLIENT_NICKNAME: 'clientnickname',
		CLIENT_HEADURL: 'clientheadurl',
		CLIENT_SIGNINDATE: 'clientsignindate',
		CLIENT_SCORE: 'clientscore'
	},
	regex: {
		email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
	},
	init: function() {},
	convertToBase64JPG: function(_image, _width, _height, _per) {
		return Constant.convertToBase64(_image, 'image/jpg', _width, _height, _per);
	},
	convertToBase64PNG: function(_image, _width, _height, _per) {
		return Constant.convertToBase64(_image, 'image/png', _width, _height, _per);
	},
	convertToBase64: function(_image, _media, _width, _height, _per) {
		var image = new Image();
		image.src = _image;
		var canvas = document.createElement("canvas");
		var width = image.width;
		var height = image.height;
		if(width > height) {
			if(width > _width) {
				height = Math.round(height *= _width / width);
				width = _width;
			}
		} else {
			if(height > _height) {
				width = Math.round(width *= _height / height);
				height = _height;
			}
		}
		canvas.width = width;
		canvas.height = height;
		var context = canvas.getContext("2d");
		context.drawImage(image, 0, 0, width, height);
		var dataURL = canvas.toDataURL(_media, _per);
		if(dataURL.trim() == 'data:,') return '';
		return dataURL.replace("data:image/png;base64,", "");
	}
}

var Ajax = {
	url: {
		version: Constant.hostname + '/version/update.json',
		upload: Constant.hostname + '/upload',

		clientLogin: Constant.hostname + '/pub/client/app/login',
		clientRegister: Constant.hostname + '/pub/client/app/register',
		clientSignin: Constant.hostname + '/pub/client/app/signin',
		clientModifyNickname: Constant.hostname + '/pub/client/app/modifynickname',
		clientModifyHeadUrl: Constant.hostname + '/pub/client/app/modifyheadurl',

		topicTypeList: Constant.hostname + '/bbs/topictype/app/list',

		topicEdit: Constant.hostname + '/bbs/topic/app/edit',
		topicList: Constant.hostname + '/bbs/topic/app/listByTopicType',
		topic: Constant.hostname + '/bbs/topic/app/topic',

		commentEdit: Constant.hostname + '/bbs/comment/app/edit',
		commentList: Constant.hostname + '/bbs/comment/app/listByTopic',

		feedbackEdit: Constant.hostname + '/pub/feedback/app/edit',

		messageList: Constant.hostname + '/bbs/message/app/list',
		message: Constant.hostname + '/bbs/message/app/message'
	},
	timeout: 20000,
	ajax: function(action, type, data, successCallback, errorCallback, dataType, handleMessage) {
		var errorCallback = errorCallback || function(xhr, type, errorThrown) {
			mui.plusReady(function() {
				plus.nativeUI.closeWaiting();
				plus.nativeUI.toast(type);
				console.info(JSON.stringify(xhr));
				console.info(errorThrown);
			});
		}
		mui.ajax(action, {
			type: type,
			data: data,
			dataType: dataType,
			success: function(response) {
				if(response.success) {
					successCallback(response.data);
				} else if(handleMessage) {
					handleMessage(response.message);
				} else {
					mui.plusReady(function() {
						plus.nativeUI.closeWaiting();
						plus.nativeUI.toast(response.message);
					});
				}
			},
			error: errorCallback,
			timeout: Ajax.timeout
		});
	},
	post: function(action, data, successCallback) {
		Ajax.ajax(action, 'POST', data, successCallback, mui.noop(), 'json');
	},
	get: function(action, data, successCallback) {
		Ajax.ajax(action, 'GET', data, successCallback, mui.noop(), 'json');
	},
	isEmpty: function(obj) {
		return obj == null || obj == '' ||
			obj == 'null' || obj == undefined || obj == 'undefined';
	},
	emptyResult: function(id) {
		document.getElementById(id).innerHTML = '<h4 class="mui-text-center" style="padding: 15px 0">暂时没有数据</h4>';
	}
}

Date.prototype.format = function(fmt) {
	var obj = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"H+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in obj) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
				(obj[k]) :
				(("00" + obj[k]).substr(("" + obj[k]).length)));
		}
	}
	return fmt;
}