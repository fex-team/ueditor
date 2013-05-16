//popup 类
UE.ui.define('popup',{
    init : function(options){
        this.root($('<div class="dropdown-menu">'+options.cont+'</div>'));
    }
});