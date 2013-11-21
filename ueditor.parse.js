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
    var i = 0;
    function loadFile (url) {
            var element = document.createElement('script');
            element.src = url;
            element.onload = element.onreadystatechange = function () {
                if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                    element.onload = element.onreadystatechange = null;
                    if(paths[i]){
                        loadFile(baseURL +paths[i++]);
                    }else{
                        window.loadFilesDone && window.loadFilesDone()
                    }
                }
            };
            document.getElementsByTagName("head")[0].appendChild(element);
    }
    loadFile(baseURL + paths[i++]);
})();
