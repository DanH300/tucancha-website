<?php defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/libraries/REST_Controller.php';

class Epg extends REST_Controller{
	function __construct(){
		parent::__construct();
	
		//$this->load->model('tips');
		$this->load->model('live_model');
		$this->load->model('fastcache_model');
	}

	function get_epg_by_id_get () {
		$channel = $this->get("id");
		// debug($channel);
		$time = time();
		$length = 10;
		header("Cache-Control: max-age=600");
		if ($this->fastcache_model->get_cache('get_epg_by_id'.$channel."length".$length)){

			$data = $this->fastcache_model->get_cache('get_epg_by_id'.$channel."length".$length);
		}

		else{
	
			$data = $this->live_model->get_epg($time, $length, $channel);
			$this->fastcache_model->set_cache('get_epg_by_id'.$channel."length".$length, $data);
		}

		$this->response( $data, 200);
	}
	function get_epg_timeline_by_id_get () {
		$channel = $this->get("id");
		$time = time()-1800;
		$length = 10;
		header("Cache-Control: max-age=600");
		if ($this->fastcache_model->get_cache('get_epg_timeline_by_id'.$channel."length".$length)){
			$data = $this->fastcache_model->get_cache('get_epg_timeline_by_id'.$channel."length".$length);
	
		}
		else{

			$data =  $this->live_model->get_epg_timeline($time, $length, $channel);
			$this->fastcache_model->set_cache('get_epg_timeline_by_id'.$channel."length".$length, $data);
		}

		$this->response( $data->content->entries, 200);
	}

	function get_epg_catch_up_by_id_get () {
		$channel = $this->get("id");
		$time = time()-36000;
		$length = 10;
		header("Cache-Control: max-age=600");
		if ($this->fastcache_model->get_cache('get_epg_catch_up_by_id_get'.$channel."length".$length)){
			$data = $this->fastcache_model->get_cache('get_epg_catch_up_by_id_get'.$channel."length".$length);
			
		}
		else{
			
			$data =  $this->live_model->get_epg_timeline($time, $length, $channel);
			$this->fastcache_model->set_cache('get_epg_catch_up_by_id_get'.$channel."length".$length, $data);
		}

		$this->response( $data->content->entries, 200);
	}


	function get_epg_data_get () {
		$time = time();
		header("Cache-Control: max-age=600");
		if ($this->fastcache_model->get_cache('get_epg_data'))
			$data = $this->fastcache_model->get_cache('get_epg_data');
		else{
			$data =  $this->live_model->get_epg_data($time);
			$this->fastcache_model->set_cache('get_epg_data', $data);
		}

		$this->response( $data, 200);
	}
}
