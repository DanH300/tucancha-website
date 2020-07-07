<?php

defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/libraries/REST_Controller.php';

class Vod extends REST_Controller{
	function __construct(){
		parent::__construct();
		
		$this->load->model('live_model');
		$this->load->model('vod_model');
		$this->load->model("account_model");
		$this->load->model('config_model');
		$this->load->model("vod_item_model");
		$this->load->model('search_model');
		$this->load->library('session');
		$this->load->model('fastcache_model');

	}
	

	function get_video_by_id_get () {
		
		$id = $this->get("id");
		header("Cache-Control: max-age=600");

		$data = $this->vod_item_model->get_by_id($id);

		$this->response( $data, 200);
	}

	public function get_items_by_media_type_post(){

		header("Cache-Control: max-age=600");

		$media_type = $this->post('media_type');
		$size = $this->post('size');
		$page = $this->post('page');
		$sort = $this->post('sort');
		$order = $this->post('order');
		$custom_filter = $this->post('custom_filter');
		
		$filters = new stdClass();
		$filters->media_type = $media_type;

		if($custom_filter && $custom_filter !== ""){
			foreach ($custom_filter as $key => $value) {
				$filters->$key = $value;
			}
		}
		
		$data = $this->vod_model->list_items( $page, $size, $sort, $order, $filters);

	   	$this->response( $data, 200);

	}

	function get_slider_get () {
		
		header("Cache-Control: max-age=600");
	
		$data = $this->vod_model->get_slider();

		$this->response( $data, 200);
	}

	function get_main_menu_get () {

		header("Cache-Control: max-age=600");

		$filters = new stdClass();
		$filters->media_type = "identity,identity_item,activity,activity_item";

		$data = $this->vod_model->list_items("0", 200, "media_type", "-1", $filters );
		$menu = array();

	
		//Get an array with identities and activities
		for ($i=0; $i < sizeof($data); $i++) {
			if($data[$i]["media_type"] == "identity" || $data[$i]["media_type"] == "activity"){
				array_push($menu, $data[$i]);
			} 	
		}

		//Sort the data array by title
		function cmp($a, $b) {
			return strcmp($a["title"], $b["title"]);
		}	
		usort($data, "cmp");

		//Insert the identity items and activity items into menu array
		for ($i=0; $i < sizeof($data) ; $i++) { 
			if($data[$i]["media_type"] == "identity_item" || $data[$i]["media_type"] == "activity_item"){
				
				for ($d=0; $d < sizeof($menu); $d++) { 
					
					if(($data[$i]["media_type"] == "identity_item" && $data[$i]["identityId"] == $menu[$d]["_id"]) ||
					($data[$i]["media_type"] == "activity_item" && $data[$i]["activityId"] == $menu[$d]["_id"])){
						
						if(!isset($menu[$d]["items"])){
							$menu[$d]["items"] = array();
						}
						array_push($menu[$d]["items"], $data[$i]);
						break;
					}
				}
				
			} 	
		}
	
		$this->response( $menu, 200);
	}

	function get_related_by_id_get () {
		
		$id = $this->get("id");
		$data = $this->vod_item_model->get_related_items($id);

		$this->response( $data, 200);

	}

	function get_by_featured_category_get () {
		
		header("Cache-Control: max-age=600");

		$category = $this->get("category");
		$page = $this->get("page");

		$filters = new stdClass();
        $filters->featured_category = $category;
        $filters->media_type = "clip";

 		$data = $this->vod_model->list_items($page, '4', 'aired_date', "desc", $filters);
 			
 		$this->response( $data, 200);
	}


	function get_categories_get () {

		header("Cache-Control: max-age=600");
		if ($this->fastcache_model->get_cache('get_categories')){

		   $data = $this->fastcache_model->get_cache('get_categories');
                }
	   else{
		   $data = $this->config_model->get_vod_categories()->content;
		   $this->fastcache_model->set_cache('get_categories', $data);
	   }

	   $this->response( $data, 200);

	}

