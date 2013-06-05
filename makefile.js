var fs = require('fs'),
    compressor = require('node-minify'),
    severLang = '',
    encoding = '',
    iconv = require('iconv-lite');

function writeFile(dst,src){
    var buf;
    if(encoding != 'utf-8' && /\.(jsp|ashx|php|html|js|css|java|cs)$/.test(src)){

        buf = fs.readFileSync(src,'utf-8');
        if(!/\.(ashx)$/.test(src))
            buf = buf.replace(/utf\-?8/gi,encoding);
        if(!/\.config/.test(src))
            buf = iconv.encode(buf,encoding);

    }else{
        buf = fs.readFileSync(src);
    }
    fs.writeFileSync(dst, buf);
}

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
                writeFile(tdst,tsrc)
            }
        })
    }else{
        writeFile(dst,src)
    }

}
function move(src,dst){
    if(!fs.statSync(src).isDirectory()){
        writeFile(dst,src);

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
                    writeFile(tdst,tsrc);
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
                try{
                    fs.unlinkSync(subpath)
                }catch(e){}
            }else{
                del(subpath)
            }
        });
        fs.rmdirSync(path)
    }
}

//读取配置文件
var getConfigCont = function(){
    var content;
    return function(){
        return content || (content = fs.readFileSync('makefile.config','utf-8'))
    }
}();


/**********main********/
////创建部署目录
createDeployDir();
//得到输入编码
getEncoding();
////添加后台语言
addServerLang();
////添加dialog
addDialogs();
////合并css
mergeCss();
////添加样式
addtheme();
///添加语言
addFrontLang();
////合并js
mergeJs();

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

function getEncoding(){
    var content = getConfigCont();
    encoding = content.match(/encoding\s*=\s*([^#\n\r\t]+)/)[1].replace(/\s*/g,'');
}
function addServerLang(){
    var content = getConfigCont();
    severLang = content.match(/server\.lang\s*=\s*([^#\n\r\t]+)/)[1].replace(/\s*/g,'');
    copy(severLang,'ueditor/'+severLang)
}

function addtheme(){
    var content = getConfigCont(),
        theme = content.match(/theme\s*=\s*([^#\n\r\t]+)/)[1].replace(/\s*/g,'');
    copy('themes/' + theme,'ueditor/themes/' + theme,function(name){
        return /^_/.test(name)
    });
    copy('themes/iframe.css','ueditor/themes/iframe.css');

    del('themes/default/css')
}

function mergeCss(){
    var content = [];
    var csslist = fs.readFileSync('themes/default/_css/ueditor.css','utf-8');
    csslist = csslist.match(/\"([^\"]+)\"/g);
    for(var i= 0,ci;ci=csslist[i++];){
        console.log(ci.replace(/['"]/g,''));
        content.push(fs.readFileSync('themes/default/_css/' + ci.replace(/['"]/g,''),'utf-8'));
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

    var jslist = fs.readFileSync('_examples/editor_api.js','utf-8');
    jslist = jslist.match(/\[([^\]]+)\]/)[1].match(/'[^']+'/g);
    var content = [];
    for(var i= 0,ci;ci=jslist[i++];){
        console.log(ci.replace(/['"]/g,''));
        content.push(fs.readFileSync('_src/' + ci.replace(/['"]/g,''),'utf-8'));
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
    copy('dialogs','ueditor/dialogs');

}
function addConfig(){
    var content = fs.readFileSync('ueditor.config.js','utf-8');
    switch(severLang){
        case 'net':
            content = content.replace(/\.php/g,'.ashx').replace(/php\//g,'net\/');
            break;
        case 'jsp':
            content = content.replace(/\.php/g,'.jsp').replace(/php\//g,'jsp\/');
    }
    if(encoding != 'utf-8'){
        content = content.replace(/utf\-?8/gi,encoding);
    }
    fs.writeFileSync('ueditor/ueditor.config.js',iconv.encode(content,encoding));

}
function addParse(){
    copy('ueditor.parse.js','ueditor/ueditor.parse.js')
}
function addThirdParty(){
    copy('third-party','ueditor/third-party')
}
function addFrontLang(){
    copy('lang','ueditor/lang')
}
