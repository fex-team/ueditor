<?php
/**
 * 使用注意事项：一般情况下不会所产生的测试结果表格内容不会有问题，
 * 问题的引入是没有对每次添加的数据做浏览器判断，在正常情况下浏览器的顺序恒定不变的
 * 当不同浏览器运行的测试内容不同的情况下，如ie8下采用filter=baidu.fx，
 * 而chrome下采用filter=baidu.fx.collaplse
 * 在添加浏览器的时候按照顺序会先添加chrome，再添加ie8
 * 那么当chrome下用例只有baidu.fx.collapse的时候，
 * 由于他会默认先找到的浏览器为chrome，那么与它相邻的ie8的baidu.fx.current的内容会左移到chrome下。
 * 这个跟存储数据的格式有关系：caseList
 * 							/         \
 *               baidu.fx.collapse    baidu.fx.current
 *              /           \             /            \
 *          chrome          ie8         null           ie8
 *         /  |  \         / |  \    (supposed       /   |  \
 *    fail  total hostInfo          to be chrome)  fail total hostInfo
 *
 *
 *
 * 不直接使用<style type ="text/css">来设置css是因为有的邮件客户端会过滤这样的信息
 *
 * ***/
function geneHTML($caseList, $name=''){
	date_default_timezone_set('PRC');
//	$url = (isset ($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '') . $_SERVER['PHP_SELF'];
    $url ="";
	$html = "<!DOCTYPE><html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
<style>td, th {border: 1px solid black;}</style></head><body><div>
<h2 align='center'>自动化用例测试结果".date('Y-m-d H:i:s')."</h2>
<a href='http://$url/../../../../report/base/$name' style='font:normal bolder 12pt Arial' title='效果应该比邮件好'>网页版</a>
<table align='center' cellspacing='0' style='font:normal bolder 12pt Arial;border: 1px solid black; color: #000000; background-color: #F0FFFF; text-align: center;'>
<tr><th colspan='16'>fail的用例统计</th></tr><tr><th rowspan='2'>用例名称</th>".getTrCase($caseList,true,1)."</table><p><br/></p>
<table align='center' cellspacing='0' style='font:normal bolder 12pt Arial;border: 1px solid black; color: #000000; background-color: #F0FFFF; text-align: center;'>
<tr><th colspan='17'>全部用例统计</th></tr><tr><th rowspan='2'>用例名称</th>".getTrCase($caseList,false,1)."<tr><th colspan='17'>未覆盖到的用例</th></tr>".getTrCase($caseList,false,0)."</table></div></body></html>";
//  ."</table></div>"._srcOnlyList()."</body></html>"
	return $html;
}

/**
 * 创建遗漏用例列表
 * FIXME: 需要过滤package类型，考虑使用js名称同名目录存在进行过滤或者白名单
 */
function _srcOnlyList(){
	require 'case.class.php';
	$list = Kiss::listSrcOnly(false);
	$len = sizeof($list);
	$flag="<table cellspacing='0' style='border: 1px solid black; "
	."color: #fff; background-color: #0d3349; "
	."text-shadow: rgba(0, 0, 0, 0.5) 2px 2px 1px; "
	."text-align: center;'><thead><tr><th>遗漏列表：总计$len，未过滤无需用例的package类型</th></tr><tr><td>";
	$flag.=implode("</td></tr><tr><td>", $list);
	$flag.="</tr></table>";
	return $flag;
}

/**
 *
 * 根据实际浏览器书目确认生成表头
 * @param unknown_type $caseList
 */
function getThBrowser($caseList){
	//创建浏览器相关单元格
	$thBrowser = '';
	$count = 0;
	foreach ($caseList as $casename => $casedetail) {
		//每一个用例
		foreach ($casedetail as $b => $info) {
			$thBrowser .= "<th colspan='3'>$b</th>";
			$count++;
		}
		$thBrowser .="</tr><tr>";
		break;//遍历一次就知道所有浏览器的信息
	}
	for($index = 0; $index < $count; $index++) {
		$thBrowser .= "<td>cov</td><td>fail</td><td>total</td>";
	}

	return $thBrowser."</tr>";
}

/**
 *
 * 根据执行结果生成单元格信息
 * @param unknown_type $caseList
 */
