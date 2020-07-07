<?php defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/libraries/REST_Controller.php';

class Cache extends REST_Controller{
	function __construct(){
		parent::__construct();
		$this->load->model("fastcache_model");
	}


    function clear_cache_get(){

		$this->fastcache_model->clean_cache();

        $response = "Cache Has Been Cleared Successfully";
		$this->response( $response , 200);
    }



}
