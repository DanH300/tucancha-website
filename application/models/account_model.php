<?php

require_once 'Mandrill.php';

class Account_model extends CI_Model {

    public function __construct() {
        $this->load->helper('uvod_api');
        $this->load->library('HybridAuthLib');
        $this->load->library('session');
        $this->load->model('vod_model');
    }

    public function login($user, $pass, $disabled = false, $geocode, $country_name, $user_ip, $device_id, $device_name) {

        $data = apiPost("user/login", array("username" => $user, "password" => $pass, "disabled" => $disabled, "device_id" => $device_id, "device_name" => $device_name));
        
        if($data->content && (isset($data->content->device_error) && !$data->content->device_error)){

                $this->session->set_userdata('login_token', $data->content->token);
                $user_profile = new stdClass();
                $user_profile->content = $data->content;
                
                $this->session->set_userdata('profile_id', $user_profile->content->id);

                if($user_profile) {
                    $currentDate = intval(time().'000');
                    $updateProfile = array();
                    if ($geocode != null){
                        $updateProfile["countryCode"] = $geocode;
                        $updateProfile["countryName"] = $country_name;
                        $updateProfile["userIp"] = $user_ip;
                    }
                    $updateProfile["lastLoginDate"] = $currentDate;
                    $this->update_profile($data->content->id, $updateProfile);
                    $user_profile->content->tokenData = array('token' => $data->content->token, 'duration' => $data->content->duration, "idleTimeout" => $data->content->idle_timeout);
                }

                return $user_profile;
            
        }
        return $data;

    }

    public function fb_login($fb_id, $fb_data, $geocode, $country_name, $user_ip, $device_id, $device_name, $app_version, $os_name, $os_version) {

        $data = apiPost("user/fb_login", array("fb_id" => $fb_id, "fb_data" => $fb_data, "device_id" => $device_id, "device_name" => $device_name, "app_version" => $app_version, "os_name" => $os_name, "os_version" => $os_version));
        
        if($data->content && (isset($data->content->device_error) && !$data->content->device_error)){

                $this->session->set_userdata('login_token', $data->content->token);
                $user_profile = new stdClass();
                $user_profile->content = $data->content;
                $this->session->set_userdata('profile_id', $user_profile->content->id);

                if($user_profile) {
                    $currentDate = intval(time().'000');
                    $updateProfile = array();
                    if ($geocode != null){
                        $updateProfile["countryCode"] = $geocode;
                        $updateProfile["countryName"] = $country_name;
                        $updateProfile["userIp"] = $user_ip;
                    }
                    $updateProfile["lastLoginDate"] = $currentDate;
                    if($app_version != ""){
                        $updateProfile["appVersion"] = $app_version;
                    }
                    $this->update_profile($data->content->id, $updateProfile);
                    $user_profile->content->tokenData = array('token' => $data->content->token, 'duration' => $data->content->duration, "idleTimeout" => $data->content->idle_timeout);
                }

                return $user_profile;
            
        }
        return $data;

    }


    public function login_device($device_id, $device_name, $username, $password) {

        $data = apiPost("user/login_device", array("device_id" => $device_id, "device_name" => $device_name, "username" => $username, "password" => $password));

		if($data->content){
			$this->session->set_userdata('login_token', $data->content->token);
            $user_profile = $this->get_profile($data->content->token, $data->content->id);
            $this->session->set_userdata('profile_id', $user_profile->content->_id);

            if($user_profile) $user_profile->content->tokenData = array('token' => $data->content->token, 'duration' => $data->content->duration, "idleTimeout" => $data->content->idle_timeout);

            return $user_profile;
        }
        return $data;

    }

    public function check_devices($device_id, $device_name, $user_id, $token) {
 
        $user = new stdClass();
        $user->id= $user_id;
        if ($this->session->userdata('login_token')){
            
            $user->token = $this->session->userdata('login_token');
        } else if($token != null){
            
            $user->token = $token;
        }
        $data = apiPost("user/check_current_device", array("device_id" => $device_id, "device_name" => $device_name, "user" => json_encode($user)));

        return $data;

    }


