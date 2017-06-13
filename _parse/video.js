UE.parse.register("vedio", function(utils) {
  var video = this.root.getElementsByTagName("video"),
    audio = this.root.getElementsByTagName("audio");

  document.createElement("video");
  document.createElement("audio");
  if (video.length || audio.length) {
    var sourcePath = utils.removeLastbs(this.rootPath),
      jsurl = sourcePath + "/third-party/video-js/video.js",
      cssurl = sourcePath + "/third-party/video-js/video-js.min.css",
      swfUrl = sourcePath + "/third-party/video-js/video-js.swf";

    if (window.videojs) {
      videojs.autoSetup();
    } else {
      utils.loadFile(document, {
        id: "video_css",
        tag: "link",
        rel: "stylesheet",
        type: "text/css",
        href: cssurl
      });
      utils.loadFile(
        document,
        {
          id: "video_js",
          src: jsurl,
          tag: "script",
          type: "text/javascript"
        },
        function() {
          videojs.options.flash.swf = swfUrl;
          videojs.autoSetup();
        }
      );
    }
  }
});
