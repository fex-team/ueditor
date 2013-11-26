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
        document.write('<script type="text/javascript" src="'+ baseURL + pi +'"></script>');
    }
})();