    public function get_ppv(){
        $profile_id = $this->session->userdata('profile_id');
		$token= $this->session->userdata('login_token');

        $data = apiCall('user/get_user_commerce_data', array("token" => $token, "id" => $profile_id));

        debug($data);

    }


    public function hybrid_login($profile, $provider){
        //debug($provider);
        $fbLogin = $this->login_by_fb($profile->identifier);
        if($fbLogin->_id==0){// Facbook Id not in DB try Registering with Email, RandPass and FBID
            if($provider == "Twitter") $profile->lastName = $profile->firstName;
            $fbRegister = $this->register($profile->email, $this->randomPassword(), $profile->firstName, $profile->lastName, NULL, NULL, $profile->identifier);
            if (strpos($fbRegister->message, "User already") < 0){ // Success on Registation Saving On session and Updating User Profile
                $fb_id = $profile->identifier;
                $fb_login= $this->account_model->login_by_fb($fb_id);
                $user_data = $this->merge_facebook_profile($profile);
            }else{ // Email Exists in DB, moving To merge function
                $error = new stdClass();
                $error->email = $profile->email;
                if ($provider == "Facebook"){
                    $this->session->set_userdata('fb_profile', $profile);
                    $error->message = "Please Login with your Email:".$profile->email.", to link Your Facebook Account";
                    $error->code = 11;
                } else {
                    $error->message = "Please Login with Facebook Or with Your E-mail";
                    $error->code = 12;
                }
                $this->session->set_userdata('profile_id', $error);
                return ;

            }
        }
    }

    public function hybrid_login_mobile ($profile, $provider, $device_id, $device_name) {
        $fbLogin = $this->login_device_by_fb($profile->identifier, $device_id, $device_name);
        if($fbLogin->error || $fbLogin->_id==0){// Facbook Id not in DB try Registering with Email, RandPass and FBID
            if($provider == "Twitter") $profile->lastName = $profile->firstName;
            $fbRegister = $this->register($profile->email, $this->randomPassword(), $profile->firstName, $profile->lastName, NULL, NULL, $profile->identifier);
            if (strpos($fbRegister->message, "User already") < 0  || $fbRegister->message == "ok"){  // Success on Registation Saving On session and Updating User Profile
                $fb_id = $profile->identifier;
                $fb_login= $this->account_model->login_device_by_fb($profile->identifier, $device_id, $device_name);
                $data = array();
                // $data["gender"] = $profile->gender;
                $data["avatar"] = $profile->photoURL;
                $data["addressLine1"] = $profile->phone;
                $data["city"] = $profile->city;
                $user_data = $this->update_profile_mobile($fb_login->_id,$data, $fb_login->tokenData['token']);
                $user_data->content->tokenData = $fb_login->tokenData;
                return $user_data->content;
            }else{ // Email Exists in DB, moving To merge function
                $error = new stdClass();
                $error->email = $profile->email;
                if ($provider == "Facebook"){
                    $this->session->set_userdata('fb_profile', $profile);
                    $error->message = "Please Login with your Email:".$profile->email.", to link Your Facebook Account";
                    $error->code = 11;
                } else {
                    $error->message = "Please Login with Facebook Or with Your E-mail";
                    $error->code = 12;
                }
                $this->session->set_userdata('profile_id', $error);
                return $error;
            }
        }else return $fbLogin;
    }

    public function link_facebook($user, $pass) {

        $login_data = apiPost("user/login_portal", array("username" => $user, "password" => $pass, "disabled" => false));
        if($login_data->error){
            $error = new stdClass();
            $error->message = "Username or Password Wrong, Please check your Credentials";
            $error->code = 10;
            return $error;
        } else
        if($login_data->content->token){

            $fb_data  = $this->session->userdata('fb_profile');
        //    debug($this->session->userdata);
            if($fb_data){
                // debug('here');
                $updated_data = $this->update_user( $login_data->content->id , $fb_data->identifier, $fb_data );
            //    debug($updated_data);
                if($updated_data){
                    $fb_login= $this->login_by_fb($fb_data->identifier);
            //        debug($fb_login);
                    $user = $this->account_model->merge_facebook_profile($fb_data);
                    $this->session->unset_userdata('fb_profile');
                    // debug($user);
                    return $user;
                }
            }
        }

    }

