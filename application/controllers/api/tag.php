<?php

defined('BASEPATH') or exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Tag extends REST_Controller
{
    function __construct()
    {
        parent::__construct();
        $this->load->model('tag_model');
        $this->load->library('session');
    }



    public function list_post()
    {
        $data = [
            "targetId" => $this->post('targetId'),
            "token" => $this->post('token') ? $this->post('token') :  $this->session->userdata('login_token')
        ];
        if ($this->post('global')) {
            $data['global'] = $this->post('global');
        }
        if ($this->post('userId')) {
            $data['userId'] = $this->post('userId');
        }

        $user_data = $this->tag_model->list_items($data);
        $this->response($user_data, 200);
    }

    public function create_post()
    {
        $data = [
            "metadata" => $this->post('metadata') ? $this->post('metadata') : new stdClass(),
            "status" =>  $this->post('status'),
            "targetId" => $this->post('targetId'),
            "timePTS" => $this->post('timePTS'),
            "timeTS" => $this->post('timeTS'),
            "type" => $this->post('type'),
            "userId" => $this->post('userId'),
            "global" =>  $this->post('global') ? $this->post('global') : false,
            "token" => $this->post('token') ? $this->post('token') :  $this->session->userdata('login_token')
        ];
        $user_data = $this->tag_model->create($data);

        $this->response($user_data, 200);
    }

    public function delete_post()
    {
        $data = array();
        $data['token'] = $this->session->userdata('login_token');
        $data['reference_id'] = $this->post('reference_id');
        $user_data = $this->tag_model->delete($data);
        $this->response($user_data, 200);
    }
}
