uvodApp.service('ApiService', function ($http) {

    this.getSlider = function(success,error){
        $http.get("index.php/api/vod/get_slider").then(success,error);
    };

    this.getNewReleases = function(success,error){
        $http.get("index.php/api/vod/get_new_release").then(success,error);
    };

    this.getRecommended = function(success,error){
        $http.get("index.php/api/vod/get_recommended").then(success,error);
    };

    this.getVideo = function(id,success,error){
        $http.get("index.php/api/vod/get_video_by_id?id="+id).then(success,error);
    };

    this.getCategories = function(success,error){
        $http.get("index.php/api/vod/get_categories").then(success,error);
    };

    this.getChannels = function(success,error){
        $http.get("index.php/api/channel/get_all_channels").then(success,error);
    };

    this.getAllSeries = function(page, success, error){
        $http.get("index.php/api/vod/get_all_series" + "?page=" + page).then(success,error);
    };

    this.getSeries = function(id, success,error){
        $http.get("index.php/api/vod/get_seasons_episodes?id="+id).then(success,error);
    };

    this.getSubscriptionPlans = function(success,error){
        $http.get("index.php/api/account/get_subscription_plans").then(success,error);
    };

    this.getLiveStreams = function(success,error){
        $http.get("index.php/api/vod/get_live_streams").then(success,error);
    };

    this.getPpvEvents = function(success,error){
        $http.get("index.php/api/ppv/get_event_list").then(success,error);
    };

    this.getPpvEventById = function(id, success,error){
        $http.get("index.php/api/ppv/get_event_by_id?id=" + id).then(success,error);
    };

    this.search = function(keyword, success,error){
        $http.get("index.php/api/vod/search?keyword=" + keyword).then(success,error);
    };


});
