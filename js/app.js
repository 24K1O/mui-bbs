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
		CLIENT_SCORE: 'clientscore',
		CLIENT_ADMIN: 'clientadmin',
		CLIENT_TOKEN: 'clienttoken'
	},
	regex: {
		email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
	},
	init: function() {},
	convertToBase64: function(img, w, h) {
		var canvas = document.createElement("canvas");
		var width = img.width;
		var height = img.height;
		if(width > height) {
			if(width > w) {
				height = Math.round(height *= w / width);
				width = w;
			}
		} else {
			if(height > h) {
				width = Math.round(width *= h / height);
				height = h;
			}
		}
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, width, height);
		var dataURL = canvas.toDataURL("image/png", 0.8);
		if(dataURL.indexOf('data:image/png;base64,') == -1) return '';
		return dataURL.replace("data:image/png;base64,", "");
	}
}

var Ajax = {
	url: { 
		version: Constant.hostname + '/version/app/version.json',

		clientLogin: Constant.hostname + '/pub/client/app/login',
		clientRegister: Constant.hostname + '/pub/client/app/register',
		clientSignin: Constant.hostname + '/pub/client/app/signin',
		clientModifyNickname: Constant.hostname + '/pub/client/app/modifynickname',
		clientModifyHeadUrl: Constant.hostname + '/pub/client/app/modifyheadurl',
		clientModifyPassword: Constant.hostname + '/pub/client/app/modifypassword',
		clientToken: Constant.hostname + '/pub/client/app/token',

		topicTypeList: Constant.hostname + '/bbs/topictype/app/list',

		topicEdit: Constant.hostname + '/bbs/topic/app/edit',
		topicList: Constant.hostname + '/bbs/topic/app/listByTopicType',
		topic: Constant.hostname + '/bbs/topic/app/topic',

		commentEdit: Constant.hostname + '/bbs/comment/app/edit',
		commentList: Constant.hostname + '/bbs/comment/app/listByTopic',

		feedbackEdit: Constant.hostname + '/pub/feedback/app/edit',

		messageList: Constant.hostname + '/bbs/message/app/list',
		message: Constant.hostname + '/bbs/message/app/message',
		messageNotRead: Constant.hostname + '/bbs/message/app/notread',
		messageRead: Constant.hostname + '/bbs/message/app/read'
	},
	timeout: 20000,
	ajax: function(action, type, data, successCallback, errorCallback, dataType, handleMessage) {
		var errorCallback = errorCallback || function(xhr, type, errorThrown) {
			mui.plusReady(function() {
				plus.nativeUI.closeWaiting();
				plus.nativeUI.toast(type);
				Ajax.activeGreyBtn();
			});
		}
		Ajax.disabledPrimaryBtn();
		mui.plusReady(function() {
			data.uuid = plus.device.uuid;
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
						plus.nativeUI.closeWaiting();
						plus.nativeUI.toast(response.message);
					}
					Ajax.activeGreyBtn();
				},
				error: errorCallback,
				timeout: Ajax.timeout
			});
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
	disabledPrimaryBtn: function() {
		var btn = mui('.ajax-waiting')[0];
		if(btn == undefined) return;
		btn.setAttribute('disabled', 'disabled');
		btn.classList.remove('mui-btn-primary');
		btn.classList.add('mui-btn-grey');
	},
	activeGreyBtn: function() {
		var btn = mui('.ajax-waiting')[0];
		if(btn == undefined) return;
		btn.removeAttribute('disabled');
		btn.classList.remove('mui-btn-grey');
		btn.classList.add('mui-btn-primary');
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