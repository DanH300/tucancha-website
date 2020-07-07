<?php

class Ppv_events_model extends CI_Model {

    public function __construct() {
        $this->load->helper('uvod_api');
        $this->load->model('fastcache_model');
        $this->load->library('session');
        $this->load->model("account_model");
    }


    public function list_events($filters, $date = null) {

        $params = array();

        if($date){
            $filters->event_date = $date;
        }

        if($filters){
            $params["filters"] = $filters;
        }
     
        return apiPost("ppv/list", $params);

    }

    public function get_event_by_id($id) {

        $data = apiCall("ppv/get_event_by_id", array('id' => $id));

        if($data->content->entries){
            $data = $data->content->entries[0];
        }
        return $data;

    }


    public function subscription_checkout($data) {
        $user = $data['user'];
        $billing = $data['billing'];
        $parameters = array();
        $parameters['token'] = $this->session->userdata('login_token');
        $parameters['first_name'] = $billing['firstName'];
        $parameters['last_name'] = $billing['lastName'];
        $parameters['email'] = $user['email'];
        $parameters['country'] = $user['countryCode'];
        $parameters['product_id'] = $data['ticket']['_id'];
        $parameters['pi_month'] = $billing['pi_month'];
        $parameters['pi_year'] = $billing['pi_year'];
        $parameters['pi_type'] = $billing['pi_type'];
        $parameters['pi_number'] = $billing['pi_number'];
        $parameters['security_code'] = $billing['security_code'];
        $order = apiPost("ppv/event_subscription_checkout", $parameters);
        return $order;
    }

    public function subscription_mobile_checkout($data) {

        $parameters = array();
        $parameters['token'] = $data['token'];
        $parameters['product_id'] = $data['ticket_id'];
        $parameters['purchase_data'] = $data['purchase_data'];
        $parameters['platform'] = $data['platform'];
        

        if($data['purchase_data'] == "" || $data['purchase_data']["transactionId"] == "test ID")
            return null;

        $order = apiPost("ppv/event_subscription_mobile_checkout", $parameters);
        return $order;
    }

    public function send_single_email($email, $text, $subject, $from_address, $from_name) {
        try {
            $mandrill = new Mandrill('lwISZr2Z9D-IoPggcDSaOQ');
            $message = new stdClass();
            $message->html = $text;
            $message->subject = $subject;
            $message->from_email = $from_address;
            $message->from_name = $from_name;
            $message->to = array(array('email' => $email));

            $message->track_opens = true;
            $mandrill->messages->send($message);

            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    public function buy_event_by_stored_cc($data){
        $parameters['token'] = $this->session->userdata('login_token');
        $parameters['product_id'] = $data['ticket']['_id'];
        $parameters['email'] = $data['user']['email'];
        return apiPost("ppv/buy_event_by_stored_cc", $parameters);
    }

    function rows($data){
        $rows = array();
        
        foreach ($data as $media) {
            $categories = $media->categories;
            if($media->categories  && $media->categories[0] && ($media->categories[0]->name == 'none' || $media->categories[0]->name == '')){
                $categories = null;
            }

            $media->live_now = false;
            if($media->event_date){
                $now = intval(time() . "000");
                if($now >= $media->event_date){
                    $media->live_now = true;
                }
            }

            $tmp = array(
                    "media_type" => $media->media_type,
                    "keywords" => $media->keywords,
                    "vod_category"=> $media->vod_category,
                    "categories" => $categories,
                    "_id" => $media->_id,
                    "title" => 	$media->title,
                    "series_id" => 	$media->series_id,
                    "description" => $media->description,
                    "aired_date" => $media->aired_date,
                    "event_date" => $media->event_date,
                    "referenceId" => isset($media->reference_id)?$media->reference_id:null,
                    "activity" => isset($media->activity)?$media->activity:null,
                    "identities" => isset($media->identities)?$media->identities:null,
                    "eventTeams" => isset($media->eventTeams) ? $media->eventTeams : null,
                    "live_now" => $media->live_now



            );
            if($media->content){
                foreach ($media->content as $key => $file) {
                    $tmp[$key] = $file;
                  }  
              }

            $rows[] = $tmp;

        }
		return $rows;
	}

}

?>
