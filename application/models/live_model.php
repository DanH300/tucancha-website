<?php

class Live_model extends CI_Model {

    public function __construct() {
        $this->load->helper('uvod_api');

    }

    public function list_channels() {

        $data = apiCall("live/list_channels");
        // debug($data);
        // $data = $this->add_timeline($data);
        // debug($this->rows($data->content->entries)[index]['ChannelLogoLarge']);
        return $this->rows($data->content->entries);

    }
    public function get_epg_timeline($date, $length, $channel) {

        return apiPost("live/get_epg_timeline", array('start' => $date, 'length' => $length, 'channel' => $channel));

    }

    public function get_epg_data($date = null) {
        if ($date) {
            // debug($date);
            return apiPost("live/list_epg_data", array('date' => $date));
        } else {
            return apiPost("live/list_epg_data");
        }
    }

    private function add_timeline($data){
        $time = time();
		$length = 5;
        foreach ($data->content->entries as $channel) {
            for ($i=0; $i < sizeof($channel->media->content); $i++) {
                if($channel->media->content[$i]->assetTypes[0] == "Channel Logo Large"){
                    $channel->logoLarge = $channel->media->content[$i]->url;
                }
            }
            $timeline = $this->get_epg_timeline($time, $length, $channel->_id);
            $channel->timeline = array();
            $channel->timeline = $timeline->content->entries;
        }
        return $data;
    }

    function rows($data){
        $rows = array();
        foreach ($data as $media) {
            // error_log("MEDIA: ".json_encode($media));
            $tmp = array(


                    "_id" => $media->_id,
                    "title" => 	$media->title,
                    "description" => $media->description,
                    "adPolicyId" => isset($media->media->adPolicyId)?$media->media->adPolicyId:null,
                    // "logoLarge" => $media->logoLarge

            );
            foreach ($media->media->content as $file) {
                $downloadUrl = $file->downloadUrl;
                $streamingUrl = $file->streamingUrl;
                $url = $file->url;

                if($this->config->item("posters_cdn") && $this->config->item("old_cdn") && (strpos($url, ".jpg")>=0 || strpos($url, ".jpeg")>=0 || strpos($url, ".png")>=0)){
                    $downloadUrl = str_replace($this->config->item("old_cdn"), $this->config->item("posters_cdn"), $downloadUrl);
                    $streamingUrl = str_replace($this->config->item("old_cdn"), $this->config->item("posters_cdn"), $streamingUrl);
                    $url = str_replace($this->config->item("old_cdn"), $this->config->item("posters_cdn"), $url);
                }

                $tmp[str_replace (" ", "", $file->assetTypes[0])] = array(
                        "downloadUrl" => $downloadUrl,
                        "streamingUrl" => $streamingUrl,
                        "url" => $url
                );
            }
            $rows[] = $tmp;

        }
		return $rows;
	}

}

?>
