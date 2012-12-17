/**
 * @file
 * @name ui.View.Tableset
 * @import ui/ui.view.pop.js
 * tableset实现类
 */

(function(ui){
    var utils = ui.Utils,
        views = ui.View,
        /**
         * @name ui.View.Tableset
         * @grammar view = new ui.View.Tableset(ui);
         */
        tbp = views.Tableset = function(ui){
            var me = this,
                html = '<div id="{ID}-wraper" class="edui-tablepicker">' +
                    '<div class="edui-tablepicker-body">' +
                    '<div class="edui-infoarea">' +
                    '<span id="{ID}-label" class="edui-label"></span>' +
                    '<span class="edui-clickable">'+ui.getLang("more")+'</span>' +
                    '</div>' +
                    '<div id="{ID}-pickarea" class="edui-pickarea">' +
                    '<div id="{ID}-overlay" class="edui-overlay"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

            this.init({viewText: html});

            this.addListener('render', function(){
                var pkarea = me.getInnerDom('pickarea'),
                    overlay = me.getInnerDom('overlay'),
                    label = me.getInnerDom('label'),
                    langcol = ui.getLang("t_col"),
                    langrow = ui.getLang("t_row");

                utils.on(pkarea, 'mousemove', function(evt){
                    var offset = utils.getEventOffset(evt),
                        sideLen = 22,
                        numCols = Math.ceil(offset.left / sideLen),
                        numRows = Math.ceil(offset.top / sideLen),
                        style = overlay.style;

                    style.width = numCols * sideLen + 'px';
                    style.height = numRows * sideLen + 'px';
                    label.innerHTML = numCols + langcol+' x ' + numRows +  langrow;
                    me.numCols = numCols;
                    me.numRows = numRows;
                });

                utils.on(pkarea, 'mouseout', function(evt){
                    var tar = evt.relatedTarget||evt.toElement;
                    if (tar!==pkarea && !utils.isContains(pkarea, tar ) ) {
                        label.innerHTML = '0'+ langcol+' x 0'+ langrow;
                        overlay.style.visibility = 'hidden';
                    }
                });

                utils.on(pkarea, 'mouseover', function(evt){
                    var tar = evt.relatedTarget||evt.toElement;
                    if (tar!==pkarea && !utils.isContains(pkarea,  tar) ) {
                        label.innerHTML = '0'+ langcol+' x 0'+ langrow;
                        overlay.style.visibility = 'visible';
                    }
                });

                utils.on(pkarea, 'click', function(){
                    me.fireEvent('inserttable', {numRows:me.numRows, numCols:me.numCols, border:1} );
                    me.hide()
                });
            });

        };

    utils.inherits(tbp, views.Pop);
    tbp = views = null;
})(UE.ui);
