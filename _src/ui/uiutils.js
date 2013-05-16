//对core下utils的扩展
utils.extend(utils,{
    parseTmpl : function(tmplate,data,cb){
        var cont = [],reg = /\{\{([^}]+)\}\}/,match;
        function _compile(str,obj){
            while(match = reg.exec(str)){
                cont.push(str.slice(0,match.index));
                var val = obj[match[1]];
                if(utils.isArray(val)){
                    var subreg = new RegExp('\\{\\{\\/'+match[1]+'\\}\\}'),
                        submatch = subreg.exec(str),
                        substr = str.slice(match.index + match[0].length,submatch.index);
                    for(var i= 0,ci;ci=val[i++];){
                        if(cb && cb(ci,cont)){
                            continue;
                        }
                        _compile(substr,ci)
                    }
                    str = str.slice(submatch.index + submatch[0].length)
                }else{
                    cont.push(val||'');
                    str = str.slice(match.index + match[0].length)
                }
            }
            if(str){
                cont.push(str)
            }
        }
        _compile(tmplate,data);
        return  cont.join('')
    }
});