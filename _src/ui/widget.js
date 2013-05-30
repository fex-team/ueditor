(function($){
    //所有ui的基类
    var _eventHandler = [];
    var _widget = function(){};
    var _prefix = 'edui';
    _widget.prototype = {
        on : function (ev,cb){
            this.root().on(ev, $.proxy(cb, this));
            return this;
        },
        off : function(ev,cb){
            this.root().off(ev, $.proxy(cb, this));
            return this;
        },
        trigger : function(ev,data){
            return  this.root().trigger(ev, data) === false ? false : this;
        },
        root : function($el){
            return this._$el || (this._$el = $el);
        },
        destroy : function(){

        },
        data : function(key,val){
            if(val !== undefined){
                this.root().data(_prefix + key,val);
                return this;
            }else{
                return this.root().data(_prefix + key)
            }
        },
        register:function(eventName,$el,fn){
            _eventHandler.push({
                'evtname':eventName,
                '$els': $.isArray($el) ? $el : [$el],
                handler: $.proxy(fn,$el)
            })
        }
    };

    //从jq实例上拿到绑定的widget实例
    $.fn.edui = function(obj){
        return obj ? this.data('eduiwidget',obj) : this.data('eduiwidget');
    };

    function _createClass(Class,properties,supperClass){
        Class.prototype = $.extend2(
            $.extend({},properties),
            (UE.ui[supperClass]||_widget).prototype,
            true
        );
        Class.prototype.supper =  (UE.ui[supperClass]||_widget).prototype;
        return Class
    }
    var _guid = 1;
    function mergeToJQ(Class,className){
        $[_prefix + className] = Class;
        $.fn[_prefix + className] = function(opt){
            var result,args = Array.prototype.slice.call(arguments,1);

            this.each(function(i,el){
                var $this = $(el);
                var obj = $this.edui();
                if(!obj){
                    Class(!opt || !$.isPlainObject(opt) ? {} : opt,$this);
                    $this.edui(obj)
                }
                if($.type(opt) == 'string'){
                    if(opt == 'this'){
                        result = obj;
                    }else{
                        result  = obj[opt].apply(obj,args);
                        if ( result !== obj && result !== undefined) {
                            return false;
                        }
                        result = null;
                    }

                }
            });

            return result !== null ? result : this;
        }
    }
    UE.ui = {
        define : function(className,properties,supperClass){
            var Class = UE.ui[className] = _createClass(function(options,$el){
                    var _obj = function(){};
                    $.extend(_obj.prototype,Class.prototype,{
                            guid : className + _guid++,
                            widgetName : className
                        }
                    );
                    var obj = new _obj;
                    if($.type(options) == 'string'){
                        obj.init && obj.init({});
                        obj.root().edui(obj);
                        obj.root().find('a').click(function(evt){
                            evt.preventDefault()
                        });
                        return obj.root()[_prefix +className].apply(obj.root(),arguments)
                    }else{
                        $el && obj.root($el);
                        obj.init && obj.init(!options || $.isPlainObject(options) ? $.extend2(options||{},obj.default||{},true) : options);
                        obj.root().find('a').click(function(evt){
                            evt.preventDefault()
                        });
                        return obj.root().edui(obj);
                    }

                },
                properties,supperClass);

            mergeToJQ(Class,className);
        }
    };

    $(function(){
        $(document).on('click mouseup mousedown dblclickc mouseover',function(evt){
            $.each(_eventHandler,function(i,obj){
                if(obj.evtname == evt.type){
                    $.each(obj.$els,function(i,$el){
                        if($el[0] !== evt.target  && !$.contains($el[0],evt.target)){
                            obj.handler(evt);
                        }
                    })
                }
            })
        })
    })
})(jQuery);