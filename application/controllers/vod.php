<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Vod extends UVod_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('vod_model');
        $this->load->model('vod_item_model');
        $this->load->model('tvod_model');
        $this->load->model('live_model');
        $this->load->model('fastcache_model');
        $this->load->helper('pdk');
        $this->load->library('user_agent');

         if (isset($_GET['flush_cache']) && $_GET['flush_cache'] == 'true') {
            $this->fastcache_model->clean_cache();
        }

        date_default_timezone_set('UTC');
    }

    public function index(){

        $meta = $this->input->get('meta', true);
        if($meta){
            $meta = json_decode(base64_decode($meta), true);
        }

        $currentURL = current_url(); //http://myhost/main
        $params   = $_SERVER['QUERY_STRING']; //my_id=1,3
        $fullURL = "$currentURL?$params";

        $params = [];
        $params['image'] = isset($meta['image']) ? $meta['image'] : null;
        $params['description'] = isset($meta['description']) ? $meta['description'] : $this->config->item('website_description');
        $params['title'] = isset($meta['title']) ? $meta['title'] : $this->config->item('website_title');
        $params['url'] = $fullURL;

        if( isset($_GET['_escaped_fragment_']) ){
            $this->load->view('bot_view');
        }else{
            $this->load->view('html', $params);
        }
    }

}
