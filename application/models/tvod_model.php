<?php

class Tvod_model extends CI_Model {

    public function __construct() {
        $this->load->helper('uvod_api');
    }

    public function clips($ids, $page, $size, $sort, $order,$featured = false) {
        $parameters = array();

        $parameters["page"] = $page;
        $parameters["size"] = $size;
        $parameters["sort"] = $sort;
        $parameters["order"] = $order;
        if($ids)
            $parameters["custom_filter"] = "byId=". $ids;

        if($featured)
            $parameters["custom_filter"] = "byFeatured_category=new_releases";

        $parameters["custom_filter"] .= "&byMedia_type=tvod_clip";

        $parameters['fields'] = "_id,title,description,keywords,featured_category,added,updated,aired_date,actors,seasons,program_id,series_id,media_type,plans,content.assetTypes,content.downloadUrl,categories";
        $data = apiCall("vod/get_tvods", $parameters);

        return $this->trailer_rows($data->content->entries);
    }


    public function featuredTvod($asset_type, $page, $size, $sort, $order) {
        $parameters = array();

        //$parameters["page"] = $page;
        //$parameters["size"] = $size;
        $parameters["sort"] = $sort;
        $parameters["order"] = $order;

        $parameters["asset_type"] = $asset_type;

        //$parameters["custom_filter"] = "byFeatured_category=featured_tvod";

        //$parameters["custom_filter"] .= "&byMedia_type=clip";
        //$parameters['fields'] = "_id,title,description,keywords,featured_category,added,updated,aired_date,actors,seasons,program_id,series_id,media_type,plans,content.assetTypes,content.downloadUrl,categories";
        //$data = apiCall("vod/get_tvods", $parameters);
        $data = apiCall("resources/tvod_slider", $parameters);
        //$this->trailer_rows($data->content->entries);
        return $data;
    }

    public function shows($ids, $page, $size, $sort, $order,$featured = false) {
        $parameters = array();

        $parameters["page"] = $page;
        $parameters["size"] = $size;
        $parameters["sort"] = $sort;
        $parameters["order"] = $order;
        if($ids)
            $parameters["custom_filter"] = "byId=". $ids;

        $parameters["custom_filter"] .= "&byMedia_type=tvod_tv_show";

        $parameters['fields'] = "_id,title,description,keywords,featured_category,seasons,program_id,series_id,added,updated,aired_date,actors,media_type,plans,content.assetTypes,content.downloadUrl,categories";
        $data = apiCall("vod/get_tvods", $parameters);

        return $this->trailer_rows($data->content->entries);
    }

    public function get_by_id($id, $plans) {
        $parameters = array();

        $parameters["id"] = $id;
        $parameters['fields'] = "_id,title,description,keywords,added,updated,aired_date,actors,directors,seasons,program_id,series_id,media_type,plans,content.assetTypes,content.downloadUrl,categories";
        $data = apiCall("vod/item_api", $parameters);

         $now = time().'000';
         $plans = json_decode($plans);

         if($plans){
             foreach ($plans as $plan) {
                 if($plan->media_id == $id && $plan->contractEndDate >= $now){
                     return $this->tv_show_rows(array($data->content))[0];
                 }

             }
         }



        return $this->tv_show_trailer_rows(array($data->content))[0];
    }

