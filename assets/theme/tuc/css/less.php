<?php
$arr = array();

define("ROOT_DIR", dirname(dirname(__FILE__)).'/../../../');
// echo ROOT_DIR;
set_time_limit(0);
require ROOT_DIR.'/application/libraries/less/Cache.php';
Less_Cache::$cache_dir = ROOT_DIR.'/assets/cache/';
require ROOT_DIR.'/application/libraries/less/Less.php';

$parser = new Less_Parser(array( 'compress'=>true ));
$parser->parseFile( ROOT_DIR."/assets/theme/tuc/css/main.less", "/assets/theme/tuc/css");

//$css_file_name = Less_Cache::Get( "/cache/" );
header("Content-type: text/css");

//$compiled = file_get_contents( '/var/www/writable_folder/'.$css_file_name );
die($parser->getCss());
//file_put_contents("/cache/a.css", $parser->getCss());
// echo $parser->getCss();




//echo $less->compileFile(ROOT_DIR."/assets/theme/clixtv/css/main.less");
