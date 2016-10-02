var version = {
	server: '',
	localDir: 'version',
	localFile: 'version.json',
	auto: true,
	start: function() {
		version.server = Ajax.url.version;
		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
			fs.root.getDirectory(version.localDir, {
				create: true
			}, function(entry) {
				version.dir = entry;
				version.check();
			}, function(e) {
				console.log(e.message);
			});
		}, function(e) {
			console.log(e.message);
		});
	},
	check: function() {
		var lastcheck = plus.storage.getItem(version.keyUpdate);
		if(lastcheck) {
			var dc = parseInt(lastcheck);
			var dn = (new Date()).getTime();
			if(dn - dc < version.checkInterval) {
				return;
			}
			plus.storage.removeItem(version.keyUpdate);
		}
		version.dir.getFile(version.localFile, {
			create: false
		}, function(fentry) {
			fentry.file(function(file) {
				var reader = new plus.io.FileReader();
				reader.onloadend = function(e) {
					fentry.remove();
					var data = null;
					try {
						data = JSON.parse(e.target.result);
					} catch(e) {
						return;
					}
					version.checkData(data);
				}
				reader.readAsText(file);
			}, function(e) {
				fentry.remove();
			});
		}, function(e) {
			version.getJson();
		});
	},
	getJson: function() {
		var xhr = new plus.net.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			switch(xhr.readyState) {
				case 4:
					if(xhr.status == 200) {
						version.dir.getFile(version.localFile, {
							create: true
						}, function(fentry) {
							fentry.createWriter(function(writer) {
								writer.onerror = function() {}
								writer.write(xhr.responseText);
							}, function(e) {});
						}, function(e) {});
					} else {}
					break;
				default:
					break;
			}
		}
		xhr.open("GET", version.server);
		xhr.send();
	},
	checkData: function(j) {
		var curVer = plus.runtime.version;
		inf = j[plus.os.name];
		if(inf) {
			var srvVer = inf.version;
			var vabort = plus.storage.getItem(version.keyAbort);
			if(vabort && srvVer == vabort) {
				return;
			}
			if(version.compareVersion(curVer, srvVer)) {
				plus.nativeUI.confirm(inf.note, function(i) {
					if(1 == i.index) {
						plus.runtime.openURL(inf.url);
					}
					/* else if(2 == i.index) {
											plus.storage.setItem(keyAbort, srvVer);
											plus.storage.setItem(keyUpdate, (new Date()).getTime().toString());
										}*/
					else {
						plus.storage.setItem(version.keyUpdate, (new Date()).getTime().toString());
					}
				}, inf.title, ["取　　消", "立即更新" /* ,"跳过此版本" */ ]);
			}
		}
	},
	compareVersion: function(ov, nv) {
		var cv = plus.runtime.version;
		var info = '当前版本已经是最新版本（' + cv + '）';
		if(!ov || !nv || ov == "" || nv == "") {
			if(!version.auto) {
				plus.nativeUI.alert(info, function() {}, '提示', '确定');
			}
			return false;
		}
		var b = false,
			ova = ov.split(".", 4),
			nva = nv.split(".", 4);
		for(var i = 0; i < ova.length && i < nva.length; i++) {
			var so = ova[i],
				no = parseInt(so),
				sn = nva[i],
				nn = parseInt(sn);
			if(nn > no || sn.length > so.length) {
				return true;
			} else if(nn < no) {
				if(!version.auto) {
					plus.nativeUI.alert(info, function() {}, '提示', '确定');
				}
				return false;
			}
		}
		if(nva.length > ova.length && 0 == nv.indexOf(ov)) {
			return true;
		}
	}
}