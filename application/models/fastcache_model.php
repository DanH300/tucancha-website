<?php

require_once("phpfastcache/phpfastcache.php");

class fastcache_model extends CI_Model {

    var $cache = '';

    public function __construct() {

//        $config = array("storage" => 'memcache', 'server' => array(array('mc4.dev.ec2.memcachier.com',11211)), "overwrite" => "files");
        phpFastCache::setup("storage", "files");

        $this->cache = phpFastCache();
    }

    public function get_cache($id) {

        // get data from cache
        $data = $this->cache->get($id);
        if (!$data) {
            $data = false;
        }
        return $data;
    }

    public function set_cache($id, $data, $expiration = null) {

        if ($expiration) {
            $cache_expiration = $expiration;
        } else {
            $cache_expiration = 600;
        }
        $this->cache->set($id, $data, $cache_expiration);
    }

    public function clean_cache() {
        error_log('entra a borrar el cache');
        $this->cache->clean();
    }

}
