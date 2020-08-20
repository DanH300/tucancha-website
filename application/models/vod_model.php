<?php

class Vod_model extends CI_Model {

    public function __construct() {
        $this->load->helper('uvod_api');
        $this->load->model("vod_item_model");
    }

    public function list_items($page = null, $size = null, $sort = null, $order = null, $filters= null){
       
        $parameters = array();

        if($page){
            $parameters["page"] = $page;
        }
        if($size){
            $parameters["size"] = $size;
        }
        if($sort){
            $parameters["sort"] = $sort;
        }
        if($order){
            $parameters["order"] = $order;
        }
        if(!$filters){
            $filters = new stdClass();
        }

        $filters->isTest = "false{boolean}";  
        $parameters["filters"] = $filters;

        $data = apiPost("vod/list", $parameters);
        return $this->rows($data->content->entries);
    } 

    public function list_tournaments(){
        $data = apiCall("tournament/list");
        return $this->rows($data->content->entries);
    }

    public function get_tournament_by_id($id){
        $parameters = array();
        $parameters["id"] = $id;
        
        $data = apiCall("tournament/get_by_id",$parameters);
        return $this->rows($data->content->entries);
    }

    public function get_tournament_videos($tournament, $filters_json, $page = null, $date = null, $media_type = null) {
       
        $parameters = array();
        $params = array();
        // debug($identity);
  
		$filters = json_decode($filters_json);

        if(sizeof((array)$filters) > 0){
            
            foreach ($filters as $key => $value) {

                foreach ($value as $k => $item) {
                    if(!array_key_exists( $key. "_type", $parameters)){
                        $parameters[ $key. "_type"] = $k;
                    } else{
                        $parameters[ $key. "_type"] .= "|" . $k;
                    }
                    for ($i=0; $i < sizeof($item); $i++) { 
                        if(!array_key_exists($key . "_id", $parameters)){
                            $parameters[$key . "_id"] = "";
                        } else{
                            $parameters[$key . "_id"] .= "|";
                        }
                        $parameters[$key . "_id"] .= $item[$i];
                    }
                   
                }
			}
        }
        
        $filters = new stdClass();

        if(isset($parameters["identity_type"]) && $parameters["identity_type"]!== ""){
            $filters->{"identities.type"} = $parameters["identity_type"];
        }

        if(isset($parameters["identity_id"]) && $parameters["identity_id"] !== ""){
            $filters->{"identities.id"} =  $parameters["identity_id"];
        }
        if(isset($parameters["activity_type"]) && $parameters["activity_type"] !== ""){
            $filters->{"activity.type"} = $parameters["activity_type"];
        }
        if(isset($parameters["activity_id"]) && $parameters["activity_id"] !== ""){
            $filters->{"activity.id"} = $parameters["activity_id"];
        }
       
        $params["size"] = "20";
        $params["sort"] = "aired_date";
        $params["order"] = "DESC";
        $params["page"] = $page;

        $filters->tournamentId = $tournament;

        if($media_type){
            $filters->media_type = $media_type;
        }
        if($date)
            $filters->aired_date = $date;

        $filters->isTest = "false{boolean}";    
        $params["filters"] = $filters;
    
        $videos =  apiPost("vod/list", $params);
        return $this->rows($videos->content->entries);
    }


    public function get_videos_by_identity($identity, $identityItem, $filters_json, $page = null, $date = null, $media_type = null) {
        
        $parameters = array();
        $params = array();

   
       
        $params["size"] = "20";
        $params["sort"] = "aired_date";
        $params["order"] = "DESC";
        $params["page"] = $page;

        $filter = json_decode($filters_json);

        if($media_type){
            $filter->media_type = $media_type;
        }
        if($date){
            $filter->aired_date = $date;
        }

        if($identityItem && $identityItem !==""){
            $filter->{"identities.id"} = $identityItem;
        }
        
        $filter->isTest = "false{boolean}";  
        $params["filters"] = $filter;

        $videos =  apiPost("vod/list", $params);
        return $this->rows($videos->content->entries);
    }

    public function get_videos_by_activity($activity, $activityItem, $filters_json, $page = null, $date = null, $media_type = null) {
        
        $parameters = array();
        $params = array();       

        $params["size"] = "20";
        $params["sort"] = "aired_date";
        $params["order"] = "DESC";
        $params["page"] = $page;

        $filters = json_decode($filters_json);

        if($media_type){
            $filters->media_type = $media_type;
        }
        if($date){
            $filters->aired_date = $date;
        }

        if($activityItem && $activityItem !==""){
            $filters->{"activity.id"} = $activityItem;
        }

        $filters->isTest = "false{boolean}";  
        $params["filters"] = $filters;
        
        $videos =  apiPost("vod/list", $params);
        return $this->rows($videos->content->entries);
    }


    public function get_slider() {

        return  apiCall("resources/slider");
    }
   

    public function get_watchlist($data){
        
        $res =  apiCall("user/get_watchlist", $data);
        if(!$res->error){
            return $this->rows($res->content);
        }

        return $res;
    }

    public function add_to_watchlist($data){
        return apiPost("user/add_to_watchlist", $data);
    }

    public function remove_from_watchlist($data){
        return apiPost("user/remove_from_watchlist", $data);
    }

    function rows($data){
        $rows = array();

        foreach ($data as $media) {
            $categories = $media->categories;
            if($media->categories  && $media->categories[0] && ($media->categories[0]->name == 'none' || $media->categories[0]->name == '')){
                $categories = null;
            }

            if($media->categories[0]->name !== 'commerce_transactional_media'){
              $tmp = array(
                      "added" => $media->added,
                      "media_type" => $media->media_type,
                      "keywords" => $media->keywords,
                      "vod_category"=> $media->vod_category,
                      "categories" => $categories,
                      "_id" => $media->_id,
                      "title" => 	$media->title,
                      "series_id" => 	$media->series_id,
                      "description" => $media->description,
                      "aired_date" => $media->aired_date,
                      "media_type" => $media->media_type,
                      "updated" => $media->updated,
                      "adPolicyId" => isset($media->adPolicyId)?$media->adPolicyId:null,
                      "allowedCountries" => isset($media->allowedCountries)?$media->allowedCountries:null,
                      "countries" => $media->countries,
                      "eventTeams" => isset($media->eventTeams) ? $media->eventTeams : null,
                      "userId" => isset($media->userId) ? $media->userId : null,
                      "identityId" => isset($media->identityId) ? $media->identityId : null,
                      "activityId" => isset($media->activityId) ? $media->activityId : null,
                      "activities" => isset($media->activity) ? $media->activity : null,
              
              );

              if(isset($media->sportType)){
                $tmp['sportType'] = $media->sportType;
              }
              
              if($media->content){
                foreach ($media->content as $key => $file) {
                    $tmp[$key] = $file;
                  }  
              }
              
              if($media->media_type == "tv_show"){
                  $tmp["seasons_count"] = $media->seasons_count;
                  $tmp["episodes_count"] = $media->episodes_count;
                  $tmp["ratings"] = $media->ratings;
              }
              $rows[] = $tmp;
            }
        }
		return $rows;
	}
}

?>
