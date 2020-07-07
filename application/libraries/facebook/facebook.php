<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require_once( APPPATH . 'libraries/facebook/vendor/autoload.php' );

class Facebook {

    var $fb;
    var $ci;

    public function __construct() {
        $this->ci = & get_instance();
        try {
            $this->fb = new Facebook\Facebook([
              'app_id' => FACEBOOK_APP_ID,
              'app_secret' => FACEBOOK_APP_SECRET,
              'default_graph_version' => 'v2.2',
            ]);
        } catch (Facebook\Exceptions\FacebookResponseException $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function get_access_token() {

        if (isset($_SESSION['fb_access_token']) && $this->validate_access_token($_SESSION['fb_access_token'])) {

            $access_token = $_SESSION['fb_access_token'];
            //$this->fb->setDefaultAccessToken($_SESSION['fb_access_token']);
        } else {

            $helper = $this->fb->getJavaScriptHelper();
            try {

                $access_token = $helper->getAccessToken();
                $_SESSION['fb_access_token'] = (string) $access_token;
                //$this->fb->setDefaultAccessToken($access_token);
            } catch (Facebook\Exceptions\FacebookResponseException $e) {
                throw new Exception($e->getMessage());
            } catch (Facebook\Exceptions\FacebookSDKException $e) {
                throw new Exception($e->getMessage());
            }

            if (!isset($access_token)) {
                throw new Exception('No cookie set or no OAuth data could be obtained from cookie.');
            }
        }


        return $access_token;
    }

    public function get_user_profile($access_token) {
        try {

            $response = $this->fb->get('/me?fields=id,email,name', $access_token);
            $user = $response->getGraphUser();
        } catch (Facebook\Exceptions\FacebookResponseException $e) {
            throw new Exception($e->getMessage());
        } catch (Facebook\Exceptions\FacebookSDKException $e) {
            throw new Exception($e->getMessage());
        }

        return $user;
    }

    public function validate_access_token($access_token) {

        try {
            $this->fb->get('/app?access_token=' . $access_token);
        } catch (Facebook\Exceptions\FacebookResponseException $e) {
            return false;
        }
        return true;
    }

    public function get_picture($access_token, $user_id, $parameters = null) {

        try {

            $endpoint = '/' . $user_id . '/picture';

            $response = $this->fb->sendRequest('GET',$endpoint, $parameters, $access_token, null,'v2.0');
            $picture = $response->getBody();

        } catch (Facebook\Exceptions\FacebookResponseException $e) {
            return false;
        }
        return $picture;
    }

}
