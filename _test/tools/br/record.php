<?php
/**
 * 追加接口参数，支持过滤成功用例
 * @param unknown_type $onlyfails
 */
function interXML($onlyfails) {
	if(!file_exists('report.xml'))
	return array();
    $xmlFile = simpleXML_load_file("report.xml");
	$caseList = array ();
    foreach($xmlFile->testsuite as $testsuite){
		foreach ($testsuite->testcase as $testResult) {
			//			$totalCov = 0;
			$browser =strval( $testResult['browserInfo']);
			$host = strval($testResult['hostInfo']);
			$caseName = strval($testResult['name']);
			$fail = strval($testResult['failNumber']);
			$total = strval($testResult['totalNumber']);
			$cov = strval($testResult['cov']);
                        $recordCovForBrowser = strval($testResult['recordCovForBrowser']);
		if (!array_key_exists($caseName, $caseList)) { //如果这个用例不存在
				$caseInfo = array (
					'hostInfo' => $host,
					'fail' => $fail,
					'total' => $total,
					'cov' => $cov,
                    'recordCovForBrowser' => $recordCovForBrowser
				);
				//				$totalCov += $cov;
				$caseList[$caseName] = array (
				$browser => $caseInfo//,
				//				'totalCov'=>$totalCov
				);
				//				$caseList['totalCov'] = $totalCov;
			} else { //否则添加到相应的用例中去
				$foundCase = $caseList[$caseName]; //找到用例名称对应的array，$caseName为key
				if (!array_key_exists($browser, $foundCase)) { //如果没有该浏览器信息，则添加
					//					$totalCov += $cov;
					$caseList[$caseName][$browser] = array (
						'hostInfo' => $host,
						'fail' => $fail,
						'total' => $total,
						'cov' => $cov,
                        'recordCovForBrowser' => $recordCovForBrowser
					);
					//					$caseList[$caseName]['totalCov'] = $totalCov;
				} else {
					$foundBrowser = $foundCase[$browser]; //有这个浏览器
					array_push($foundBrowser, array (
						'hostInfo' => $host,
						'fail' => $fail,
						'total' => $total,
						'cov' => $cov,
                        'recordCovForBrowser' => $recordCovForBrowser
					));
				}
			}

		}
	}

	//根据需求添加仅记录失败情况的接口
	if($onlyfails){//如果仅考虑失败情况，此处根据用例情况过滤
		foreach($caseList as $name => $info){
			$all_success = true;//记录当前用例是否全部运行成功
			foreach($info as $b => $result){
				if($result['fail'] > 0)
				$all_success = false;//如果有失败情况则终止循环并进入下一个用例分析
				break;
			}
			//if($all_success) //如果全部通过则从记录中移除
			//unset($caseList[$name]);
		}
	}
	return $caseList;
}

function record()
{
//    require_once 'geneXML.php';
    /*如果全部运行完毕，发送邮件*/
    $kissList = interXML(false);
    require_once 'geneHTML.php';
    if (sizeof($kissList) > 0) {
        //针对kissList过滤，移除全部正确用例
        $html = geneHTML($kissList);
        $report = 'report.html';
	    $handle = fopen("$report", "w");
	    fwrite($handle, $html);
	    fclose($handle);
//        require_once 'geneHistory.php';
//        geneHistory($html);
    }
}
?>
