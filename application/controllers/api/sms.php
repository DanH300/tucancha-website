<?php defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/libraries/REST_Controller.php';

class Sms extends REST_Controller{
    function __construct(){
        parent::__construct();
        $this->load->model("sms_model");
        $this->load->library('session');
    }
    function send_recovery_sms_get(){

		$this->response($this->sms_model->send_recovery_pin(),200);
    }

    function send_validation_sms_get(){

        $number = $this->get("number");
		$this->response($this->sms_model->send_validation_sms($number),200);
    }

    function validate_pin_get(){

        $number = $this->get("number");
		$this->response($this->sms_model->validate_pin($number),200);
    }

    function validate_pin_and_save_phone_get(){

        $number = $this->get("number");
        $phone = $this->get("phone");

		$this->response($this->sms_model->validate_pin_and_save_phone($number, $phone),200);
    }

        function validate_pin_and_save_phone_mobile_get(){

        $number = $this->get("number");
        $phone = $this->get("phone");
        $profile_id = $this->get("profile_id");

        $this->response($this->sms_model->validate_pin_and_save_phone($number, $phone, $profile_id),200);
    }


}
