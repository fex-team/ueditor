var fs = require('fs'),
    compressor = require('node-minify'),
    jsp = require('uglify-js').parser,
    pro = require('uglify-js').uglify;

//压缩js
var jslist = fs.readFileSync('_examples/editor_api.js','utf8');
jslist = jslist.match(/\[([^\]]+)\]/)[1].match(/'[^']+'/g);
var content = [];
for(var i= 0,ci;ci=jslist[i++];){
    console.log(ci.replace(/['"]/g,''));
    content.push(fs.readFileSync('_src/' + ci.replace(/['"]/g,''),'utf8'));
}
content = '(function(){\n' + content.join('\n').replace('_css','css') + '})()';
var ast = jsp.parse(content);

fs.writeFileSync('deploy/ueditor.all.js',pro.gen_code(ast,{beautify:true}));
console.log('deplay/ueditor.all.js create success');
new compressor.minify({
    type: 'gcc',
    fileIn: 'deploy/ueditor.all.js',
    fileOut: 'deploy/ueditor.all.min.js',
    callback: function(err){
        if(err && /java/.test(err.toString())){
            console.log('no java environment found,use uglifyjs for compression');
            new compressor.minify({
                type: 'uglifyjs',
                fileIn: 'deploy/ueditor.all.js',
                fileOut: 'deploy/ueditor.all.min.js',
                callback: function(err){
                    console.log('ueditor.all.min.js create success');
                }
            });
        }else{
            console.log('ueditor.all.min.js create success');
        }
    }
});

//压缩css
content = [];
var csslist = fs.readFileSync('themes/default/_css/ueditor.css','utf8');
csslist = csslist.match(/\"([^\"]+)\"/g);
for(var i= 0,ci;ci=csslist[i++];){
    console.log(ci.replace(/['"]/g,''));
    content.push(fs.readFileSync('themes/default/_css/' + ci.replace(/['"]/g,''),'utf8'));
}
fs.writeFileSync('themes/default/css/ueditor.css',content.join('\n'));
console.log('ueditor.css create success');
new compressor.minify({
    type: 'sqwish',
    fileIn: 'themes/default/css/ueditor.css',
    fileOut: 'themes/default/css/ueditor.min.css',
    callback: function(err){
        console.log('ueditor.min.css create success');
    }
});


