var fs = require('fs'),
    compressor = require('node-minify'),
    utils = require('util'),
    jsp = require('uglify-js').parser,
    pro = require('uglify-js').uglify;


function copy(src,dst,excludeFn){
    var dstlist = dst.split('/'),tmpPath = '';
    for(var d= 0,dr;dr=dstlist[d++];){
        tmpPath += dr + '/';
        if(!fs.existsSync(tmpPath))
            fs.mkdirSync(tmpPath,0755);
    }
    var filelist = fs.readdirSync(src);

    for(var i= 0,ci;ci=filelist[i++];){
        var tsrc = src + '/' + ci;
        var tdst = dst + '/' + ci;
        if(excludeFn && excludeFn(ci)){
            continue;
        }
        if(fs.statSync(tsrc).isDirectory()){
            copy(tsrc,tdst)
        }else{
            fs.writeFileSync(tdst,fs.readFileSync(tsrc))
        }
    }
}
//读取配置文件
var getConfigCont = function(){
    var content;
    return function(){
        return content || (content = fs.readFileSync('makefile.config','utf8'))
    }
}();


//创建部署目录
createDeployDir();
addServerLang();
addtheme();

function createDeployDir(){
    if(!fs.existsSync('ueditor'))
        fs.mkdirSync('ueditor',0755);
}

function addServerLang(){
    var content = getConfigCont();
    var lang = content.match(/server\.lang\s*=\s*([^#\n\r\t]+)/)[1].replace(/\s*/g,'');
    copy(lang,'ueditor/'+lang)
}

function addtheme(){
    var content = getConfigCont(),
        theme = content.match(/theme\s*=\s*([^#\n\r\t]+)/)[1].replace(/\s*/g,'');
    copy('themes/' + theme,'ueditor/themes/' + theme,function(name){
        return /^_/.test(name)
    })
}



////压缩js
//var jslist = fs.readFileSync('_examples/editor_api.js','utf8');
//jslist = jslist.match(/\[([^\]]+)\]/)[1].match(/'[^']+'/g);
//var content = [];
//for(var i= 0,ci;ci=jslist[i++];){
//    console.log(ci.replace(/['"]/g,''));
//    content.push(fs.readFileSync('_src/' + ci.replace(/['"]/g,''),'utf8'));
//}
//content = '(function(){\n' + content.join('\n').replace('_css','css') + '})()';
//var ast = jsp.parse(content);
//
//fs.writeFileSync('ueditor.all.js',pro.gen_code(ast,{beautify:true}));
//console.log('ueditor.all.js create success');
//new compressor.minify({
//    type: 'gcc',
//    fileIn: 'ueditor.all.js',
//    fileOut: 'ueditor.all.min.js',
//    callback: function(err){
//        if(err && /java/.test(err.toString())){
//            console.log('no java environment found,use uglifyjs for compression');
//            new compressor.minify({
//                type: 'uglifyjs',
//                fileIn: 'ueditor.all.js',
//                fileOut: 'ueditor.all.min.js',
//                callback: function(err){
//                    console.log('ueditor.all.min.js create success');
//                }
//            });
//        }else{
//            console.log('ueditor.all.min.js create success');
//        }
//    }
//});
//
////压缩css
//content = [];
//var csslist = fs.readFileSync('themes/default/_css/ueditor.css','utf8');
//csslist = csslist.match(/\"([^\"]+)\"/g);
//for(var i= 0,ci;ci=csslist[i++];){
//    console.log(ci.replace(/['"]/g,''));
//    content.push(fs.readFileSync('themes/default/_css/' + ci.replace(/['"]/g,''),'utf8'));
//}
//fs.writeFileSync('themes/default/css/ueditor.css',content.join('\n'));
//console.log('ueditor.css create success');
//new compressor.minify({
//    type: 'sqwish',
//    fileIn: 'themes/default/css/ueditor.css',
//    fileOut: 'themes/default/css/ueditor.min.css',
//    callback: function(err){
//        console.log('ueditor.min.css create success');
//    }
//});


