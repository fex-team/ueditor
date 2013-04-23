java -jar js.jar ueditor_css_all.js ../themes/default/ ../themes/default/css/ueditor.css

java -jar js.jar ueditor_js_all.js ../ ../ueditor.all.js
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js ../ueditor.all.js --js_output_file ../ueditor.all.min.js



