/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-4-12
 * Time: 下午4:46
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.uiutils' );
test( 'parseTmpl', function() {
    var tmpl = 'aaaa{{text}}';
    equals(UE.utils.parseTmpl(tmpl,{text:1}),'aaaa1');
    tmpl = '<ul>{{list}}<li>{{text}}</li>{{/list}}</ul>';
    equals(UE.utils.parseTmpl(tmpl,{list:[{text:1},{text:2}]}),'<ul><li>1</li><li>2</li></ul>');
} );