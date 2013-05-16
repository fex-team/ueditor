(function(){
    //所有ui的基类
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
            return this._$el = $el || this._$el;
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

        }
    };

    function _createClass(Class,properties,supperClass){
        Class.prototype = utils.extend(
            utils.clone(properties,{}),
            (UE.ui[supperClass]||_widget).prototype,
            true
        );
        return Class
    }
    var _guid = 1;
    UE.ui = {
        define : function(className,properties,supperClass){
            var Class = UE.ui[className] = _createClass(function(options){
                    var _obj = function(){};
                    utils.extend2(_obj.prototype,Class.prototype,{
                            guid : className + _guid++,
                            widgetName : className}
                    );
                    var obj = new _obj;
                    obj.init && obj.init(options);
                    return obj;
                },
                properties,supperClass);
        }
    }
})();