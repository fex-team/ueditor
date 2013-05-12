<?php
require_once 'config.php';
/**
 *
 * 分析源码引入及依赖关系，提供单次读取中的文件载入缓存 dfddf
 * @author yangbo
 *
 */
class Analysis{
	/**
	 * 缓存数据提高效率，c映射内容，i映射依赖列表，s映射缩略名称
	 * @var array
	 */
	static private $_cache = array();
	//static private $projpath = array();

	var $circle = array();

	public function Analysis(){
		$ss = explode('/', substr($_SERVER['SCRIPT_NAME'], 1));
		/*配置修改为使用Config.php中的配置, by bell 2011-3-25
		 * if(sizeof(self::$projpath) == 0){
			self::$projpath[0] = '../../../_src/';
			self::$projpath[1] = '../../../../tangram/src/';
			self::$projpath[2] = '../../../../base-me/src/';
			self::$projpath[3] = '../../../../Tangram-base/src/';
			//TODO : 项目路径提取方式应该考虑使用test切分，用于支持ui项目使用同一套框架
			}*/
	}

	/**
	 * 因测试需要更新的引入方法，domain支持多个通过,分割，支持第二参数忽略已经引入内容，递归判定跳过的入口必须提前
	 * @param $domain 期望载入的依赖库
	 * @param $exclude 期望排除的依赖库
	 * @param $parent 解决相互依赖问题
	 */
	public function get_import_srcs($domain, $recurse = true){
		if(Config::$DEBUG) var_dump("分析$domain");

		if(array_search($domain, $this->circle)) return array();//如果已经被分析过则直接返回
		array_push($this->circle, $domain);

		$include = array();
		$cnts = self::get_src_cnt($domain);
		$is = $cnts['i'];
		if(sizeof($is) > 0)
		foreach($is as $d){
			if($recurse)
			$include = array_merge($include, $this->get_import_srcs($d));
			else
			$include[$d] = self::$_cache[$d];
		}

		//因为依赖关系的前后联系，最后在include中加入当前domain
		if($recurse)
		$include[$domain] = $cnts['c'];
		return $include;
	}


	/**
	 * 读取源文件内容，支持缓存，支持覆盖率文件读取，覆盖率路径在Config中配置
	 * @param string $domain
	 * @see Config::$COVERAGE_PATH
	 */
	static function get_src_cnt($domain){
		new Analysis();
		if(!array_key_exists($domain, self::$_cache)){
			$cnt =''; $covcnt = '';
			//$path = join('/', explode('.', $domain)).'.js';  //为了支持xx.xx.js类型的文件名而修改 田丽丽
			//文件在当前项目存在则取当前项目，否则取tangram项目
			require_once 'config.php';
			foreach(Config::$SOURCE_PATH as $i=>$d){
				if(Config::$DEBUG)
				var_dump($d.$path);
				if(file_exists($d.$path)){
					$cnt = file_get_contents($d.$path);
					$cnt.="\n";//读取文件内容必须加个回车
					break;
				}
			}
			//尝试读取cov目录下的文件，如果不存在则忽略
			$covpath = Config::$COVERAGE_PATH.$path;
			if(file_exists($covpath)){
				if(Config::$DEBUG)var_dump($covpath);
				$covcnt = file_get_contents($covpath);
			}
			else $covcnt = $cnt;
			if($cnt == ''){
				if(Config::$DEBUG)
				print "fail read file : ".$path;
				return array('', array(), '');
			}

			if(Config::$DEBUG)
			print "start read file $domain<br />";

			$is = array();
			//正则匹配，提取所有(///import xxx;)中的xxx
			preg_match_all('/\/\/\/import\s+([^;]+);?/ies', $cnt, $is, PREG_PATTERN_ORDER);

			//移除//，顺便移除空行
			//			$cnt = preg_replace('/\/\/.*/m', '', $cnt);TODO:正则处理出现在“”或者正则中的//时出现问题
			//移除/**/
			//			$cnt = preg_replace('/\/\*.*\*\//sU', '', $cnt);

			self::$_cache[$domain] = array('c'=>$cnt, 'i'=>$is[1], 'cc'=>$covcnt);
		}
		return self::$_cache[$domain];
	}
}
?>
