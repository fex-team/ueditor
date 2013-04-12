java -jar js.jar ueditor_css_all.js ../themes/default/ ../themes/default/css/ueditor.css

java -jar js.jar ueditor_js_all.js ../ ../ueditor.all.js
java -jar yuicompressor-2.4.6.jar --nomunge --preserve-semi  --disable-optimizations --charset utf-8 ../ueditor.all.js -o ../ueditor.all.min.js


