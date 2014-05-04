module( 'plugins.serverparam' );

test( '检查是否能正常设置参数', function () {
    var editor = te.obj[0];

    editor.execCommand('serverparam', {"a": 1, "b": 2});
    same( editor.queryCommandValue('serverparam'), {"a": 1, "b": 2}, '传入对象设置参数');

    editor.execCommand('serverparam', "c", 3);
    same( editor.queryCommandValue('serverparam'), {"a": 1, "b": 2, "c": 3}, '传入键和值设置参数');

    editor.execCommand('serverparam', "c");
    same( editor.queryCommandValue('serverparam'), {"a": 1, "b": 2}, '传入键删除参数');

    editor.execCommand('serverparam');
    same( editor.queryCommandValue('serverparam'), {}, '不传参数,清空参数表');
} );