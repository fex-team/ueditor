(function (inFilePath, outFilePath){
    var File = java.io.File;
    var System = java.lang.System;
    var match;
    var inFile = new File(inFilePath+'_css/ueditor.css');

    var html = getStringOfFile(inFile);

    var rootDir = new File(inFilePath+'_css');

    var arr = html.match(/import[\s]*"[^"]+\.css/gi);
    var buff = [];
    for (var i=0; i<arr.length; i++) {
        var s=arr[i].replace(/import|\s|"/ig,'');
        System.out.println(s);
        if(s!=""){
            System.out.println(s);
            var file = new File(rootDir, s);
        }

        buff.push(getStringOfFile(file));
    }
    var outFile = new File(outFilePath);
    setStringOfFile(outFile, buff.join('\n'));


    function getStringOfFile(file){
        var buff = java.lang.reflect.Array.newInstance(
            java.lang.Character.TYPE, file.length());
        try {
            var input = new java.io.InputStreamReader(
                new java.io.BufferedInputStream(
                    new java.io.FileInputStream(file)
                ), 'UTF-8');
            input.read(buff);
        } finally {
            if (input) {
                input.close();
            }
        }
        return String(new java.lang.String(buff)).replace(/\0|\uFEFF/g, '');
    }
    function setStringOfFile(file, str){
        try {
            var output = new java.io.OutputStreamWriter(
                new java.io.BufferedOutputStream(
                    new java.io.FileOutputStream(file)
                ), 'UTF-8');
            output.write(str);
        } finally {
            if (output) {
                output.close();
            }
        }
    }

})(arguments[0], arguments[1]);