function getTrCase($caseList,$onlyFail,$onlyCoverd){
//$onlyFail 为真时，只显示 fail 的用例
    //$onlyCoverd 为0时，只显示全浏览器覆盖率为0的用例;为1时，只显示全浏览器覆盖率不为0的用例；为其他时，显示所有的用例
	//创建case名对应的单元格
    $totalTrCase = '';
	require_once 'config.php';
    $rowColor = '#B0E0E6';//标记行的颜色，单双数行显示的背景颜色不同
	$numBro = count(Config::getBrowserSet($configBrowserSet));
    $averageCov = 0;//所有用例的全浏览器覆盖率的平均值（全浏览器覆盖率为0的不计）
    $numCov = 0;//全浏览器覆盖率不为0的用例数量
	foreach ($caseList as $casename => $caseDetail) {
		//每一个用例
        $ifFail = false;
		$cnurl = implode('.', explode('_', $casename));
		$trCase = '';
        $totalCov = calTotalCov($caseDetail,$numBro);
        $averageCov +=$totalCov;
        $numCov = $totalCov==0?$numCov:$numCov+1;
        if(($onlyCoverd==0&&$totalCov!=0)||($onlyCoverd==1&&$totalCov==0))//$onlyCoverd 为0时，只显示全浏览器覆盖率为0的用例;为1时，只显示全浏览器覆盖率不为0的用例；
            continue;
        if(!$onlyFail){//对于展示 fail 的用例的列表，不显示全浏览器覆盖率
		    $trCase .= "<td title='全浏览器覆盖率'>".$totalCov.($totalCov=="_"?"":"%")."</td>";
        }
		foreach ($caseDetail as $br => $infos) {
			//$b为browser名字,$info为详细信息
			$fail = $infos['fail'];
            $ifFail = $fail==0?$ifFail:true;
			$total = $infos['total'];
			$cov = $infos['cov'];
			$color = $fail == 0 ? $rowColor : '#CD5C5C';
            $PercentSign = $cov=='_'?'':'%';
			$trCase .= "<td style='background-color:".$color."'>".$cov.$PercentSign."</td><td style='background-color:".$color."'>".$fail."</td><td style='background-color:".$color."'>".$total."</td>";
        }
		$trCase ="<tr style='background-color:$rowColor'><td><a href='http://../run.php?case=$cnurl'>运行</a>$casename</td>".$trCase."</tr>";
        if(!$onlyFail||$ifFail){
            $totalTrCase =$totalTrCase.$trCase;
            $rowColor = $rowColor=='#F0FFFF'?'#B0E0E6':'#F0FFFF';
        }
        else;
	}
    $averageCov = number_format($averageCov/$numCov,1);
    if($onlyCoverd==0)
        $tableContent = $totalTrCase;
    elseif(!$onlyFail)
        $tableContent = "<th rowspan='2'>总覆盖率<br>(平均值：".$averageCov."%)</th>".getThBrowser($caseList).$totalTrCase;
    else
        $tableContent = getThBrowser($caseList).$totalTrCase;
	return $tableContent;
}

/**
 *
 * 计算总覆盖率信息
 * @param unknown_type $caseDetail
 * @param unknown_type $brcount
 */
function calTotalCov($caseDetail,$brcount){
    $length = -1;
    $num_statements = 0;
    $num_executed = 0;
    $totalInfo = null;//数组，记录全浏览器的覆盖情况，对文件中的每一行：覆盖为1，没覆盖为0，不计数为2
    $flag = 1;//$flag==-1时，各个浏览器覆盖率记录的文件信息有冲突，不能计算出全浏览器覆盖率（统计的文件长度不同/标记为2的不计入统计的行信息不同）
	foreach ($caseDetail as $caseInfo){
        //如果recordCovForBrowser为空，跳过这个$caseInfo
        if($caseInfo['recordCovForBrowser']==''){
            continue;
        }
        $infos = explode(',',$caseInfo['recordCovForBrowser']);

        $length = ($length==-1||$length==count($infos))?count($infos):-1;
        if($length==-1||$length!=count($infos))
            break;//统计的文件长度不同
        else
            ;
        if($totalInfo==null){
//            if(count($infos)==1){
//                $flag = 0;//没有覆盖率信息
//                break;
//            }
            for($i=0;$i<count($infos);$i++){
                $totalInfo[$i] = $infos[$i];

            }
        }
        else{
            for($i=0;$i<count($infos);$i++){

                if($totalInfo[$i]==2){
                    continue;
                }
                elseif($infos[$i]==2){
                    $flag  = -1;//标记为2的不计入统计的行信息不同
                    break;
                }
                elseif($totalInfo[$i]==0&&$infos[$i]==1){
                    $totalInfo[$i] = 1;
                }
                else;
            }
            if($flag==-1){
                break;
            }
	    }
    }
    if($flag==-1)//各个浏览器的统计信息有矛盾
        $totalCov = "fail";
    elseif($length==-1||$totalInfo==null)//没有覆盖率信息
        $totalCov = "_";
    else{
        for($i=0;$i<count($totalInfo);$i++){
            if($totalInfo[$i]==0)
                $num_statements++;
            elseif($totalInfo[$i]==1){
                $num_statements++;
                $num_executed++;
            }
            else;
        }
        $totalCov = number_format(100*($num_executed/$num_statements),1);
    }
	return $totalCov;
}

?>