	public function get_identity_videos_post () {

		header("Cache-Control: max-age=600");
		
		$data = $this->post();
		$identity = $data["identity"];
		$identityItem = $data["identityItem"];
		$filters = $data["filters"];
		$page = $data["page"];

		if($data["from"] && $data["to"])
            $date = $data["from"] . "~" . $data["to"] ;
        else if ($data["from"])
            $date = $data["from"] . "~";
        else if ($data["to"])
			$date = "~" . $data["to"];
		
	    $media_type = null;
		if($data['media_type']){
			$media_type = $data['media_type'];
		}	
	   
		$data = $this->vod_model->get_videos_by_identity($identity, $identityItem, $filters, $page, $date, $media_type);
		   
		$this->response( $data, 200);
	}

	public function get_activity_videos_post () {
		header("Cache-Control: max-age=600");
		
		$data = $this->post();
		$activity = $data["activity"];
		$activityItem = $data["activityItem"];
		$filters = $data["filters"];
		$page = $data["page"];

		if($data["from"] && $data["to"])
            $date = $data["from"] . "~" . $data["to"] ;
        else if ($data["from"])
            $date = $data["from"] . "~";
        else if ($data["to"])
			$date = "~" . $data["to"];
			
		$media_type = null;
		if($data['media_type']){
			$media_type = $data['media_type'];
		}	
   
		$data = $this->vod_model->get_videos_by_activity($activity, $activityItem, $filters, $page, $date, $media_type);   

	   $this->response( $data, 200);
	}


	public function get_tournament_videos_post () {
		header("Cache-Control: max-age=600");
		
		$data = $this->post();
		$tournament_id = $data["tournament_id"];
		$filters = $data["filters"];
		$page = $data["page"];

		if($data["from"] && $data["to"])
            $date = $data["from"] . "~" . $data["to"] ;
        else if ($data["from"])
            $date = $data["from"] . "~";
        else if ($data["to"])
			$date = "~" . $data["to"];
		
	    $media_type = null;
		if($data['media_type']){
			$media_type = $data['media_type'];
		}	
		   
		$data = $this->vod_model->get_tournament_videos($tournament_id, $filters, $page, $date, $media_type);   

	   $this->response( $data, 200);
	}

	public function get_watchlist_get(){
		$data = array();
        $data['id'] = $this->session->userdata('profile_id');
        $data['token'] = $this->session->userdata('login_token');
		$this->response($this->vod_model->get_watchlist($data), 200);
	}

	public function get_watchlist_mobile_get(){
		$data = array();
        $data['id'] = $this->get("profileId");
        $data['token'] = $this->get("token");
		$this->response($this->vod_model->get_watchlist($data), 200);
	}


	public function add_to_watchlist_post(){
		$data = array();
		$id = $this->session->userdata('profile_id');
        $data['token'] = $this->session->userdata('login_token');
        $data['id'] = $id;
        $data['video_id'] = $this->post('video_id');
		$user_data = $this->vod_model->add_to_watchlist($data);

		$this->response($user_data, 200);
	}

	public function add_to_watchlist_mobile_post(){
		$data = array();
        $data['token'] = $this->post('token');
        $data['id'] = $this->post('profileId');
        $data['video_id'] = $this->post('video_id');
		$user_data = $this->vod_model->add_to_watchlist($data);
		if(!$user_data->error){
			$user_data = $this->account_model->get_profile($this->session->userdata('login_token'), $id);
		}
		$this->response($user_data, 200);
	}

	public function remove_from_watchlist_post(){
		$data = array();
		$id = $this->session->userdata('profile_id');
        $data['token'] = $this->session->userdata('login_token');
        $data['id'] = $id;
        $data['video_id'] = $this->post('video_id');
		$user_data = $this->vod_model->remove_from_watchlist($data);
	
		$this->response($user_data, 200);
	}

	public function remove_from_watchlist_mobile_post(){
		$data = array();
        $data['token'] = $this->post('token');
        $data['id'] = $this->post('profileId');
        $data['video_id'] = $this->post('video_id');
		$user_data = $this->vod_model->remove_from_watchlist($data);
		if(!$user_data->error){
			$user_data = $this->account_model->get_profile($this->session->userdata('login_token'), $id);
		}
		$this->response($user_data, 200);
	}

	public function search_post(){

		$data = array();

		$data["title"] = $this->post("keyword");

		// true means search title & description fields , flase means search only by Title
		$data["expanded_search"] = true;
	   	$data = $this->search_model->search_vod($data);

	   	$this->response($data, 200);
	}
}
