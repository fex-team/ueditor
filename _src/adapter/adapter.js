/**
 * @file adapter.js
 * @desc adapt ui to editor
 * @import core/Editor.js, core/utils.js
 */

(function () {
    var _editorUI = {},
        _editors = {};

    function parseData(data, editor) {
        $.each(data, function (i, v) {
            if (v.label) {
                if (v.data) {
                    parseData(v.data, editor);
                } else {
                    if(v.widget && _editorUI[v.widget]) {
                        var widget = $.proxy(_editorUI[v.widget],editor, v.widget,'menu');

                    }else{
                        if ($.type(v.exec) == 'string') {
                            var command = v.exec;
                            v.exec = function () {
                                editor.execCommand(command)
                            };
                            if (!v.query) {
                                v.query = function () {
                                    editor.queryCommandState(command)
                                }
                            }
                        } else {
                            var fn = v.exec;
                            v.exec = $.proxy(fn, null, editor, v);
                            var queryfn = v.query;
                            v.query = $.proxy(queryfn, null, editor, v);
                        }
                    }

                }

            }
        });
        return data;
    }

    utils.extend(UE, {
        registerUI: function (name, fn) {
            utils.each(name.split(/\s+/), function (uiname) {
                _editorUI[uiname] = fn;
            })
        },
        getUI:function(editor,name){
            var arg = Array.prototype.slice.call(arguments,1);
            if(_editorUI[name]){
                return $.proxy(_editorUI[name],editor,name)()
            }
            return null;
        },
        getActiveEditor: function () {
            var ac;
            utils.each(UE.instants, function (editor) {
                if (editor.selection.isFocus()) {
                    ac = editor;
                    return false;
                }
            });
            return ac;
        },
        getEditor: function (id, options) {
            return _editors[id] || (_editors[id] = this.createEditor(id, options));

        },
        createEditor: function (id, opt) {
            var editor = new UE.Editor(opt);
            editor.langIsReady ? $.proxy(renderUI,this) : editor.addListener("langReady", $.proxy(renderUI,this));
            function renderUI(){
                var $container = this.createUI('#' + id, editor);
                editor.ready(function(){
                    this.addListener('click',function(){
                        $container.find('.dropdown-menu').each(function(){
                            $(this).edui().hide()
                        })
                    })
                });
                editor.render(id);
                $container.css({
                    width: $(editor.iframe).width()
                });
                editor.container = $container.get();
                //添加tooltip;
                $.eduitooltip('attachTo');
                $container.find('a').click(function(evt){
                    evt.preventDefault()
                })
            }


        },
        createUI: function (id, editor) {
            var $editorCont = $(id),
                $container = $('<div class="edui-container"><div class="editor-body"></div></div>').insertBefore($editorCont);
            $container.find('.editor-body').append($editorCont).before(this.createToolbar(editor.options, editor));

            if(editor.options.elementpath || editor.options.wordCount){
                var $bottombar = $('<div class="bottombar"></div>');
                $container.append($bottombar);
            }
            if(editor.options.elementpath){
                $bottombar.append(this.getUI(editor,'elementpath'));
            }
            return $container;
        },
        createToolbar: function (options, editor) {
            var me = this;
            var $toolbar = $.eduitoolbar(), toolbar = $toolbar.edui();
            //创建下来菜单列表

            if (options.menulist) {
                $.each(options.menulist, function (i, v) {
                    $.eduicontextmenu(parseData(v.data, editor)).edui().attachTo(toolbar.appendToTextmenu(toolbar.createTextItem(v.label)));
                })
            } else {
                $toolbar.find('.text-toolbar').remove()
            }

            if (options.toolbar) {

                $.each(options.toolbar,function(i,groupstr){
                    var btngroup = [];
                    $.each(groupstr.split(/\s+/),function(index,name){
                        var ui = me.getUI(editor,name);

                        ui && btngroup.push(ui);
                    });
                    toolbar.appendToBtnmenu(btngroup);
                })

            } else {
                $toolbar.find('.btn-toolbar').remove()
            }
            return $toolbar;
        }

    })


})();


