/*
	Proxy Plug-in
	
	Features:
		Times an upload to see if it appear suspiciously fast which might indicate a proxy server or anti-virus suite intercepting the upload. 
		If the upload seems too fast an uploadError event is fired with PROXY error code after the final uploadProgress event.
		
		Adds a SWFUpload setting allowing you to tweak the bytes/s for triggering the error:
			proxy_detect_threshold : 256000
			
		Adds an UPLOAD_ERROR entry called PROXY:
			function uploadError(file, errorCode, message) {
				if (errorCode === SWFUpload.UPLOAD_ERROR.PROXY) {
					alert("You might have a proxy!");
				}
			}
	*/

var SWFUpload;
if (typeof(SWFUpload) === "function") {
	SWFUpload.proxyDetect = {};
	SWFUpload.UPLOAD_ERROR.PROXY = -30300;
	
	SWFUpload.prototype.initSettings = (function (oldInitSettings) {
		return function (userSettings) {
			if (typeof(oldInitSettings) === "function") {
				oldInitSettings.call(this, userSettings);
			}
			
			this.ensureDefault = function (settingName, defaultValue) {
				this.settings[settingName] = (userSettings[settingName] == undefined) ? defaultValue : userSettings[settingName];
			};

			// List used to keep the speed stats for the files we are tracking
			this.proxyDetectFileStartTimes = {};
			this.proxyDetectSettings = {};

			this.ensureDefault("proxy_detect_threshold", 256000); // Default is 250 KB per second
			
			this.proxyDetectSettings.user_upload_progress_handler = this.settings.upload_progress_handler;
			this.proxyDetectSettings.user_upload_complete_handler = this.settings.upload_complete_handler;
			
			this.settings.upload_progress_handler = SWFUpload.proxyDetect.uploadProgressHandler;
			this.settings.upload_complete_handler = SWFUpload.proxyDetect.uploadCompleteHandler;
			
			
			delete this.ensureDefault;
		};
	}(SWFUpload.prototype.initSettings));

	SWFUpload.proxyDetect.uploadProgressHandler = function (file, bytesComplete, bytesTotal) {
		var ex1 = null, time, differenceMS, bps;
		try {
			if (typeof this.proxyDetectSettings.user_upload_progress_handler === "function") {
				this.proxyDetectSettings.user_upload_progress_handler.call(this, file, bytesComplete, bytesTotal);
			}
		} catch (ex1) { }
			
		
		if (bytesComplete === 0) {
			this.proxyDetectFileStartTimes[file.ID] = new Date();

		} else if (bytesComplete === bytesTotal) {
			try {
				// Calculate the Bps and decide if we should trigger the error
				time = new Date();
				differenceMS = time.getTime() - this.proxyDetectFileStartTimes[file.ID].getTime();
				
				if (differenceMS === 0) {
					differenceMS = 1;
				}
				
				bps = bytesTotal / (differenceMS * 1000);
				if (bps > parseInt(this.settings.proxy_detect_threshold, 10)) {
					this.queueEvent("upload_error_handler", [file, SWFUpload.UPLOAD_ERROR.PROXY, bps]);
				}					
			} catch (ex) {
			}
		}
		
		if (ex1 !== null) {
			throw(ex1);
		}
	};
	
	SWFUpload.proxyDetect.uploadCompleteHandler = function (file) {
		try {
			delete this.proxyDetectFileStartTimes[file.ID];
		} catch (ex) {
		}
		
		if (typeof this.proxyDetectSettings.user_upload_progress_handler === "function") {
			return this.proxyDetectSettings.user_upload_progress_handler.call(this, file);
		}
	};	
}