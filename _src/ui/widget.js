(function($){
    //所有ui的基类
    var _eventHandler = [];
    var _widget = function(){};
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
            this.root().trigger(ev, data);
            return this;
        },
        root : function($el){
            return this._$el || (this._$el = $el);
        },
        destroy : function(){

        },
        data : function(key,val){
            if(val !== undefined){
                this.root().data(key,val);
                return this;
            }else{
                return this.root().data(key)
            }
        },
        register:function(eventName,$el,fn){
            _eventHandler.push({
                'evtname':eventName,
                '$el':$el,
                handler: $.proxy(fn,$el)
            })
        }
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
        $[className] = Class;
        $.fn[className] = function(opt){
            var result,args =Array.prototype.slice.call(arguments,1);

            this.each(function(i,el){
                var $this = $(el);
                var obj = $this.data(className);
                if(!obj){
                    Class(!opt || !$.isPlainObject(opt) ? {} : opt,$this);
                    obj = $this.data(className);
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
                            widgetName : className}
                    );
                    var obj = new _obj;
                    $el && obj.root($el);
                    obj.init && obj.init($.extend2(options,obj.default||{},true));
                    obj.root().data(className,obj);
                    return obj.root();
                },
                properties,supperClass);

            mergeToJQ(Class,className);
        }
    }

    $(function(){
        $(document).on('click mouseup mousedown dblclick',function(evt){
            $.each(_eventHandler,function(i,obj){
                if(obj.evtname == evt.type && obj.$el[0] !== evt.target &&  !$.contains(obj.$el[0],evt.target)){
                    obj.handler(evt);
                }
            })
        })
    })
})(jQuery);