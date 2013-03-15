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
			$browser = $testResult['browserInfo'];
			$host = $testResult['hostInfo'];
			$caseName = $testResult['name']; //得到用例名称
			settype($caseName, "string"); //$caseName本来类型为object，需要做转换
			$fail = $testResult['failNumber'];
			$total = $testResult['totalNumber'];
			$cov = $testResult['cov'];
			settype($browser, "string");
			settype($host, "string");
			settype($fail, "string");
			settype($total, "string");
			settype($cov, "float");

			if (!array_key_exists($caseName, $caseList)) { //如果这个用例不存在
				$caseInfo = array (
					'hostInfo' => $host,
					'fail' => $fail,
					'total' => $total,
					'cov' => $cov
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
						'cov' => $cov
					);
					//					$caseList[$caseName]['totalCov'] = $totalCov;
				} else {
					$foundBrowser = $foundCase[$browser]; //有这个浏览器
					array_push($foundBrowser, array (
						'hostInfo' => $host,
						'fail' => $fail,
						'total' => $total,
						'cov' => $cov
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
?>