    function trailer_rows($rows){

        foreach ($rows as &$media) {

            $media = (array) $media;
			if($media["content"]){

	            foreach ($media["content"] as $file) {

                    if($file->assetTypes[0] !== "HLS Stream" && $file->assetTypes[0] !== "AIS Stream" && $file->assetTypes[0] !== "Android Stream" && $file->assetTypes[0] !== "Mezzanine Video" && $file->assetTypes[0] !== "Video"){
                        $downloadUrl = $file->downloadUrl;
                        $streamingUrl = $file->streamingUrl;
                        $url = $file->url;

    					  if($this->config->item("posters_cdn") && $this->config->item("old_cdn") && (strpos($url, ".jpg")!== false || strpos($url, ".jpeg")!== false || strpos($url, ".png")!== false)){
                            $downloadUrl = str_replace($this->config->item("old_cdn"), $this->config->item("posters_cdn"), $downloadUrl);
                            $streamingUrl = str_replace($this->config->item("old_cdn"), $this->config->item("posters_cdn"), $streamingUrl);
                            $url = str_replace($this->config->item("old_cdn"), $this->config->item("posters_cdn"), $url);
  		              }

  		              if($this->config->item("videos_cdn") && $this->config->item("old_cdn") && (strpos($url, ".mp4")!== false || strpos($url, ".mpeg")!== false || strpos($url, ".m3u8")!== false)){
                            $downloadUrl = str_replace($this->config->item("old_cdn"), $this->config->item("videos_cdn"), $downloadUrl);
                            $streamingUrl = str_replace($this->config->item("old_cdn"), $this->config->item("videos_cdn"), $streamingUrl);
                            $url = str_replace($this->config->item("old_cdn"), $this->config->item("videos_cdn"), $url);
    					  }

                        $media[str_replace (" ", "", $file->assetTypes[0])] = array(
                                "downloadUrl" => $downloadUrl,
                                "streamingUrl" => $streamingUrl,
                                "url" => $url
                        );
                    }

	            }
            	unset($media["content"]);
			}
        }
        return $rows;
    }

    function tv_show_trailer_rows($rows){

        foreach ($rows as &$media) {
            $media = (array) $media;
            if($media["seasons"]){
                foreach ($media["seasons"] as &$season) {
                    $season = (array)$season;
                    if($season["episodes"]){
                        foreach ($season["episodes"] as &$episode) {
                            $episode->media = $this->trailer_rows(array($episode->media))[0];
                        }
                    }
                }
            }
        }
        return $this->trailer_rows($rows);
    }

    function tv_show_rows($rows){

        foreach ($rows as &$media) {
            $media = (array) $media;
            if($media["seasons"]){
                foreach ($media["seasons"] as &$season) {
                    $season = (array)$season;
                    if($season["episodes"]){
                        foreach ($season["episodes"] as &$episode) {
                            $episode->media = $this->rows(array($episode->media))[0];
                        }
                    }
                }
            }
        }
        return $this->rows($rows);
    }


    function rows($rows){

        foreach ($rows as &$media) {
            $media = (array) $media;
			if($media["content"]){
	            foreach ($media["content"] as $file) {
                    $downloadUrl = $file->downloadUrl;
                    $streamingUrl = $file->streamingUrl;
                    $url = $file->url;

                    if($this->config->item("posters_cdn") && $this->config->item("old_cdn") && (strpos($url, ".jpg")!== false || strpos($url, ".jpeg")!== false || strpos($url, ".png")!== false)){
                        $downloadUrl = str_replace($this->config->item("old_cdn"), $this->config->item("posters_cdn"), $downloadUrl);
                        $streamingUrl = str_replace($this->config->item("old_cdn"), $this->config->item("posters_cdn"), $streamingUrl);
                        $url = str_replace($this->config->item("old_cdn"), $this->config->item("posters_cdn"), $url);
                    }

                    if($this->config->item("videos_cdn") && $this->config->item("old_cdn") && (strpos($url, ".mp4")!== false || strpos($url, ".mpeg")!== false || strpos($url, ".m3u8")!== false)){
                        $downloadUrl = str_replace($this->config->item("old_cdn"), $this->config->item("videos_cdn"), $downloadUrl);
                        $streamingUrl = str_replace($this->config->item("old_cdn"), $this->config->item("videos_cdn"), $streamingUrl);
                        $url = str_replace($this->config->item("old_cdn"), $this->config->item("videos_cdn"), $url);
                    }

                    $media[str_replace (" ", "", $file->assetTypes[0])] = array(
                            "downloadUrl" => $downloadUrl,
                            "streamingUrl" => $streamingUrl,
                            "url" => $url
                    );
	            }
            	unset($media["content"]);
			}
        }
        return $rows;
    }
}

?>