    //dont change anything in this function because is used by facebook link
    function merge_facebook_profile($facebook){
        $data = array();
        $data["fbData"] = $facebook;
        $data["firstName"] = $facebook->firstName;
        $data["lastName"] = $facebook->lastName;
        $data["gender"] = $facebook->gender;
        $data["avatar"] = $facebook->photoURL;
        $data["addressLine1"] = $facebook->phone;
        $data["city"] = $facebook->city;
        // if($facebook->birthMonth && $facebook->birthDay && $facebook->birthYear){
        //     $date = date_create("12"."-"."30".'-'.$facebook->birthYear);
        //     $data["birthDate"] = date_timestamp_get($date);
        // }

        $response = apiPost("user/update_profile", array("token" => $this->session->userdata('login_token'), "id" => $this->session->userdata('profile_id'), "data" => $data));
        return $response->content;
    }


    public function login_by_fb($fb_id) {
        $fbLogin =  apiPost("user/login_by_fb", array("fb_id" => $fb_id));
    //    debug($fbLogin);
        $token = $fbLogin->content->token;
        $this->session->set_userdata('login_token', $token);
        $user_data = $this->account_model->get_profile($fbLogin->content->token, $fbLogin->content->id)->content;
        $this->session->set_userdata('profile_id', $user_data->_id);
        if($user_data) $user_data->tokenData = array('token' => $fbLogin->content->token, 'duration' => $fbLogin->content->duration, "idleTimeout" => $fbLogin->content->idle_timeout);
        return $user_data;

    }

    public function login_device_by_fb($fb_id, $device_id, $device_name) {
        $fbLogin =  apiPost("user/login_device_by_fb", array("fb_id" => $fb_id, "device_id" => $device_id, "device_name" => $device_name));
    //    debug($fbLogin);
        $token = $fbLogin->content->token;
        $this->session->set_userdata('login_token', $token);
        $user_data = $this->account_model->get_profile($fbLogin->content->token, $fbLogin->content->id)->content;
        $this->session->set_userdata('profile_id', $user_data->_id);
        if($user_data) $user_data->tokenData = array('token' => $fbLogin->content->token, 'duration' => $fbLogin->content->duration, "idleTimeout" => $fbLogin->content->idle_timeout);
        return $user_data;

    }

    public function logout($device_id, $token=null) {
  
        $token = $token != null? $token : $this->session->userdata('login_token');

        $data =  apiPost("user/logout", array("device_id" => $device_id, "token" => $token));
        if($data){
            $this->session->sess_destroy();
            $this->load->library('HybridAuthLib');
            $this->hybridauthlib->logoutAllProviders();
        }
        return $data;
    }

    public function register($email, $password, $first_name, $last_name, $dni = NULL, $country = NULL, $fb_id = NULL) {
        $data = apiPost("user/register", array("email" => $email,
          "password" => $password,
          "first_name" => $first_name,
          "last_name" => $last_name,
          "dni" => $dni,
          "country" => $country,
          "fb_id" => $fb_id)
        );
        if($data->content){

			$this->session->set_userdata('login_token', $data->content->user->token);
            $this->session->set_userdata('profile_id', $data->content->profile->_id);

            $user = $data->content->user;
            $user->id = $data->content->user->userId;
            $user->profile = $data->content->profile;

            return $user;

        }
        return $data;
    }

    public function get_profile($token, $id) {
        return apiCall("user/get_profile", array('token' => $token, 'id' => $id));
    }

    public function update_profile_mobile($id ,$data, $token) {
        if(count($data)>1){
            foreach($data as $field=>$value){
                if(!$value || $value == '' || $value==null)
                    unset($data[$field]);
            }
        }
        $response = apiPost("user/update_profile", array("token" => $token, "id" => $id, "data" => $data));
        return $response;
    }

    public function get_self_id($token) {
        return apiPost("user/get_self_id", array('token' => $token));
    }

