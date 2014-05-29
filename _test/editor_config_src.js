/**
 *  ueditor完整配置项
 *  可以在这里配置整个编辑器的特性
 */
var UEDITOR_CONFIG = {
    UEDITOR_HOME_URL: '../', //这里你可以配置成ueditor目录在您网站的绝对路径
    toolbars: [
        ['FullScreen','Source','|','Undo','Redo','|',
         'Bold','Italic','Underline','StrikeThrough','Superscript','Subscript','RemoveFormat','FormatMatch','|',
         'BlockQuote','|',
         'PastePlain','|',
         'ForeColor','BackColor','InsertOrderedList','InsertUnorderedList','|',
         'Paragraph','RowSpacing','FontFamily','FontSize','|',
         'DirectionalityLtr','DirectionalityRtl','|','','Indent','Outdent','|',
         'JustifyLeft','JustifyCenter','JustifyRight','JustifyJustify','|',
         'Link','Unlink','Anchor','Image','MultiMenu','Video','Map','GMap','Code', '|',
         'Horizontal','Date','Time','Spechars','|',
         'InsertTable','DeleteTable','InsertParagraphBeforeTable','InsertRow','DeleteRow','InsertCol','DeleteCol','MergeCells','MergeRight','MergeDown','SplittoCells','SplittoRows','SplittoCols','|',
         'SelectAll','ClearDoc','SearchReplace','Print','Preview','PageBreak','Help','AutoSave','InsertFrame']
    ],
    labelMap: {
        'anchor':'锚点',
        'undo': '撤销',
        'redo': '重做',
        'bold': '加粗',
        'indent':'首行缩进',
        'outdent':'取消缩进',
        'italic': '斜体',
        'underline': '下划线',
        'strikethrough': '删除线',
        'subscript': '下标',
        'superscript': '上标',
        'formatmatch': '格式刷',
        'source': '源代码',
        'blockquote': '引用',
        'pasteplain': '纯文本粘贴模式',
        'selectall': '全选',
        'print': '打印',
        'preview': '预览',
        'horizontal': '分隔线',
        'removeformat': '清除格式',
        'time': '时间',
        'date': '日期',
        'unlink': '取消链接',
        'insertrow': '前插入行',
        'insertcol': '前插入列',
        'mergeright': '右合并单元格',
        'mergedown': '下合并单元格',
        'deleterow': '删除行',
        'deletecol': '删除列',
        'splittorows': '拆分成行',
        'splittocols': '拆分成列',
        'splittocells': '完全拆分单元格',
        'mergecells': '合并多个单元格',
        'deletetable': '删除表格',
//        'tablesuper': '表格高级设置',
        'insertparagraphbeforetable': '表格前插行',
        'cleardoc': '清空文档',
        'fontfamily': '字体',
        'fontsize': '字号',
        'paragraph': '格式',
        'image': '图片',
        'inserttable': '表格',
        'link': '超链接',
        'emoticon': '表情',
        'spechars': '特殊字符',
        'searchreplace': '查询替换',
        'map': 'Baidu地图',
        'gmap': 'Google地图',
        'video': '视频',
        'help': '帮助',
        'justifyleft':'居左对齐',
        'justifyright':'居右对齐',
        'justifycenter':'居中对齐',
        'justifyjustify':'两端对齐',
        'forecolor' : '字体颜色',
        'backcolor' : '背景色',
        'insertorderedlist' : '有序列表',
        'insertunorderedlist' : '无序列表',
        'fullscreen' : '全屏',
        'directionalityltr' : '从左向右输入',
        'directionalityrtl' : '从右向左输入',
        'rowspacing' : '行间距',
        'code' : '插入代码',
        'pagebreak':'分页',
        'insertframe':'插入Iframe'
    },
    iframeUrlMap: {
        'anchor': '../../../dialogs/anchor/anchor.html',
        'image': '../../../dialogs/image/image.html',
        'inserttable': '../../../dialogs/table/table.html',
        'link': '../../../dialogs/link/link.html',
        'emoticon': '../../../dialogs/emoticon/emoticon.html',
        'spechars': '../../../dialogs/spechars/spechars.html',
        'searchreplace': '../../../dialogs/searchreplace/searchreplace.html',
        'map': '../../../dialogs/map/map.html',
        'gmap': '../../../dialogs/gmap/gmap.html',
        'video': '../../../dialogs/video/video.html',
        'help': '../../../dialogs/help/help.html',
        'code' : '../../../dialogs/code/code.html',
        'multimenu': '../../../dialogs/menu-emoticon/emoticon.html',
        'insertframe': '../../../dialogs/insertframe/insertframe.html'
    },
    listMap: {
        'fontfamily': ['宋体', '楷体', '隶书', '黑体','andale mono','arial','arial black','comic sans ms','impact','times new roman'],
        'fontsize': [10, 11, 12, 14, 16, 18, 20, 24, 36],
        'underline':['none','overline','line-through','underline'],
        'paragraph': ['p:Paragraph', 'h1:Heading 1', 'h2:Heading 2', 'h3:Heading 3', 'h4:Heading 4', 'h5:Heading 5', 'h6:Heading 6'],
        'rowspacing' : ['1.0:0','1.5:15','2.0:20','2.5:25','3.0:30']
    },
    fontMap: {
        '宋体': ['宋体', 'SimSun'],
        '楷体': ['楷体', '楷体_GB2312', 'SimKai'],
        '黑体': ['黑体', 'SimHei'],
        '隶书': ['隶书', 'SimLi'],
        'andale mono' : ['andale mono'],
        'arial' : ['arial','helvetica','sans-serif'],
        'arial black' : ['arial black','avant garde'],
        'comic sans ms' : ['comic sans ms'],
        'impact' : ['impact','chicago'],
        'times new roman' : ['times new roman']
    },
    contextMenu: [
        {
            label : '删除',
            cmdName : 'delete'

        },
        {
            label : '全选',
            cmdName : 'selectall'

        },{
            label : '删除代码',
            cmdName : 'highlightcode'

        },{
             label : '清空文档',
             cmdName : 'cleardoc',
            exec : function(){
                if(confirm('确定清空文档吗？')){
                    this.execCommand('cleardoc');
                }
            }
        },'-',{
             label : '取消链接',
             cmdName : 'unlink'
        },'-',{
            group : '段落格式',
            icon : 'justifyjustify',
            subMenu : [
                {
                    label: '居左对齐',
                    cmdName : 'justify',
                    value : 'left'
                },
               {
                    label: '居右对齐',
                    cmdName : 'justify',
                    value : 'right'
                },{
                    label: '居中对齐',
                    cmdName : 'justify',
                    value : 'center'
                },{
                    label: '两端对齐',
                    cmdName : 'justify',
                    value : 'justify'
                }
            ]
        },'-',{
            group : '表格',
            icon : 'table',
            subMenu : [
                {
                    label: '删除表格',
                    cmdName : 'deletetable'
                },
                {
                    label: '表格前插行',
                    cmdName : 'insertparagraphbeforetable'
                },
                '-',
                {
                    label: '删除行',
                    cmdName : 'deleterow'
                },
                {
                    label: '删除列',
                    cmdName : 'deletecol'
                },
                '-',
                 {
                    label: '前插入行',
                    cmdName : 'insertrow'
                },
                {
                    label: '前插入列',
                    cmdName : 'insertcol'
                },
                '-',
                 {
                    label: '右合并单元格',
                    cmdName : 'mergeright'
                },
                {
                    label: '下合并单元格',
                    cmdName : 'mergedown'
                },
                '-',
                 {
                    label: '拆分成行',
                    cmdName : 'splittorows'
                },
                {
                    label: '拆分成列',
                    cmdName : 'splittocols'
                },
                 {
                    label: '合并多个单元格',
                    cmdName : 'mergecells'
                },
                {
                    label: '完全拆分单元格',
                    cmdName : 'splittocells'
                }
            ]
        }
    ],
    initialStyle: '',                                    //编辑器内部样式
    initialContent: 'hello',  //初始化编辑器的内容
    autoClearinitialContent :true,                       //是否自动清除编辑器初始内容
    iframeCssUrl :'../../../themes/iframe.css',        //要引入css的url
    removeFormatTags : 'b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var',    //配置格式刷删除的标签
    removeFormatAttributes : 'class,style,lang,width,height,align,hspace,valign',        //配置格式刷删除的属性
    enterTag : 'p',                                      //编辑器回车标签。p或br
    maxUndoCount : 20,                                   //最多可以回退的次数
    maxInputCount : 20,                                  //当输入的字符数超过该值时，保存一次现场
    selectedTdClass : 'selectTdClass',                   //设定选中td的样式名称
    pasteplain : 0,                                      //是否纯文本粘贴。false为不使用纯文本粘贴，true为使用纯文本粘贴
    textarea : 'editorValue',                            //提交表单时，服务器端接收编辑器内容的名字
    focus : false,                                       //初始化时，是否让编辑器获得焦点true或false
    indentValue : '2em',                                 //初始化时，首行缩进距离
    pageBreakTag : '_baidu_page_break_tag_',             //分页符
    autoSave:true,                                       //是否开启自动保存
    autoSavePath:this.UEDITOR_HOME_URL+'auto-save.php',  //自动保存的地址
    autoSaveFrequency:5,                                 //自动保存频率
    minFrameHeight: 320,                                 //最小高度
    autoHeightEnabled: true,                             //是否自动长高
    autoFloatEnabled: true,                              //是否保持toolbar的位置不动
    elementPathEnabled : true,                           //是否启用elementPath
    serialize : function(){                              //配置过滤标签
        function X( t, s, b ) {
            var o = {};
            for(var i=0,ai;ai=arguments[i++];){
                for(var k in ai){
                    o[k] = ai[k]
                }
            }

            return o;
        }
        var inline = {strong:1,em:1,b:1,i:1,u:1,span:1,a:1,img:1};
        var block = X(inline, {p:1,div:1,blockquote:1,$:{style:1,dir:1}});
        return {
            blackList: {style:1,script:1,form:1,input:1,textarea:1,"#comment":1}
//            ,
//            whiteList: {
//                br: {$:{}},
//                span: X(inline, {$:{style:1,id:1}}),
//                strong: inline,
//                em:inline,
//                b: inline,
//                a: X(inline,{$:{href:1,'target':1,title:1}}),
//                u: inline,
//                div: block,
//                p: block,
//                ul: {li:1,$:{style:1}},
//                ol: {li:1,$:{style:1}},
//                li: block,
//                img: {$:{style:1,width:1,height:1,src:1,alt:1,title:1}}
//            }
        };
    }()
};