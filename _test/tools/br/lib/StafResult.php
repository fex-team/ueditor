<?php

class StafResult{
	public $rc;
	public $info;

	public function StafResult($rc, $info){
		$this->rc = $rc;
		$this->info = $info;
	}

	public function __toString()
	{
		return "return code : ".$rc.", return info : ".$info."\n";
	}

	public static function parse($result){
		return new StafResult(0, $result);
	}
}?>