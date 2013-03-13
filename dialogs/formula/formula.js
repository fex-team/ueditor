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
        this.initTab();//初始化tab
    },
    initTab:function () {
        var me = this,
            container = $G("J_tabMenu"),
            title = container.children[0],
            content = container.children[1];

        var arrTitle = [], arrContent = [], arrChar = [], x = 0, y = 0;

        for (var pro in me.config) {
            if (pro == "常用公式") {
                arrTitle.push("<li class='cur' onclick=\"formula.showTab(event)\">" + pro + "</li>");
            } else {
                arrTitle.push("<li onclick=\"formula.showTab(event)\">" + pro + "</li>");
            }

            var charArr = me.config[pro];
            for (var i = 0, tmp; tmp = charArr[i++];) {
                arrChar.push("<li onclick=\"formula.insert('" + tmp + "',event)\" style='" + me._addStyle(x, y) + "'></li>");
                y += 1;
            }

            if (pro == "常用公式") {
                arrContent.push('<div>' + arrChar.join('') + '</div>');
            } else {
                arrContent.push('<div style="display: none;">' + arrChar.join('') + '</div>');
            }

            //重置数据
            arrChar = [];
            x += 1;
            y = 0;
        }
        title.innerHTML = arrTitle.join('');
        content.innerHTML = arrContent.join('');
        me.autoHeight(0);
    },
    autoHeight:function (index) {
        var iframe = dialog.getDom("iframe"),
            parent = iframe.parentNode.parentNode;
        switch (index) {
            case 0:
                iframe.style.height = "140px";
                parent.style.height = "152px";
                break;
            case 1:
                iframe.style.height = "180px";
                parent.style.height = "192px";
                break;
            case 2:
                iframe.style.height = "260px";
                parent.style.height = "272px";
                break;
            default:

        }
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
        var tgt = evt.target || evt.srcElement,
            index = domUtils.getNodeIndex(tgt),
            listTitle = $G('J_tabTitle').children,
            listContent = $G('J_tabContent').children;

        for (var i = 0, len = listTitle.length; i < len; i++) {
            if (i == index) {
                domUtils.addClass(listTitle[i], "cur");
                listContent[i].style.display = "";
            } else {
                domUtils.removeClasses(listTitle[i], ["cur"]);
                listContent[i].style.display = "none";
            }
        }
        this.autoHeight(index);
    },
    insert:function (txt,evt) {
        editor.execCommand('formula', txt);
        if ( !evt.ctrlKey ) {
            dialog.popup.hide();
        }
    }
};
var formula = new Formula;
