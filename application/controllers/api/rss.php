<?php defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/libraries/REST_Controller.php';

class Rss extends REST_Controller{
	function __construct(){
		parent::__construct();
	}

    function get_gleaner_rss_get(){
		header("Cache-Control: max-age=60");
        $xml = simplexml_load_string(file_get_contents("http://jamaica-gleaner.com/feed/news.xml"), "SimpleXMLElement", LIBXML_NOCDATA);
        $xml = json_encode($xml);
        $xml = json_decode($xml,TRUE);
        $this->response($xml, 200);
    }
}
