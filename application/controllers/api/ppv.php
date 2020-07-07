<?php defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/libraries/REST_Controller.php';

class PPV extends REST_Controller{
	function __construct(){
		parent::__construct();
		
		//$this->load->model('tips');
		$this->load->model('ppv_events_model');
		$this->load->model('fastcache_model');
		$this->load->model("account_model");
		$this->load->model("vod_item_model");
	}

	function get_event_list_post () {
		header("Cache-Control: max-age=60");

		$data = $this->post();
		$filters = $data["filters"];

		if($data["from"] && $data["to"])
            $date = $data["from"] . "~" . $data["to"] ;
        else if ($data["from"])
            $date = $data["from"] . "~";
        else if ($data["to"])
			$date = "~" . $data["to"];
			
		$cache_str = "";
		if($filters !== ""){
			$cache_str .= json_encode($filters);
		}	

		if($date !== ""){
			$cache_str .= $date;
		}

		$data = $this->ppv_events_model->list_events($filters, $date);
		$this->response( $data, 200);

	}
	
    function get_event_by_id_get () {
		$id = $this->get("id");
		header("Cache-Control: max-age=60");
	
		$data = $this->ppv_events_model->get_event_by_id($id);
		// debug(implode("|",$data->event_videos));
		$data->event_videos = $this->vod_item_model->get_items_data($data->event_videos);

		$this->response($data, 200);
	}

	function event_subscription_post(){
		$data = $this->post();
		$row = $this->ppv_events_model->subscription_checkout($data);

		$this->response($row, 200);
	}

	// token
	// product_id
	// payment_id"
	function event_subscription_mobile_post(){
		$data = $this->post();
		$row = $this->ppv_events_model->subscription_mobile_checkout($data);

		$this->response($row, 200);
	}

	function send_confirmation_email_post () {
		$data = $this->post();
		// debug($data);
		$row = $data['purchaseData'];
		$user = $data['user'];
		$email = $user['email'];
		$milliseconds =  $row['content']['products'][0]['added'];
		$timestamp = $milliseconds/1000;
		$subject = "Order Confirmation";
		$from_address = "noreply@shoott.com";
		$from_name = "Shoot Portal";
		$info = array();
		$info["name"] = $user['firstName'];
		$info["surname"] = $user['lastName'];
		$info["eventName"] = $row['content']['products'][0]['title'];
		$info["time"] = date("F j, Y, g:i a T", $timestamp);
		$info["confirmation"] = $row['content']['_id'];
		$html = $this->load->view( 'templates/email_ppv_purchase', $info, TRUE);
		$this->account_model->send_single_email($email, $html, $subject, $from_address, $from_name);
	}
	function buy_event_by_stored_cc_post(){
		$data = $this->post();
		$row = $this->ppv_events_model->buy_event_by_stored_cc($data);
		$this->response($row, 200);
	}

}
