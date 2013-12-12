(function (){
    var paths  = [
            'parse.js',
            'insertcode.js',
            'table.js',
            'charts.js',
            'background.js',
            'list.js',
            'video.js'
        ];

    function getUEBasePath ( docUrl, confUrl ) {

        return getBasePath( docUrl || self.document.URL || self.location.href, confUrl || getConfigFilePath() );

    }

    function getConfigFilePath () {

        var configPath = document.getElementsByTagName('script');

        return configPath[ configPath.length -1 ].src;

    }

    function getBasePath ( docUrl, confUrl ) {

        var basePath = confUrl;

        if ( !/^[a-z]+:/i.test( confUrl ) ) {

            docUrl = docUrl.split( "#" )[0].split( "?" )[0].replace( /[^\\\/]+$/, '' );

            basePath = docUrl + "" + confUrl;

        }

        return optimizationPath( basePath );

    }

    function optimizationPath ( path ) {

        var protocol = /^[a-z]+:\/\//.exec( path )[ 0 ],
            tmp = null,
            res = [];

        path = path.replace( protocol, "" ).split( "?" )[0].split( "#" )[0];

        path = path.replace( /\\/g, '/').split( /\// );

        path[ path.length - 1 ] = "";

        while ( path.length ) {

            if ( ( tmp = path.shift() ) === ".." ) {
                res.pop();
            } else if ( tmp !== "." ) {
                res.push( tmp );
            }

        }

        return protocol + res.join( "/" );

    }
    var   baseURL = getUEBasePath() + '_parse/';
    for (var i=0,pi;pi = paths[i++];) {
        document.write('<script type="text/javascript" src="'+ baseURL + pi +'"></script>');
    }
})();
