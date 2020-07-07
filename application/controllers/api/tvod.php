<?php defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/libraries/REST_Controller.php';

class Tvod extends REST_Controller{
	function __construct(){
		parent::__construct();
	
		$this->load->model('tvod_model');
		$this->load->model('fastcache_model');
		$this->load->model("account_model");
	}

	function clips_get () {
		header("Cache-Control: max-age=600");

		$ids = $this->get("ids");
		$page = $this->get("page");
		$size = $this->get("size");
		$sort = $this->get("sort");
		$order = $this->get("order");

		if ($data = $this->fastcache_model->get_cache('clips:index:ids='.$ids.':page='.$page.':size='.$size.':sort='.$sort.':order='.$order))
			$this->response($data, 200);

		$data = $this->tvod_model->clips($ids, $page, $size, $sort, $order);

		$this->fastcache_model->set_cache('clips:index:ids='.$ids.':page='.$page.':size='.$size.':sort='.$sort.':order='.$order, $data);

		$this->response($data, 200);
	}

	function shows_get () {
		header("Cache-Control: max-age=600");

		$ids = $this->get("ids");
		$page = $this->get("page");
		$size = $this->get("size");
		$sort = $this->get("sort");
		$order = $this->get("order");

		if ($data = $this->fastcache_model->get_cache('shows:index:ids='.$ids.':page='.$page.':size='.$size.':sort='.$sort.':order='.$order))
			$this->response($data, 200);

		$data = $this->tvod_model->shows($ids, $page, $size, $sort, $order);

		$this->fastcache_model->set_cache('shows:index:ids='.$ids.':page='.$page.':size='.$size.':sort='.$sort.':order='.$order, $data);

		$this->response($data, 200);
	}

	function featured_get () {
		header("Cache-Control: max-age=600");

		$page = 0;
		$size = 10;
		$sort = 'added';
		$order = 'DESC';

		$asset_type = $this->get("asset_type");

		if(!$asset_type)
			$asset_type = "Poster F";

		if ($data = $this->fastcache_model->get_cache('tvod:featured:page='.$page.':size='.$size.':sort='.$sort.':order='.$order.'asset_type='.$asset_type))
			$this->response($data, 200);

		$data = $this->tvod_model->featuredTvod($asset_type,$page, $size, $sort, $order);

		$this->fastcache_model->set_cache('tvod:featured:page='.$page.':size='.$size.':sort='.$sort.':order='.$order.'asset_type='.$asset_type, $data);

		$this->response($data, 200);
	}

	function item_get () {
		header("Cache-Control: max-age=600");

		$id = $this->get("id");

		$plans = $this->get("plans");
	
		if(!$id)
			$this->response("id field is mandatory", 400);

		if ($data = $this->fastcache_model->get_cache('tvod:item:id='.$id.':plans='.$plans))
			$this->response($data, 200);

		$data = $this->tvod_model->get_by_id($id, $plans);

		$this->fastcache_model->set_cache('tvod:item:id='.$id.':plans='.$plans, $data);

		$this->response($data, 200);
	}

	function tvod_item_post () {
		header("Cache-Control: max-age=600");

		$id = $this->post("id");

		$plans = $this->post("plans");
	
		if(!$id)
			$this->response("id field is mandatory", 400);

		if ($data = $this->fastcache_model->get_cache('tvod_item:item:id='.$id.':plans='.$plans))
			$this->response($data, 200);

		$data = $this->tvod_model->get_by_id($id, $plans);

		$this->fastcache_model->set_cache('tvod_item:item:id='.$id.':plans='.$plans, $data);

		$this->response($data, 200);
	}

	function send_tvod_email_post () {
		$data = $this->post();
		$row = $data['purchaseData'];
		$user = $data['user'];
		$tvod = $data['tvod'];
		$email = $user['username'];
		$subject = "Order Confirmation";
		$from_address = "noreply@shoott.com";
		$from_name = "Shoot Portal";
		$info = array();
		$info["name"] = $user['firstName'];
		$info["surname"] = $user['lastName'];
		$info["eventName"] = $row['content']['products'][0]['title'];
		$info["confirmation"] = $row['content']['_id'];
		$info["tvodtitle"] = $tvod["title"];

		if($user['transactionalPlans']){
			foreach ($user['transactionalPlans'] as $plan) {
			    if($plan['media_id'] == $row['content']['products'][0]['media_id'] && (strtotime("now")*1000) < $plan['contractEndDate'] ){
			    	$info["validUntil"] = date("d-m-Y", $plan['contractEndDate']/1000 );
			    }
                    
			}
		}
		// debug($info);
		$html = $this->load->view( 'templates/email_tvod', $info, TRUE);
		$this->account_model->send_single_email($email, $html, $subject, $from_address, $from_name);
	}


}
