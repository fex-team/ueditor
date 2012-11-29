<?php
//获取两个目录下的相同路径的文件数
function getSameFile($src, $test, $path=''){
	$result = array();
	$as = listFile($src.$path);
	$ts = listFile($test.$path);
	$ds = array_intersect($as, $ts);
	foreach($ds as $item){
		$si = $src.$path.$item;
		$ti = $test.$path.$item;
		if(is_dir($si) && is_dir($ti)){
			$result = array_merge($result, getSameFile($src, $test, $path.$item.'/'));
		}else if(is_file($si) && is_file($ti)){
			if(substr($si, -3) == '.js')
			array_push($result, $path.$item);
		}
		else{
			//			print("error : $si");
		}
	}
	return $result;
}

//获取只在src中存在的文件，防止遗漏用例
function getSrcOnlyFile($src, $test, $path=''){
	$result = array();
	$as = listFile($src.$path);
	$ts = listFile($test.$path);
	foreach($as as $item){
		$si = $src.$path.$item;
		$ti = $test.$path.$item;
		if(is_dir($si) && is_dir($ti)){
			$result = array_merge($result, getSrcOnlyFile($src, $test, $path.$item.'/'));
		}else if(is_file($si) && !is_file($ti)){
			if(substr($si, -3) == '.js')
			array_push($result,$path.$item);
		}
		else{
			//			print("error : $si");
		}
	}
	return $result;
}

function listFile($dir){
	$as = array();
	if($dh = opendir($dir)){
		while(($file = readdir($dh))!==false){
			if(substr(basename($file), 0, 1) == '.')
			continue;
			array_push($as, basename($file));
		}
		closedir($dh);
	}
	return $as;
}
?>