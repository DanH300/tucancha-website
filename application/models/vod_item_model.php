<?php

class Vod_item_model extends CI_Model {

    public function __construct() {
        $this->load->helper('uvod_api');
        $this->load->model('fastcache_model');
    }

    public function get_related_items ($id) {

        $parameters = array();
        $parameters["id"] = $id;

        $data = apiCall("vod/get_related_videos", $parameters);

        return $this->rows($data->content->entries);

    }
    

    // get items by ids array
    public function get_items_data($id) {

        ini_set('memory_limit', '1024M');
        $id = implode("|", $id);
        $token = "";
        $data = apiCall("vod/get_items_by_ids", array("ids" => $id, "token" => $token));
        return $this->rows($data->content);
   }

    public function get_by_id($id) {
        //For a series which has a lot of episodes
        ini_set('memory_limit', '1024M');

        $data = apiCall("vod/get_by_id", array("id" => $id));
        $content = $data->content;
    
        if($content->categories && is_array($content->categories)){
            foreach ($content->categories as $cat) {
                if($cat->name === "commerce_transactional_media")
                    return null;
            }
        }

        $tmp = array(
                "aired_date" => $content->aired_date,
                "keywords" => $content->keywords,
                "vod_category"=> $content->vod_category,
                "categories" => $content->categories,
                "_id" => $content->_id,
                "title" => 	$content->title,
                "series_id" => 	$content->series_id,
                "description" => $content->description,
                "media_type" => $content->media_type,
                "aired_date" => $content->aired_date,
                "runtime" => $content->runtime,
                "ratings" => $content->ratings,
                "allowedCountries" => isset($content->allowedCountries)?$content->allowedCountries:null,
                "adPolicyId" => isset($content->adPolicyId)?$content->adPolicyId:null,
                "countries" => $content->countries,
                "season" => isset($content->season)?$content->season:null,
                "episode" => isset($content->episode)?$content->episode:null,
                "activity" => isset($content->activity)?$content->activity:null,
                "identities" => isset($content->identities)?$content->identities:null,
                "referenceId" => isset($content->reference_id)?$content->reference_id:null,
                "eventTeams" => isset($content->eventTeams) ? $content->eventTeams : null,
                "products" => isset($content->products) ? $content->products : null,
                "sportType" => isset($content->sportType) ? $content->sportType : null,
        );

        if($content->content){
            foreach ($content->content as $key => $file) {
                $tmp[$key] = $file;
              }  
          }

        $rows[] = $tmp;
        return $rows;
   }

    public function get_items_related($id, $category, $genre, $featured, $media_type) {
        $parameters = array();
        $parameters["id"] = $id;
        if ($category)
            $parameters["category"] = $category;
        if ($genre)
            $parameters["genre"] = $genre;
        if ($featured)
            $parameters["featured"] = $featured;
        if ($media_type)
            $parameters["media_type"] = $media_type;

        $cache_id = 'vod/list_items_related' . $id . $category . $genre . $media_type;

        $cache = $this->fastcache_model->get_cache($cache_id);

        if (!$cache) {
            $data = apiCall("vod/list_items_related", $parameters);
            $this->fastcache_model->set_cache($cache_id, $data);
        } else {
            $data = $cache;
        }

        return $data;
    }

    public function check_ad_policy_expiration($ids) {
        return apiPost("vod/check_ad_policy_expiration", array('ids' => $ids));
    }

    function rows($data){
        $rows = array();

        foreach ($data as $media) {

            $categories = $media->categories;
            if($media->categories  && sizeof($media->categories > 0) && ($media->categories[0]->name == 'none' || $media->categories[0]->name == '')){
                $categories = null;
            }
            $tmp = array(
                "_id" => $media->_id,
                "title" => 	$media->title,
                "description" => $media->description,
                "added" => $media->added,
                "media_type" => $media->media_type,
                "keywords" => $media->keywords,
                "vod_category"=> $media->vod_category,
                "categories" => $categories,
                "likes" => isset($media->likes) ? $media->likes : null,
                "rating" => isset($media->rating) ? $media->rating : null,
                "seriesId" => 	$media->series_id,
                "aired_date" => $media->aired_date,
                "updated" => $media->updated,
                "adPolicyId" => isset($media->adPolicyId)?$media->adPolicyId:null,
                "allowedCountries" => isset($media->allowedCountries)?$media->allowedCountries:null,
                "countries" => $media->countries,
                "eventTeams" => isset($media->eventTeams) ? $media->eventTeams : null,
                "sportType" => isset($media->sportType) ? $media->sportType : null,
            );
            
            if($media->content){
                foreach ($media->content as $key => $file) {
                    $tmp[$key] = $file;
                  }  
              }

            $rows[] = $tmp;

        }
        return $rows;
    }
}

?>
