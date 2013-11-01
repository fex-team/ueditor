(function (){
    var paths  = [
            'parse.js',
            'insertcode.js',
            'table.js',
            'charts.js',
            'background.js',
            'list.js'
        ],
        baseURL = '../_parse/';
    for (var i=0,pi;pi = paths[i++];) {
        var script  = document.createElement('script');
        script.src = baseURL + pi;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
})();