    public function upload_profile_pic($file){

        // debug($file);
        $response = apiPost("user/upload_user_photo", array("token" => $this->session->userdata('login_token'), "id" => $this->session->userdata('profile_id'), "image_url" => $file['file']['tmp_name'][0]));
        return $response;
    }

    public function update_profile($id, $data) {
       if(!isset($data["fbData"]) || is_null($data["fbData"]) || empty($data["fbData"]) || !is_array($data["fbData"]))
           unset($data["fbData"]);
       if(!isset($data["operations"]) || is_null($data["operations"]) || empty($data["operations"]) || !is_array($data["operations"]))
           unset($data["operations"]);
       if(!isset($data["paymentData"]))
           unset($data["paymentData"]);
       if(!isset($data["registeredDevices"]) || is_null($data["registeredDevices"]) || empty($data["registeredDevices"]) || !is_array($data["registeredDevices"]))
           unset($data["registeredDevices"]);
       if(!isset($data["watchlist"]) || is_null($data["watchlist"]) || empty($data["watchlist"]) || !is_array($data["watchlist"]))
           unset($data["watchlist"]);
       if(!isset($data["billingInfo"]))
           unset($data["billingInfo"]);
       if(!isset($data["favoriteCelebs"]))
           unset($data["favoriteCelebs"]);
       if(!isset($data["favoriteVideos"]))
           unset($data["favoriteVideos"]);
       if(!isset($data["offersSaved"]))
           unset($data["offersSaved"]);
       if(!isset($data["favoriteBrands"]))
           unset($data["favoriteBrands"]);
       if(!isset($data["favoriteCharities"]))
           unset($data["favoriteCharities"]);
       if(!isset($data["favoriteCategories"]))
           unset($data["favoriteCategories"]);
       if(isset($data["paymentData"]) && isset($data["paymentData"][0]) && isset($data["paymentData"][0]["added"]))
           unset($data["paymentData"][0]["added"]);

       $response = apiPost("user/update_profile", array("token" => $this->session->userdata('login_token'), "id" => $id, "data" => $data));
       return $response->content;
    }

    public function update_user( $id, $fb_id = NULL, $fb_data = NULL, $first_name = NULL, $last_name = NULL, $address = NULL, $birthDay = NULL) {

        $data = new stdClass();

        if($first_name)
            $data->firstName = $first_name;
        if($last_name)
            $data->lastName = $last_name;
        if($address)
            $data->city = $address;
        if($birthDay)
            $data->birthdate = $birthDay;
        if($fb_id)
            $data->fbId = $fb_id;
        if($fb_data)
            $data->fbData = $fb_data;

        return apiPost("user/update_user", array("token" => $this->session->userdata('login_token'),
            "id" => $id,
            "data" => $data));
    }

    public function save_merchant_info($user_token, $payment_token, $customer_id) {
        return apiPost("commerce/save_merchant_info", array("user_token" => $user_token,
            "payment_token" => $payment_token,
            "customer_id" => $customer_id));
    }

