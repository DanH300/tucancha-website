uvodApp.service('EpgService', function ($http) {

    this.getEpgHome = function(success,error){
        $http.get("index.php/api/epg/get_epg_home").then(success,error);
    };

    this.getLiveStreams = function(success,error){
        $http.get("index.php/api/vod/get_live_streams").then(success,error);
    };

    this.getEpgById = function(id,success,error){
        $http.get("index.php/api/epg/get_epg_by_id?id=" + id).then(success,error);
    };

    this.getEpgTimelineById = function(id,success,error){
        $http.get("index.php/api/epg/get_epg_timeline_by_id?id=" + id).then(success,error);
    };

    this.getEpgCatchUpById = function(id,success,error){
        $http.get("index.php/api/epg/get_epg_catch_up_by_id?id=" + id).then(success,error);
    };

    this.getEpgData = function(success,error){
        $http.get("index.php/api/epg/get_epg_data").then(success,error);
    };

});
