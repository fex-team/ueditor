java -jar js.jar build_editor_css_all.js ../themes/default/ ../themes/default/css/ueditor.css

java -jar js.jar build_editor_js_all.js ../ ../editor_all.js
java -jar yuicompressor-2.4.6.jar --nomunge --preserve-semi  --disable-optimizations --charset utf-8 ../editor_all.js -o ../editor_all_min.js


