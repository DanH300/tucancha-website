<?php defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/libraries/REST_Controller.php';

class Channel extends REST_Controller{
	function __construct(){
		parent::__construct();
		
		$this->load->model('live_model');
		$this->load->model('fastcache_model');
	}
	function get_all_channels_get () {
		header("Cache-Control: max-age=60");
		if ($this->fastcache_model->get_cache('get_all_channels')){
			$data = $this->fastcache_model->get_cache('get_all_channels');
		}
		else{
			$data = $this->live_model->list_channels();
			$this->fastcache_model->set_cache('get_all_channels', $data);
		}

		$this->response( $data, 200);
	}

}
