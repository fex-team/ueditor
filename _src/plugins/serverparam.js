/**
 * 服务器提交的额外参数列表设置插件
 * @file
 * @since 1.2.6.1
 */
UE.plugin.register('serverparam', function (){

    var me = this,
        serverParam = {};

    return {
        commands:{
            /**
             * 修改服务器提交的额外参数列表,清除所有项
             * @command serverparam
             * @method execCommand
             * @param { String } cmd 命令字符串
             * @example
             * ```javascript
             * editor.execCommand('serverparam');
             * editor.queryCommandValue('serverparam'); //返回空
             * ```
             */
            /**
             * 修改服务器提交的额外参数列表,删除指定项
             * @command serverparam
             * @method execCommand
             * @param { String } cmd 命令字符串
             * @param { String } key 要清除的属性
             * @example
             * ```javascript
             * editor.execCommand('serverparam', 'name'); //删除属性name
             * ```
             */
            /**
             * 修改服务器提交的额外参数列表,使用键值添加项
             * @command serverparam
             * @method execCommand
             * @param { String } cmd 命令字符串
             * @param { String } key 要添加的属性
             * @param { String } value 要添加属性的值
             * @example
             * ```javascript
             * editor.execCommand('serverparam', 'name', 'hello');
             * editor.queryCommandValue('serverparam'); //返回对象 {'name': 'hello'}
             * ```
             */
            /**
             * 修改服务器提交的额外参数列表,传入键值对对象添加多项
             * @command serverparam
             * @method execCommand
             * @param { String } cmd 命令字符串
             * @param { Object } key 传入的键值对对象
             * @example
             * ```javascript
             * editor.execCommand('serverparam', {'name': 'hello'});
             * editor.queryCommandValue('serverparam'); //返回对象 {'name': 'hello'}
             * ```
             */
            /**
             * 修改服务器提交的额外参数列表,使用自定义函数添加多项
             * @command serverparam
             * @method execCommand
             * @param { String } cmd 命令字符串
             * @param { Function } key 自定义获取参数的函数
             * @example
             * ```javascript
             * editor.execCommand('serverparam', function(editor){
             *     return {'key': 'value'};
             * });
             * editor.queryCommandValue('serverparam'); //返回对象 {'key': 'value'}
             * ```
             */

            /**
             * 获取服务器提交的额外参数列表
             * @command serverparam
             * @method queryCommandValue
             * @param { String } cmd 命令字符串
             * @example
             * ```javascript
             * editor.queryCommandValue( 'serverparam' ); //返回对象 {'key': 'value'}
             * ```
             */
            'serverparam':{
                execCommand:function (cmd, key, value) {
                    if (key === undefined || key === null) { //不传参数,清空列表
                        serverParam = {};
                    } else if (utils.isString(key)) { //传入键值
                        if(value === undefined || value === null) {
                            delete serverParam[key];
                        } else {
                            serverParam[key] = value;
                        }
                    } else if (utils.isObject(key)) { //传入对象,覆盖列表项
                        utils.extend(serverParam, key, true);
                    } else if (utils.isFunction(key)){ //传入函数,添加列表项
                        utils.extend(serverParam, key(), true);
                    }
                },
                queryCommandValue: function(){
                    return serverParam || {};
                }
            }
        }
    }
});
