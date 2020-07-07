<?php
class Search_model extends CI_Model {

	public function __construct() {
		$this->load->helper('uvod_api');
	}

	public function search_vod($data) {

		 $data = apiCall("vod/search", $data);
		 if ($data->content->entries){
			 $arranged = $this->rows($data->content->entries);
		 }

		//  debug($);
		return $arranged;
	}
	function rows($data){
        $rows = array();
        // debug($data);
        foreach ($data as $media) {
            // debug($media);

            if($media->categories[0]->name !== 'commerce_transactional_media'){
            //debug($media->categories);
                $tmp = array(
                       	"media_type" => $media->media_type,
                        "keywords" => $media->keywords,
                        "vod_category"=> $media->vod_category,
                        "categories" => $media->categories,
                        "_id" => $media->_id,
                        "title" => 	$media->title,
                        "series_id" => 	$media->series_id,
                        "description" => $media->description,
						"aired_date" => $media->aired_date,
						"allowedCountries" => isset($media->allowedCountries)?$media->allowedCountries:null,
						"countries" => $media->countries,
						"eventTeams" => isset($media->eventTeams) ? $media->eventTeams : null,
						"userId" => isset($media->userId) ? $media->userId : null,
						"identityId" => isset($media->identityId) ? $media->identityId : null,
						"activityId" => isset($media->activityId) ? $media->activityId : null,
						"activities" => isset($media->activity) ? $media->activity : null,
				);
				
				if($media->content){
					foreach ($media->content as $key => $file) {
						$tmp[$key] = $file;
					  }  
				  }
              
                $rows[] = $tmp;
            }
        }
        return $rows;
    }
}
?>
