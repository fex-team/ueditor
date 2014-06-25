UE.parse.register('list',function(utils){
    var customCss = [],
        customStyle = {
            'cn'    :   'cn-1-',
            'cn1'   :   'cn-2-',
            'cn2'   :   'cn-3-',
            'num'   :   'num-1-',
            'num1'  :   'num-2-',
            'num2'  :   'num-3-',
            'dash'  :   'dash',
            'dot'   :   'dot'
        };


    utils.extend(this,{
        liiconpath : 'http://bs.baidu.com/listicon/',
        listDefaultPaddingLeft : '20'
    });

    var root = this.root,
        ols = root.getElementsByTagName('ol'),
        uls = root.getElementsByTagName('ul'),
        selector = this.selector;

    if(ols.length){
        applyStyle.call(this,ols);
    }

    if(uls.length){
        applyStyle.call(this,uls);
    }

    if(ols.length || uls.length){
        customCss.push(selector +' .list-paddingleft-1{padding-left:0}');
        customCss.push(selector +' .list-paddingleft-2{padding-left:'+ this.listDefaultPaddingLeft+'px}');
        customCss.push(selector +' .list-paddingleft-3{padding-left:'+ this.listDefaultPaddingLeft*2+'px}');

        utils.cssRule('list', selector +' ol,'+selector +' ul{margin:0;padding:0;}\n' + selector + ' li{clear:both;}\n'+customCss.join('\n'), document);
    }
    function applyStyle(nodes){
        var T = this;
        utils.each(nodes,function(list){
            if(list.className && /custom_/i.test(list.className)){
                var listStyle = list.className.match(/custom_(\w+)/)[1];
                if(listStyle == 'dash' || listStyle == 'dot'){
                    utils.pushItem(customCss,selector +' li.list-' + customStyle[listStyle] + '{background-image:url(' + T.liiconpath +customStyle[listStyle]+'.gif)}');
                    utils.pushItem(customCss,selector +' ul.custom_'+listStyle+'{list-style:none;} '+ selector +' ul.custom_'+listStyle+' li{background-position:0 3px;background-repeat:no-repeat}');

                }else{
                    var index = 1;
                    utils.each(list.childNodes,function(li){
                        if(li.tagName == 'LI'){
                            utils.pushItem(customCss,selector + ' li.list-' + customStyle[listStyle] + index + '{background-image:url(' + T.liiconpath  + 'list-'+customStyle[listStyle] +index + '.gif)}');
                            index++;
                        }
                    });
                    utils.pushItem(customCss,selector + ' ol.custom_'+listStyle+'{list-style:none;}'+selector+' ol.custom_'+listStyle+' li{background-position:0 3px;background-repeat:no-repeat}');
                }
                switch(listStyle){
                    case 'cn':
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-1{padding-left:25px}');
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-2{padding-left:40px}');
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-3{padding-left:55px}');
                        break;
                    case 'cn1':
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-1{padding-left:30px}');
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-2{padding-left:40px}');
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-3{padding-left:55px}');
                        break;
                    case 'cn2':
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-1{padding-left:40px}');
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-2{padding-left:55px}');
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-3{padding-left:68px}');
                        break;
                    case 'num':
                    case 'num1':
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-1{padding-left:25px}');
                        break;
                    case 'num2':
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-1{padding-left:35px}');
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-2{padding-left:40px}');
                        break;
                    case 'dash':
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft{padding-left:35px}');
                        break;
                    case 'dot':
                        utils.pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft{padding-left:20px}');
                }
            }
        });
    }


});