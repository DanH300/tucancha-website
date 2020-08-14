<?php defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/libraries/REST_Controller.php';

class Account extends REST_Controller{
    function __construct(){

        parent::__construct();
        $this->load->model("account_model");
        $this->load->library('session');
    }
    function register_post(){
        $data = $this->post();
		if (!isset($data['country'])) $data['country'] = '';
		 $this->response($this->account_model->register($data['email'], $data['password'], $data['first_name'],$data['last_name'], $data['dni'], $data['country']),200);
    }

    function get_current_get(){
		$profile_id = $this->session->userdata('profile_id');
		$token= $this->session->userdata('login_token');
		if(isset($profile_id->code))
			$this->response($profile_id,200);
	//	debug($this->account_model->get_profile($token, $profile_id));
		$this->response($this->account_model->get_profile($token, $profile_id)->content, 200);
	}

// Application functions
    function get_profile_by_token_get () {
		$data = $this->get();
		$profile = $this->account_model->get_profile($data['token'], $data['id'])->content;
		$this->response($profile, 200);
	}

    function get_self_id_get () {
        $data = $this->get();
        $result = $this->account_model->get_self_id($data['token']);
        $this->response($result, 200);
    }

    function update_profile_mobile_post(){
		$data = $this->post('user');
		$token = $this->post('token');
		// $data = (object)$data;
		// debug($data);
		// debug($data, $token);
		$this->response($this->account_model->update_profile_mobile($data['_id'], $data, $token),200);

	}

    function fb_login_post(){
        $data = $this->post();
        $appVersion = isset($data['app_version'])? $data['app_version'] : "";
        $osName = isset($data['os_name'])? $data['os_name'] : "";
        $osVersion = isset($data['os_version'])? $data['os_version'] : "";
        $row = $this->account_model->fb_login($data['fb_id'], $data['fb_data'], $data['geocode'], $data['country_name'], $data['user_ip'], $data['device_id'], $data['device_name'], $appVersion, $osName, $osVersion);
        $this->response($row, 200);
    }

    function get_ppv_get(){
        $data = $this->account_model->get_ppv();
         $this->response( $data, 200);
    }

    function logout_post(){
        $data = $this->post();
        $token = $data['token']? $data['token'] : null;
        $this->response($this->account_model->logout($data['deviceId'],$data['token']),200);
    }

    function login_user_post(){
        $data = $this->post();
        error_log("el Data ". json_encode($data));
        $row = $this->account_model->login($data['email'], $data['password'], false, $data['geocode'], $data['country_name'], $data['user_ip'], $data['device_id'], $data['device_name']);

        if($data["remember"]){
            // $this->session->sess_expiration = 86400000;
            // $this->session->sess_expire_on_close = FALSE;
        }
        $this->response($row, 200);
    }

    function login_device_post(){
        $data = $this->post();
        $row = $this->account_model->login_device($data['device_id'], $data['device_name'], $data['username'], $data['password']);

        $this->response($row, 200);
    }

    function link_facebook_post(){
        $data = $this->post();
        $this->response($this->account_model->link_facebook($data['email'], $data['password']), 200);
    }

    function upload_profile_pic_post(){
        $file = $_FILES;

        $this->response($this->account_model->upload_profile_pic($file),200);
    }

    function update_profile_post(){
        $data = $this->post();
//debug($data);
        $this->response($this->account_model->update_profile($data["_id"],$data),200);
    }

    function update_user_post(){
        $post = $this->post();
        $id = $post['id'];
        $data = $post['data'];
        $this->response($this->account_model->update_user_raw($id,$data),200);
    }


    function delete_device_post(){
        $data = $this->post();
        $deviceId = $data['deviceId'];
        if(isset($data['token']) && $data['token']){
            $token = $data['token'];
        }else{
            $token= $this->session->userdata('login_token');
        }  
        // debug($devideId);
        $this->response($this->account_model->delete_device($deviceId, $token),200);
    }

    function change_password_post(){
        $data = $this->post();
        $this->response($this->account_model->change_password($data['email'], $data['old_password'], $data['new_password']),200);
    }

    function tvod_subscribe_post(){
        $data = $this->post();
        $id = $data['id'];
        $billing = $data['billing'];
        $this->response($this->account_model->tvod_subscribe($billing, $id),200);
    }

    function subscribe_post(){
        $data = $this->post();
        $id = $data['id'];
        $billing = $data['billing'];
        $this->response($this->account_model->subscribe($billing, $id),200);
    }

    function subscribe_mobile_post(){
        $data = $this->post();

        $this->response($this->account_model->subscribe_mobile($data),200);
    }

    function tvod_subscribe_mobile_post(){
        $data = $this->post();

        $this->response($this->account_model->tvod_subscribe_mobile($data),200);
    }

