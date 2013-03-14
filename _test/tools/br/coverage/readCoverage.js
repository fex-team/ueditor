/**
 *
 */
///import source
function creatJscoverage(){
    try {
        if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
            // this is a browser window that was opened from another window
            if (! top.opener._$jscoverage) {
                top.opener._$jscoverage = {};
            }
        }
    }

    catch (e) {}
    try {
        if (typeof top === 'object' && top !== null) {
            // this is a browser window
            try {
                if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
                    top._$jscoverage = top.opener._$jscoverage;
                }
            }
            catch (e) {}

            if (! top._$jscoverage) {
                top._$jscoverage = {};
            }
        }
    }
    catch (e) {}

    try {
        if (typeof top === 'object' && top !== null && top._$jscoverage) {
            _$jscoverage = top._$jscoverage;
        }
    }
    catch (e) {}
    if (typeof _$jscoverage !== 'object') {
        _$jscoverage = {};
    }
}

(function(){
    var xmlDoc;
    if (window.ActiveXObject)
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        if(xmlDoc != null)
        {
            xmlDoc.async=true;
            xmlDoc.load("../HTML_Report/report.xml");
        }
    }
    else if(document.implementation && document.implementation.createDocument)
    {
        var xmlHttp=new window.XMLHttpRequest();
        xmlHttp.open("GET","../HTML_Report/report.xml",false);
        xmlHttp.send(null);
        xmlDoc = xmlHttp.responseXML;
    }else{
        xmlDom=null;
    }
    function readCoverage(){
        creatJscoverage();
        var nodeNumber=xmlDoc.getElementsByTagName("testsuite").length;
        for(i=0;i<nodeNumber;i++)
        {
            var nodeName= xmlDoc.getElementsByTagName("testsuite")[i];
            var num = nodeName.getElementsByTagName("testcase").length;
            for(var j=0;j<num;j++){
                var testname = nodeName.getElementsByTagName("testcase")[j];
                var casename = testname.getAttribute("name").split('_').join('/')+'.js';
                if(!_$jscoverage[casename]){
                    _$jscoverage[casename]=[];
                }
                if(testname.getAttribute("cov")=='_') continue;
                var str_r = testname.getAttribute("recordCovForBrowser").split(',');
                for(var z=0;z<str_r.length;z++){
                    if(str_r[z]!=2){
                        if(!_$jscoverage[casename][z])
                            _$jscoverage[casename][z]=0;
                        _$jscoverage[casename][z]+=parseInt(str_r[z]);
                    }
                }
            }
        }
        loadSource();
    }
    if(window.ActiveXObject){
        alert("Your browser is IE,click confirm button to continue ");
        readCoverage();
    } else{
        readCoverage();
    }
})();


