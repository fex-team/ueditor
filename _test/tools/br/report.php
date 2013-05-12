<?php
    error_reporting(E_ERROR|E_WARNING);
//经常碰到傲游和IE6同时完成的情况，如何处理比较合适？
//TODO add php info in xml
if (substr_count($_POST['config'], "browser") == 0) {
    echo "report only create if browser is set\n\r<br />";
    return;
}

function report()
{
    /**
     * for junit report
     */
    $dom = new DOMDocument('1.0', 'utf-8');
    $suite = $dom->appendChild($dom->createElement('testsuite'));
    $cfg = preg_split('/[&=]/', $_POST['config']);
    $config = array();
    for ($i = 0; $i < sizeof($cfg); $i += 2) {
        //	echo "{$cfg[$i]} {$cfg[$i+1]}\r\n<br />";
        $config[$cfg[$i]] = $cfg[$i + 1];
        $p = $suite->appendChild($dom->createElement("property"));

        $p->setAttribute('name', $cfg[$i]);
        $p->setAttribute('value', $cfg[$i + 1]);

    }
    $suite->setAttribute("name", $config['browser']);
    $errors = 0;
    $failures = 0;
    $tests = 0;
    $time = 0;
    $filter = $config['filter'];
    foreach ($_POST as $key => $value) {
        if ($key == 'config')
            continue;
        $info = explode(";", $value);
        if ($filter!='' && (substr_count($key, $filter) == 0 || strpos($key, $filter) > 0))
            continue;
        //errornum + ',' + allnum + ','+ kissPerc || 0 + ',' + wb.kissstart + ','+ wb.kissend;
        $casetime = ($info[4] - $info[3]) / 1000;
        $time += $casetime;
        $tests++;
        $failure = (int)($info[0]);
        $case = $suite->appendChild($dom->createElement('testcase'));
        $case->setAttribute("name", $key);
        $case->setAttribute("time", $casetime);
        $case->setAttribute("cov", $info[2]);
        $case->setAttribute('failNumber', $info[0]);
        $case->setAttribute('totalNumber', $info[1]);
        $case->setAttribute('recordCovForBrowser',$info[5]);
        $case->setAttribute('browserInfo', $config['browser']);
        $case->setAttribute('hostInfo', Config::$BROWSERS[$config['browser']][0]);
        //            covHtml( $config[ 'browser' ] . '/' . $key , $info[ 2 ] );
        if ($failure > 0) {
            $failures++;
            $failinfo = $case->appendChild($dom->createElement('failure'));
            $failinfo->setAttribute('type', 'junit.framework.AssertionFailedError');
            //FROM php.net, You cannot simply overwrite $textContent, to replace the text content of a DOMNode, as the missing readonly flag suggests.
            $kiss = join(".", split("/", $key));
            //                $failinfo->appendChild( new DOMText( $value ) );
            $failinfo->appendChild(new DOMText("<a href=\"http://10.48.31.90:8089/ueditor_git/_test/tools/br/run.php?case=$kiss\">run</a>"));
        }
        //TODO add more case info in xml
    }

    $suite->setAttribute('time', $time);
    $suite->setAttribute('failures', $failures);
    $suite->setAttribute('tests', $tests);

    if (!is_dir("report_{$config['filter']}"))
        mkdir("report_{$config['filter']}");
    $dom->save("report_{$config['filter']}/{$config['browser']}.xml");
}
include 'config.php';
$config;
$configs = preg_split('/[&=]/', $_POST['config']);
for ($j = 0; $j < sizeof($configs); $j += 2) {
    //	echo "{$cfg[$i]} {$cfg[$i+1]}\r\n<br />";
//    if(strcmp($configs[$j],'browserSet')==0){
        $config[$configs[$j]] = $configs[$j + 1];
//    }

}
report();

$dom = new DOMDocument('1.0', 'utf-8');
$testsuites = $dom->appendChild($dom->createElement('testsuites'));

foreach (Config::getBrowserSet($configBrowserSet) as $key => $value) {
    $file = "report_{$config['filter']}/$key.xml";
    if (!file_exists($file)) {
        echo "wait for report : $file\r\n<br />";
        return;
    }
    $xmlDoc = new DOMDocument('1.0', 'utf-8');
    $xmlDoc->load($file);
    $xmlDom = $xmlDoc->documentElement;
    //echo $xmlDom->nodeName;
    $testsuites->appendChild($dom->importNode($xmlDom, true));
}
$dom->save("report.xml");
$browserNum = count(Config::getBrowserSet($configBrowserSet));
require_once 'record.php';
record();

Config::StopAll();
?>