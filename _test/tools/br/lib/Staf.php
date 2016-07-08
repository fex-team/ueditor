<?php
include 'StafResult.php';

class Staf{
	public static function handle($src, $cmd, $host='local'){
		$_cmd = "/usr/local/staf/bin/"."staf $host $src $cmd";

		//print $_cmd;
        echo "wangnew2---".$_cmd."\n";
        echo "wangold2---".$back."\n";
		$wand = exec($_cmd, $back);
//        exec("/usr/local/staf/bin/STAF 10.94.26.95 PROCESS START COMMAND notepad");
        echo "+-".$back."-+";
        var_dump($back);
        echo $wand."\n";
		return StafResult::parse($back);
	}

	public static function process($cmd, $host='local'){
		return self::handle('process', $cmd, $host);
	}

	/**
	 * START [SHELL [<Shell>]] COMMAND <Command> [PARMS <Parms>]
	 * @param $path
	 * @param $params
	 * @param $host
	 */
	public static function process_start($path, $params, $host='local', $wait=false){
		$cmd = "start shell command \\\"\"$path\"\\\" parms \\\"\"$params\"\\\"";
		if($wait){
			$cmd.=" wait returnstdout returnstderr";
		}
		return self::process($cmd, $host);
	}

	/**
	 * STOP  <ALL CONFIRM | WORKLOAD <Name> | HANDLE <Handle>> [USING <Method>]
	 * @param unknown_type $handle
	 * @param unknown_type $host
	 */
	public static function process_stop($handle, $host='local', $all=0){
		$cmd = $all ? "STOP ALL CONFIRM":"STOP HANDLE $handle";		
		return self::process($cmd, $host);
	}

	public static function queryHandle($browser){
		$filename = "temp\\$browser";		
		if(file_exists($filename)){
			$handle = file_get_contents($filename);				
			delete($filename);
			return $handle;
		}
		return false;
	}

	public static function saveHandle($browser){
		$filename = "temp\\$browser";
		$fp = fopen($filename, 'w');
		fwrite($fp, 'test');
		fclose($fp);
	}
}
?>