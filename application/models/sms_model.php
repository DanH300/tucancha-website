<?php

require_once 'Mandrill.php';

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Sms_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->model("account_model");
        $this->token = "vV54I8FPrBcNkYsbjwOIH42VRMWT0fxquKQwpp3W";
    }

    public function validate_pin_and_save_phone($number,$phone){
        if($this->validate_pin($number)){
            $profile_id = $this->session->userdata('profile_id');
            // $token= $this->session->userdata('login_token');
            // $profile=$this->account_model->get_profile($token, $profile_id)->content;
            $profile["phone"] = $phone;
            //$profile=$this->account_model->get_profile($token, $profile_id);
            //$profile->content->phone = $phone;

            // debug($profile);
             $update_data = $this->account_model->update_profile($profile_id,$profile);
            return $update_data;
        }
        return false;
    }

    public function validate_pin_and_save_phone_mobile($number,$phone, $profile_id){
        if($this->validate_pin($number)){
            //$profile_id = $this->session->userdata('profile_id');
            // $token= $this->session->userdata('login_token');
            // $profile=$this->account_model->get_profile($token, $profile_id)->content;
            $profile["phone"] = $phone;
            //$profile=$this->account_model->get_profile($token, $profile_id);
            //$profile->content->phone = $phone;

            // debug($profile);
             $update_data = $this->account_model->update_profile($profile_id,$profile);
            return $update_data;
        }
        return false;
    }

    public function validate_pin($number){
        if(isset($_SESSION["sms_pin"]))
            if ($_SESSION["sms_pin"]==$number)
                return true;
        return false;
    }

    public function send_validation_sms($number){

        $pin = rand(100000, 999999);
        $params = array(
         'to' => $number,
        'from' => "",
        'message' => "Your Validation code is: ".$pin,
        );
        $response  = $this->send_sms($params);
        if (strpos($response, 'OK')!== false){
            $_SESSION["sms_pin"] = $pin;
            return $response;
        }
        else
            return false;
    }

    public function send_recovery_pin(){

        $profile_id = $this->session->userdata('profile_id');
        $token= $this->session->userdata('login_token');

        $profile=$this->account_model->get_profile($token, $profile_id)->content;

        debug($profile);

        $pin = rand(100000, 999999);
        $params = array(
         'to' => $number,
        'from' => "",
        'message' => "Your Recovery Pin is: ".$pin,
        );
        $response  = $this->send_sms($params);
        if (strpos($response, 'OK')!== false)
            return $pin;
        else
            return false;
    }


    private function send_sms($params, $backup = false ) {

        static $content;

        if($backup == true){
            $url = 'https://api2.smsapi.com/sms.do';
        }else{
            $url = 'https://api.smsapi.com/sms.do';
        }

        $c = curl_init();
        curl_setopt( $c, CURLOPT_URL, $url );
        curl_setopt( $c, CURLOPT_POST, true );
        curl_setopt( $c, CURLOPT_POSTFIELDS, $params );
        curl_setopt( $c, CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $c, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt( $c, CURLOPT_HTTPHEADER, array(
           "Authorization: Bearer ".$this->token
        ));

        $content = curl_exec( $c );
        $http_status = curl_getinfo($c, CURLINFO_HTTP_CODE);

        if($http_status != 200 && $backup == false){
            $backup = true;
            $this->send_sms($params, $backup);
        }

        curl_close( $c );
        return $content;
    }





}
