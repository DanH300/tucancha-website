<?php

class Tag_model extends CI_Model {

    public function __construct() {
        $this->load->helper('uvod_api');
    }

    public function create($data){
        return apiPost("tag/save", $data);
    }

    public function delete($data){
        return apiPost("tag/remove", $data);
    }

    public function list_items($data){
        return apiPost("tag/list_by_user", $data);
    }
}
