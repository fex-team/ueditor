var fs = require('fs'),
    compressor = require('node-minify'),
    utils = require('util');


function copy(src,dst,excludeFn){


    if(fs.statSync(src).isDirectory()){

        var dstlist = dst.split('/'),tmpPath = '';
        for(var d= 0,dr;dr=dstlist[d++];){
            tmpPath += dr + '/';
            if(!fs.existsSync(tmpPath))
                fs.mkdirSync(tmpPath,0755);
        }
        fs.readdirSync(src).forEach(function(name){
            if(excludeFn && excludeFn(name)){
                return;
            }
            var tsrc = src + '/' + name;
            var tdst = dst + '/' + name;

            if(fs.statSync(tsrc).isDirectory()){
                copy(tsrc,tdst)
            }else{
                fs.writeFileSync(tdst,fs.readFileSync(tsrc))
            }
        })
    }else{
        fs.writeFileSync(dst,fs.readFileSync(src))
    }

}
function move(src,dst){

    if(!fs.statSync(src).isDirectory()){

        fs.writeFileSync(dst,fs.readFileSync(src));
        fs.unlinkSync(src);
    }else{
        var dstlist = dst.split('/'),tmpPath = '';
        for(var d= 0,dr;dr=dstlist[d++];){
            tmpPath += dr + '/';
            if(!fs.existsSync(tmpPath))
                fs.mkdirSync(tmpPath,0755);
        }
        if(fs.statSync(src).isDirectory()){
            var filelist = fs.readdirSync(src);

            for(var i= 0,ci;ci=filelist[i++];){
                var tsrc = src + '/' + ci;
                var tdst = dst + '/' + ci;
                if(excludeFn && excludeFn(ci)){
                    continue;
                }
                if(fs.statSync(tsrc).isDirectory()){
                    move(tsrc,tdst)
                }else{
                    fs.writeFileSync(tdst,fs.readFileSync(tsrc))
                    fs.unlinkSync(tsrc);
                }
            }
        }
    }
}

function del(path){
    if(fs.statSync(path).isDirectory()){
        fs.readdirSync(path).forEach(function(subpath){
            subpath = path + '/' + subpath;
            if(fs.statSync(subpath).isFile()){
                fs.unlinkSync(subpath)
            }else{
                del(subpath)
            }
        })
        fs.rmdirSync(path)
    }
}

//读取配置文件
var getConfigCont = function(){
    var content;
    return function(){
        return content || (content = fs.readFileSync('makefile.config','utf8'))
    }
}();


/**********main********/
////创建部署目录
createDeployDir();
////添加后台语言
addServerLang();
////合并css
mergeCss();
////添加样式
addtheme();
////合并js
mergeJs();
////添加dialog
addDialogs();
////添加config.js
addConfig();
////添加parse.js
addParse();
////添加第三方插件
addThirdParty();
/*******/


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

    del('themes/default/css')
}

function mergeCss(){
    var content = [];
    var csslist = fs.readFileSync('themes/default/_css/ueditor.css','utf8');
    csslist = csslist.match(/\"([^\"]+)\"/g);
    for(var i= 0,ci;ci=csslist[i++];){
        console.log(ci.replace(/['"]/g,''));
        content.push(fs.readFileSync('themes/default/_css/' + ci.replace(/['"]/g,''),'utf8'));
    }
    if(!fs.existsSync('themes/default/css')){
        fs.mkdirSync('themes/default/css',0755);
    }
    fs.writeFileSync('themes/default/css/ueditor.css',content.join('\n'));
    console.log('ueditor.css merge success');
    new compressor.minify({
        type: 'sqwish',
        fileIn: 'themes/default/css/ueditor.css',
        fileOut: 'themes/default/css/ueditor.min.css',
        callback: function(err){
            console.log('ueditor.min.css compress success');
        }
    });

}

function mergeJs(){

    var jslist = fs.readFileSync('_examples/editor_api.js','utf8');
    jslist = jslist.match(/\[([^\]]+)\]/)[1].match(/'[^']+'/g);
    var content = [];
    for(var i= 0,ci;ci=jslist[i++];){
        console.log(ci.replace(/['"]/g,''));
        content.push(fs.readFileSync('_src/' + ci.replace(/['"]/g,''),'utf8'));
    }
    //前后封装
    content = '(function(){\n' + content.join('\n').replace('_css','css') + '})()';
    try{
        var jsp = require('uglify-js').parser,
            pro = require('uglify-js').uglify;
        var ast = jsp.parse(content);
        fs.writeFileSync('ueditor.all.js',pro.gen_code(ast,{beautify:true}));
    }catch(e){
        fs.writeFileSync('ueditor.all.js',content);
    }

    console.log('ueditor.all.js create success');
    new compressor.minify({
        type: 'gcc',
        fileIn: 'ueditor.all.js',
        fileOut: 'ueditor.all.min.js',
        callback: function(err){
            if(err && /java/.test(err.toString())){
                console.log('no java environment found,use uglifyjs for compression');
                new compressor.minify({
                    type: 'uglifyjs',
                    fileIn: 'ueditor.all.js',
                    fileOut: 'ueditor.all.min.js',
                    callback: function(err){
                        console.log('ueditor.all.min.js compress success');
                        move('ueditor.all.min.js','ueditor/ueditor.all.min.js');
                        move('ueditor.all.js','ueditor/ueditor.all.js');

                    }
                });
            }else{
                move('ueditor.all.min.js','ueditor/ueditor.all.min.js');
                move('ueditor.all.js','ueditor/ueditor.all.js');
                console.log('ueditor.all.min.js compress success');
            }
        }
    });
}

function addDialogs(){
    copy('dialogs','ueditor/dialogs')
}
function addConfig(){
    copy('ueditor.config.js','ueditor/ueditor.config.js')
}
function addParse(){
    copy('ueditor.parse.js','ueditor/ueditor.parse.js')
}
function addThirdParty(){
    copy('third-party','ueditor/third-party')
}
debugger
del('ueditor/themes')