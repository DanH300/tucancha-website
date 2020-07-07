<?php
require_once("application/models/phpfastcache/phpfastcache.php");
// Config constants
//define('ENVIRONMENT', read_config_var('UVOD_ENVIRONMENT'));
define('ENVIRONMENT', read_config_var('ENVIRONMENT'));
define('UVOD_CONFIG', read_config_var('UVOD_CONFIG'));
define('UVOD_API_USER', read_config_var('UVOD_API_USER'));
define('UVOD_API_PASSWORD', read_config_var('UVOD_API_PASSWORD'));
define('UVOD_API_ENDPOINT', read_config_var('UVOD_API_ENDPOINT'));
define('UVOD_THEME', read_config_var('UVOD_THEME'));
define('FACEBOOK_APP_ID', read_config_var('FACEBOOK_APP_ID'));
define('FACEBOOK_APP_SECRET', read_config_var('FACEBOOK_APP_SECRET'));
define('GA_CODE', read_config_var('GA_CODE'));
// define('VERSION_NUMBER', read_config_var('VERSION_NUMBER'));
define('AS_SPARX_URL', read_config_var('AS_SPARX_URL'));

function read_config_var($variable) {

	$ret = '';

	if (file_exists('env.ini')) {
		$env_array = parse_ini_file("env.ini");
		if (isset($env_array[$variable])) $ret = $env_array[$variable];
	}

	if (!$ret) {
		if (getenv($variable) === false) {
			die('Invalid configuration. ' . $variable . ' not set.');
		} else {
			$ret = getenv($variable);
		}
	}

	return $ret;
}

function read_config_var_sql($variable) {
	$config = get_env_ini();
	$variable = strtolower($variable);
	if(!$config || !isset($config->$variable)){
		die('Invalid configuration. ' . $variable . ' not set.');
	}
	return $config->$variable;
}


function get_env_ini() {
	$url = $_SERVER['HTTP_HOST'];
	$id = $url . '_config';
	$cache = phpFastCache();
	$config = $cache->get($id);
	if($config){
		return $config;
	}		
	$db = new PDO('mysql:host=db;dbname=uvod','root','password');
	$query = $db->prepare("SELECT * FROM uvod_portal WHERE url=:url");
	$query->bindParam(":url",$url);
	$query->execute();
	$config = $query->fetch(PDO::FETCH_OBJ);
	if($config){
		$cache->set($id,$config,86400);
	}
	return $config;
}

?>
