<?php
class Config_model extends CI_Model {
	
	public function __construct()
	{
		$this->load->helper('uvod_api');
	}

	public function get_vod_categories()
	{
		return apiCall("config/list_vod_categories");
	}
}
?>