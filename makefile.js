var fs = require('fs'),
    cmp = require('node-minify');

new cmp.minify({
    type: 'gcc',
    fileIn: 'ueditor.all.js',
    fileOut: 'ueditor.all.min.js',
    callback: function(err){
        console.log(err);
    }
});