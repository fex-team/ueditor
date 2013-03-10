var Formula = function (cfg) {
    this.config = {
        '常用公式':[
            "{/}frac{}{}", "^{}/_{}", "x^{}", "x_{}", "x^{}_{}", "{/}bar{}", "{/}sqrt{}", "{/}nthroot{}{}",
            "{/}sum^{}_{n=}", "{/}sum", "{/}log_{}", "{/}ln", "{/}int_{}^{}", "{/}oint_{}^{}"
        ],
        '字母':[
            "{/}alpha", "{/}beta", "{/}gamma", "{/}delta", "{/}varepsilon", "{/}varphi", "{/}lambda", "{/}mu",
            "{/}rho", "{/}sigma", "{/}omega", "{/}Gamma", "{/}Delta", "{/}Theta", "{/}Lambda", "{/}Xi",
            "{/}Pi", "{/}Sigma", "{/}Upsilon", "{/}Phi", "{/}Psi", "{/}Omega"
        ],
        '符号':[
            "+", "-", "{/}pm", "{/}times", "{/}ast", "{/}div", "/", "{/}bigtriangleup",
            "=", "{/}ne", "{/}approx", ">", "<", "{/}ge", "{/}le", "{/}infty",
            "{/}cap", "{/}cup", "{/}because", "{/}therefore", "{/}subset", "{/}supset", "{/}subseteq", "{/}supseteq",
            "{/}nsubseteq", "{/}nsupseteq", "{/}in", "{/}ni", "{/}notin", "{/}mapsto", "{/}leftarrow", "{/}rightarrow",
            "{/}Leftarrow", "{/}Rightarrow", "{/}leftrightarrow", "{/}Leftrightarrow"
        ]
    };

    this.init(cfg);
};
Formula.prototype = {
    init:function () {
        editor._mathList=[];
        this.initTab();//初始化tab
        this.initEditArea();//初始化编辑区域
    },
    initTab:function () {
        var me = this,
            container = $G("J_tabMenu"),
            title = container.children[0],
            content = container.children[1];

        var arrTitle = [], arrContent = [], arrChar = [], x = 0, y = 0;

        for (var pro in me.config) {
            arrTitle.push("<li onclick=\"obj.showTab(event)\">" + pro + "</li>");

            var charArr = me.config[pro];
            for (var i = 0, tmp; tmp = charArr[i++];) {
                arrChar.push("<li onclick=\"obj.insert('" + tmp + "')\" style='" + me._addStyle(x, y) + "'></li>");
                y += 1;
            }

            if (pro == "常用公式") {
                arrContent.push('<div class="mathBox">' + arrChar.join('') + '</div>');
            } else {
                arrContent.push('<div class="mathBox" style="display: none;">' + arrChar.join('') + '</div>');
            }

            //重置数据
            arrChar = [];
            x += 1;
            y = 0;
        }
        title.innerHTML = arrTitle.join('');
        content.innerHTML = arrContent.join('');
    },
    initEditArea:function () {
        var rng=editor.selection.getRange();
        var fnInline = function (node) {
            return domUtils.findParent(node, function (node) {
                return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'mathquill-rendered-math')
            }, true);
        };
        var node= fnInline(rng.startContainer),txt="";
        if(node){
            txt=decodeURIComponent(node.getAttribute("data"));
        }
        $("#J_editArea")
            .html("")
            .css("font-size", domUtils.getComputedStyle(editor.body, "font-size"))
            .mathquill('editable')
            .mathquill('write', txt);
    },
    _addStyle:function (x, y) {
        var vertical, horizontal, row, col, CONSTANT = 34;
        if (x == 0) {
            row = 8;
        } else if (x == 1) {
            row = 5;
        } else {
            row = 0;
        }

        row += Math.floor(y / 8);
        col = y % 8;

        vertical = -(CONSTANT * col);
        horizontal = -(CONSTANT * row);

        return "background-position:" + vertical + "px " + horizontal + "px;"
    },
    showTab:function (evt) {
        var tgt = evt.target || evt.srcElement;
        var index = domUtils.getNodeIndex(tgt);
        var list = $G('J_tabContent').children;

        for (var i = 0, node; node = list[i++];) {
            node.style.display = (i - 1) == index ? "" : "none";
        }
    },
    format:function(node){
        domUtils.setAttributes(node,{
            "data":encodeURIComponent($("#J_editArea").mathquill("latex")),
            "mark":"formula"
        });
        domUtils.removeAttributes(node,['id','mathquill-block-id']);
        domUtils.removeClasses(node,"mathquill-editable")
    },
    insert:function (txt) {
        $("#J_editArea")
            .focus()
            .mathquill("write", txt.replace("{/}","\\"));
    }
};
var obj = new Formula();

dialog.onok=function(){
    var editArea=$G('J_editArea');
    obj.format(editArea);
    editor.execCommand('math', editArea.outerHTML);
};