    function submit_campaign_post(){

        $id = $this->post('subscription_id');
        $data = $this->post('shipping');
        //debug($shipping);
        $this->response($this->account_model->submit_campaign($id,$data),200);
    }

    function subscribe_existing_cc_post(){
        $data = $this->post();
        $id = $data['id'];
        $this->response($this->account_model->subscribe_with_existing_cc($id),200);
    }

    function subscribe_wallet_post(){
        $data = $this->post();
        $id = $data['id'];
        $this->response($this->account_model->subscribe_with_wallet($id),200);
    }

    function buy_with_wallet_post(){
        $data = $this->post();
        $id = $data['id'];
        $this->response($this->account_model->buy_with_wallet($id),200);
    }

    function tvod_subscribe_existing_cc_post(){
        $data = $this->post();
        $id = $data['id'];
        $this->response($this->account_model->tvod_subscribe_with_existing_cc($id),200);
    }

    function cancel_subscription_post(){
        $data = $this->post();
        $subscription_id = $data['subscription_id'];
        $this->response($this->account_model->cancel_subscription($subscription_id),200);
    }

    function cancel_subscription_mobile_post(){
        $data = $this->post();
        $subscription_id = $data['subscription_id'];
        $token = $data['token'];
        $id = $data['profile_id'];
        $this->response($this->account_model->cancel_subscription_mobile($subscription_id, $token, $id),200);
    }

    function get_subscription_plans_get () {
        $this->response($this->account_model->get_all_subscriptions(), 200);
    }
    
    function get_last_contract_get () {
        $this->response($this->account_model->get_last_contract(), 200);
    }

    function createRequest_get () {
        $id = $this->get('plan');
        $this->response($this->account_model->createRequest($id), 200);
        
    }

    function get_wallet_get () {
        $id = $this->get('userId');
        $this->response($this->account_model->get_wallet($id), 200);
        
    }

    function get_customer_orders_post() {
        $token = $this->post('token');
        $this->response($this->account_model->get_customer_orders($token), 200);
        
    }

    function checkPayP2P_post () {
        $requestId = $this->post('requestId');
        $this->response($this->account_model->checkPayP2P($requestId), 200);
        
    }
    function getAllP2PPay_post () {

        $this->response($this->account_model->getAllP2PPay(), 200);
        
    }

    public function p2p_webhook_post(){
        $data = $this->post();
        $this->response($this->account_model->webhook_p2p($data), 200);
    }
    
    function getProfile_get(){
        $user_id = $this->session->userdata('profile_id');
        $token = $this->session->userdata('login_token');
        if($token){
            $this->response($this->account_model->get_profile($token, $user_id)->content);
        }
    }

    function send_password_email_get(){
        $email = $this->get('email');
        $this->response($this->account_model->send_password_email($email),200);

    }

    function get_user_notifications_get(){
        $this->response($this->account_model->get_user_notifications(),200);
    }

    function mark_notifications_as_read_post(){
        $data = $this->post();
        $this->response($this->account_model->mark_notifications_as_read($data),200);
    }

    public function edit_billing_information_post() {

        $row =$this->account_model->edit_billing_information($data = $this->post("billing"));
        $status = 200;
        if($row->error){
            $status = 400;
        }
        $this->response($row,$status);
    }

    public function add_billing_information_post() {
        $row = $this->account_model->add_billing_information($this->post("billing"));
        $status = 200;
        if($row->error){
            $status = 400;
        }
        $this->response($row,$status);
    }

    public function check_devices_post() {
        
        $device_id = $this->post("device_id");
        $device_name = $this->post("device_name");
        $user_id = $this->post("userId");
        $token = $this->post("userId")? $this->post("userId") : null;
        
        $row = $this->account_model->check_devices($device_id, $device_name, $user_id, $token);
        $status = 200;
        
        if($row->error){
            $status = 400;
        }
        $this->response($row,$status);
    }

    public function delete_credit_card_get() {
        $id = $this->get('id');
        $this->response($this->account_model->delete_credit_card($id),200);
    }

    public function get_user_clips_post(){
        
        $user_id = $this->post('userId');
        $size = $this->post('size');
		$page = $this->post('page');
		$sort = $this->post('sort');
		$order = $this->post('order');
        $filters = $this->post('filters');
        
        $this->response($this->account_model->get_user_clips($user_id, $page, $size, $sort, $order, $filters),200);
    }

    public function get_wallet_transactions_post(){
        
        $user_id = $this->post('userId');
        $size = $this->post('size');
		$page = $this->post('page');
		$sort = $this->post('sort');
		$order = $this->post('order');
        $filters = $this->post('filters');
        
        $this->response($this->account_model->get_wallet_transactions($user_id, $page, $size, $sort, $order, $filters),200);
    }

    public function refresh_pixellot_token_get(){
        $token = $this->get('token');
        $this->response($this->account_model->get_user_pixellot_token($token),200);
    }

}
