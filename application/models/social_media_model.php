<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Social_Media_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->library('facebook');
    }

    public function get_fb_profile() {

        $return = new stdClass;
        try {
            $access_token = $this->facebook->get_access_token();

            $profile = $this->facebook->get_user_profile($access_token);
           
            $profile_obj = json_decode($profile);
            $fb_id = $profile_obj->id;
            $params = array();
            $params['type'] = 'normal';
            $params['redirect'] = 0;

            $picture = $this->facebook->get_picture($access_token, $fb_id, $params);
            $picture_obj = json_decode($picture);
            $profile_obj->picture = str_replace("\/","",$picture_obj->data->url);
            
            $return->status ='ok';
            $return->content = $profile_obj;
            $return->msg = $profile_obj;
        } catch (Exception $e) {
  
            $return->status ='error';
            $return->msg = $e->getMessage();
           
        }

        return $return;
    }

}