    public function send_password_email($email) {

        $users = apiCall("user/get_single_user", array("email" => $email));

        if (isset($users->content->entryCount) && (intval($users->content->entryCount) > 0)) {
            $profile = $users->content->entries[0];
            $mandrill = new Mandrill('lwISZr2Z9D-IoPggcDSaOQ');
            $new_password = array();
            $new_password['password'] = rand(10000000, getrandmax());
            if (isset($profile->displayName)) {
                $new_password['name'] = $profile->fullName;
            } else {
                $new_password['name'] = '';
            }
            $to = $email;
            $message = new stdClass();
            $message->html = $this->load->view( 'templates/email_forgot_password', $new_password, TRUE);
            $message->subject = "Password Reset";
            $message->from_email = "NO_RESPONSE@shoott.com";
            $message->from_name = "Shoot Portal";
            $message->to = array(array('email' => $to));

            $message->track_opens = true;
            $mandrill->messages->send($message);

            $response = apiPost("user/save_password", array("email" => $email, "password" => $new_password['password']));
            return true;
        }
        return false;
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

    public function save_password($email, $new_password) {
        return apiPost("user/save_password", array("email" => $email, "password" => $new_password));
    }

    public function delete_device($deviceId, $token) {
        $parameters = array();
        $parameters['token'] = $token;
        $parameters['deviceId'] = $deviceId;
        // debug($parameters);
        return apiPost("user/delete_device", $parameters);
    }

    public function change_password($email, $old_password, $new_password) {
        return apiPost("user/change_password", array("email" => $email, "current_password" => $old_password, "new_password" => $new_password));
    }

    public function activate_account($hash, $email) {

        return apiPost("user/activate_account", array("hash" => $hash, "email" => $email));
    }

    public function subscription_checkout($token, $nonce, $first_name, $last_name, $email, $country, $pi_month, $pi_year, $pi_type, $pi_number, $pi_security_code, $subscription_id, $auto_renew) {

        return apiPost("commerce/subscription_checkout", array('token' => $token, 'nonce' => $nonce, 'first_name' => $first_name, 'last_name' => $last_name,
            'email' => $email, 'country' => $country, 'pi_month' => $pi_month, 'pi_year' => $pi_year, 'pi_type' => $pi_type, 'pi_number' => $pi_number,
            'pi_security_code' => $pi_security_code, 'subscription_id' => $subscription_id, 'auto_renew' => $auto_renew));
    }

    public function get_contract($id, $user_active = null) {

        return apiPost("commerce/get_contract", array('id' => $id, 'user_active' => $user_active));
    }

    // public function cancel_subscription($id) {
    //
    //     return apiPost("commerce/cancel_subscription", array('id' => $id));
    // }

    public function update_subscription($id, $auto_renew) {

        return apiPost("commerce/update_contract", array('id' => $id, 'auto_renew' => $auto_renew));
    }

    public function get_subscriptions($id = null) {

        return apiPost("commerce/get_subscriptions", array('id' => $id));
    }

    public function get_billing_information($id) {

        return apiPost("commerce/get_billing_information", array('id' => $id));
    }

    public function update_billing_information($id, $nonce) {

        return apiPost("commerce/update_billing_information", array('id' => $id, 'nonce' => $nonce));
    }

    public function edit_billing_information($data) {
        return apiPost("commerce/edit_billing_info", array("token" => $this->session->userdata('login_token'), 'id' => $this->session->userdata('profile_id'), 'data' => $data));
    }

    public function add_billing_information($data) {
        return apiPost("commerce/add_billing_info", array("token" => $this->session->userdata('login_token'), 'id' => $this->session->userdata('profile_id'), 'data' => $data));
    }

    public function delete_credit_card($id) {
        return apiPost("commerce/delete_credit_card", array('card_id' => $id, "token" => $this->session->userdata('login_token'), "user_id" => $this->session->userdata('profile_id') ));
    }

    public function get_user_notifications() {
        $id= $this->session->userdata('profile_id');
        //debug( $this->session->userdata('login_token') );
        $data= apiCall("notification/get_user_notifications", array("id" => $id, "token" => $this->session->userdata('login_token')));
        //debug($data);
        return $data;
    }

    public function mark_notifications_as_read($data) {
        $id= $this->session->userdata('profile_id');
        $data = apiPost("notification/mark_as_read", array("id" => $id, "token" => $this->session->userdata('login_token'), "notifications_id" => $data));
        return $data;
    }

    public function exists_user_email($email) {

        $ret = false;
        $resp = apiCall("user/get_single_user", array('email' => $email));
        return $resp;
    }

    public function get_profile_by_email($email) {
        return apiPost("user/get_profile_by_email", array('email' => $email));
    }

    function get_all_subscriptions () {
        $data = apiCall("commerce/get_subscriptions");
        // $subscriptions = $data->content->entries;
        // $subscriptions[2]->campaign_max_count = $subscriptions[3]->campaign_max_count;
        // $subscriptions[2]->campaign_count = $subscriptions[3]->campaign_count;
        // $subscriptions[2]->campaign_text = $subscriptions[3]->campaign_text;
        // debug( $subscriptions );
        return  $data;
    }

    function createRequest($id) {
        $data = array();
        
        $user_id = $this->session->userdata('profile_id');
        $token = $this->session->userdata('login_token');
    
    
        $profile = $this->get_profile($token, $user_id)->content;

        $data["subscription_id"] = $id;
        $data["name"] = $profile->firstName;
        $data["lastname"] = $profile->lastName;
        $data["email"] = $profile->email;
        $data["user_id"] = $user_id;
        $data["token"] = $token;
        $data["auto_renew"] = true;
        
        $data["reference"] = $user_id.".".rand(0,999999);
        $data["description"] = " ";
        $data["currency"] = "USD";
        $data["total"] = 0;
        $data["returnUrl"] = base_url();
  
        $response = apiPost("commerce/payment",$data);
        
        return $response;

    }

    public function checkPayP2P($requestId){
        $user_id = $this->session->userdata('profile_id');
        $token = $this->session->userdata('login_token');

        $data["user_id"] = $user_id;
        $data["token"] = $token;
        $data["requestId"] = $requestId;

        $response = apiPost("commerce/get_transaction",$data);
        return $response;
    }

    public function getAllP2PPay(){

        $user_id = $this->session->userdata('profile_id');
        $token = $this->session->userdata('login_token');

    
        $profile = $this->get_profile($token, $user_id)->content;

        $data["subscription_id"] = $id;
        $data["name"] = $profile->firstName;
        $data["lastname"] = $profile->lastName;
        $data["email"] = $profile->email;
        $data["user_id"] = $user_id;
        $data["token"] = $token;

        $response = apiPost("commerce/get_transactions",$data);
        
        return $response;
    }

    public function webhook_p2p($data){
        $response = apiPost("commerce/webhook_p2p",$data);
        return $response;
    }

    function subscribe($billing, $id){
        $data = array();
        $user_id = $this->session->userdata('profile_id');
        $token = $this->session->userdata('login_token');
        $profile = $this->get_profile($token, $user_id)->content;
        $data['token'] = $token;

        $data['first_name'] = $billing['firstName'];
        $data['last_name'] = $billing['lastName'];
        $data['email'] = $profile->username;
        $data['country'] = $profile->countryCode;
        $data['pi_month'] = $billing['pi_month'];
        $data['pi_year'] = $billing['pi_year'];
        $data['pi_type'] = $billing['pi_type'];
        $data['pi_number'] = $billing['pi_number'];
        $data['pi_security_code'] = $billing['security_code'];
        $data['subscription_id'] = $id;
        $data['username'] = $profile->username;
        $response =  apiPost("commerce/subscription_checkout", $data);
        // if($response->content){
        //     $subject = "Subscription Purchase Complete";
        //     $from_address = "noreply@shoott.com";
        //     $from_name = "Shoot Portal";
        //     $emailData = array();
        //     $emailData["duration"] = $response->content->subscription_data->subscriptionLength;
        //     $emailData["units"] = $response->content->subscription_data->subscriptionUnits;
        //     $emailData["name"] = $profile->firstName;
        //     $emailData["surname"] = $profile->lastName;
        //     $html = $this->load->view( 'templates/email_subscription_complete', $emailData, TRUE);
        //     $this->send_single_email($data['email'], $html, $subject, $from_address, $from_name);
        // }
        return $response;
    }

    function get_last_contract(){
        $data = array();
        $user_id = $this->session->userdata('profile_id');
        $token = $this->session->userdata('login_token');
      
        $data['token'] = $token;
        $data['user_id'] = $user_id;

        $response =  apiPost("commerce/get_last_contract", $data);
    
        return $response;
    }

    function tvod_subscribe($billing, $id){
        $data = array();
        $user_id = $this->session->userdata('profile_id');
        $token = $this->session->userdata('login_token');
        $profile = $this->get_profile($token, $user_id)->content;
        $data['token'] = $token;

        $data['first_name'] = $billing['firstName'];
        $data['last_name'] = $billing['lastName'];
        $data['email'] = $profile->email;
        $data['country'] = $profile->countryCode;
        $data['pi_month'] = $billing['pi_month'];
        $data['pi_year'] = $billing['pi_year'];
        $data['pi_type'] = $billing['pi_type'];
        $data['pi_number'] = $billing['pi_number'];
        $data['pi_security_code'] = $billing['security_code'];
        $data['subscription_id'] = $id;
        $data['username'] = $profile->username;
        $response =  apiPost("commerce/subscription_checkout", $data);
        return $response;
    }

    function subscribe_mobile($data){

        $data['user_id'] = $data['id'];
        $data['token'] = $data['token'];
        $data['subscription_id'] = $data['subscription_id'];
        $data['purchase_data'] = $data['purchase_data'];
        $data['platform'] = $data['platform'];

        $profile = $this->get_profile($data['token'], $data['user_id'])->content;
        
        $response =  apiPost("commerce/subscription_checkout_mobile", $data);
        if($response->content){
            $subject = "Subscription Purchase Complete";
            $from_address = "noreply@shoott.com";
            $from_name = "Shoot Portal";
            $emailData = array();
            $emailData["duration"] = $response->content->subscription_data->subscriptionLength;
            $emailData["units"] = $response->content->subscription_data->subscriptionUnits;
            $emailData["name"] = $profile->firstName;
            $emailData["surname"] = $profile->lastName;
            $html = $this->load->view( 'templates/email_subscription_complete', $emailData, TRUE);
            $this->send_single_email($profile->username, $html, $subject, $from_address, $from_name);
        }
        return $response;
    }

    function tvod_subscribe_mobile($data){

        $data['user_id'] = $data['id'];
        $data['token'] = $data['token'];
        $data['subscription_id'] = $data['subscription_id'];
        $data['payment_id'] = $data['payment_id'];
        
        $response =  apiPost("commerce/subscription_checkout_mobile", $data);

        return $response;
    }

    function submit_campaign($id, $shipping){
        $data = array();
        $campaign = $this->get_subscriptions($id);
        $data['campaign_count'] = $campaign->content->campaign_count + 1;
        $response =  apiPost("commerce/update_campaign", array("id" => $id, "data" => $data));
        if($response){
            $subject = "Campaign";
            $from_address = "noreply@shoott.com";
            $from_name = "Shoot Portal";
            $emailData = array();
            $emailData["first_name"] = $shipping['first_name'];
            $emailData["last_name"] = $shipping['last_name'];
            $emailData["address_1"] = $shipping['address_1'];
            $emailData["address_2"] = $shipping['address_2'];
            $emailData["country"] = $shipping['country'];
            $emailData["city"] = $shipping['city'];
            $emailData["state"] = $shipping['state'];
            $emailData["zip"] = $shipping['zip'];
            $emailData["phone"] = $shipping['phone'];
            $emailData["email"] = $shipping['email'];
            $html = $this->load->view( 'templates/campain_after_subscription', $emailData, TRUE);
            $this->send_single_email("promotion@univtec.com", $html, $subject, $from_address, $from_name);
        }
        return $response;
    }

    function subscribe_with_existing_cc($id){

        $data = array();
        $user_id = $this->session->userdata('profile_id');
        $token = $this->session->userdata('login_token');
        $profile = $this->get_profile($token, $user_id)->content;
        $data['token'] = $token;
        $data['first_name'] = $profile->billingInfo->first_name;
        $data['last_name'] = $profile->billingInfo->last_name;
        $data['email'] = $profile->username;
        $data['country'] = $profile->countryCode;
        $data['subscription_id'] = $id;
        $response =  apiPost("commerce/subscribe_by_stored_cc", $data);
        // if($response->content){
        //     $subject = "Subscription Purchase Complete";
        //     $from_address = "noreply@shoott.com";
        //     $from_name = "Shoot Portal";
        //     $emailData = array();
        //     $emailData["duration"] = $response->content->subscription_data->subscriptionLength;
        //     $emailData["units"] = $response->content->subscription_data->subscriptionUnits;
        //     $emailData["name"] = $profile->firstName;
        //     $emailData["surname"] = $profile->lastName;
        //     $html = $this->load->view( 'templates/email_subscription_complete', $emailData, TRUE);
        //     $this->send_single_email($profile->username, $html, $subject, $from_address, $from_name);
        // }
        return $response;
    }

    function subscribe_with_wallet($id){

        $data = array();
        $user_id = $this->session->userdata('profile_id');
        $token = $this->session->userdata('login_token');
        $profile = $this->get_profile($token, $user_id)->content;
        $data['token'] = $token;
        $data['product_id'] = $id;
        $response =  apiPost("commerce/wallet_subscription_checkout", $data);
        return $response;
    }

    function buy_with_wallet($id){

        $data = array();
        $user_id = $this->session->userdata('profile_id');
        $token = $this->session->userdata('login_token');
        $profile = $this->get_profile($token, $user_id)->content;
        $data['token'] = $token;
        $data['product_id'] = $id;
        $response =  apiPost("commerce/wallet_event_checkout", $data);
        return $response;
    }

    function tvod_subscribe_with_existing_cc($id){

        $data = array();
        $user_id = $this->session->userdata('profile_id');
        $token = $this->session->userdata('login_token');
        $profile = $this->get_profile($token, $user_id)->content;
        $data['token'] = $token;
        $data['first_name'] = $profile->billingInfo->first_name;
        $data['last_name'] = $profile->billingInfo->last_name;
        $data['email'] = $profile->email;
        $data['country'] = $profile->countryCode;
        $data['subscription_id'] = $id;
        $response =  apiPost("commerce/subscribe_by_stored_cc", $data);
        return $response;
    }

    function cancel_subscription($subscription_id){
        $data = array();
        $data['token'] = $this->session->userdata('login_token');
        $data['user_id'] = $this->session->userdata('profile_id');
        $data['subscription_id'] = $subscription_id;

        return apiPost("commerce/cancel_subscription", $data);
    }

    function cancel_subscription_mobile($subscription_id, $token, $id){
        $data = array();
        $data['token'] = $token;
        $data['id'] = $id;
        $data['subscription_id'] = $subscription_id;

        return apiPost("commerce/cancel_subscription", $data);
    }

    private function randomPassword() {
	    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#.';
	    $pass = array(); //remember to declare $pass as an array
	    $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
	    for ($i = 0; $i < 16; $i++) {
	        $n = rand(0, $alphaLength);
	        $pass[] = $alphabet[$n];
	    }

	    return implode($pass); //turn the array into a string
    }
    
    public function get_user_clips($user_id, $page = null, $size  = null, $sort  = null, $order  = null, $filters  = null) {

        $parameters = array();

        $parameters["token"] = $this->session->userdata('login_token');

        $parameters["user_id"] = $user_id;

        if($page){
            $parameters["page"] = $page;
        }
        if($size){
            $parameters["size"] = $size;
        }
        if($sort){
            $parameters["sort"] = $sort;
        }
        if($order){
            $parameters["order"] = $order;
        }
        if($filters){
            $parameters["filters"] = $filters;
        }


        $clips = apiCall("user/get_user_clips", $parameters);

        return $this->vod_model->rows($clips->content->entries);
    }

    public function get_wallet_transactions($user_id, $page = null, $size  = null, $sort  = null, $order  = null, $filters  = null) {

        $parameters = array();

        $parameters["token"] = $this->session->userdata('login_token');

        $parameters["user_id"] = $user_id;

        if($page){
            $parameters["page"] = $page;
        }
        if($size){
            $parameters["size"] = $size;
        }
        if($sort){
            $parameters["sort"] = $sort;
        }
        if($order){
            $parameters["order"] = $order;
        }
        if($filters){
            $parameters["filters"] = $filters;
        }


        $transactions = apiPost("transaction/list", $parameters);

        return $transactions;
    }


    public function get_user_pixellot_token($token) {
        
        $parameters = array();
        $parameters["token"] = $token;

        $token = apiCall("user/refresh_pixellot_token", $parameters);

        return $token;
    }

    public function get_wallet($id) {
        
        $parameters = array();
        $parameters["user_id"] = $id;

        $token = apiCall("wallet/get_by_user_id", $parameters);

        return $token;
    }

}

?>
