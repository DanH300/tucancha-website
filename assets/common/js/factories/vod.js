uvodApp.factory("vodFactory", function($http, $q) {
    return {

        getItemsByType: function(mediaType, page = null, size = null, sort = null, order = null, customFilter = null) {
            
            params = {};
            params.media_type = mediaType;
            params.page = page;
            params.size = size;
            params.sort = sort;
            params.order = order;
            params.custom_filter = customFilter;

            return $http.post('index.php/api/vod/get_items_by_media_type', params).then(function(result) {
                return result.data;
            }).catch(function(err) {
                // for example, "re-throw" to "hide" HTTP specifics
                return $q.reject("Data not available");
            })
        },
        getVideoById: function(id) {
            return $http.get('index.php/api/vod/get_video_by_id?id=' + id).then(function(result) {
                return result.data;
            }).catch(function(err) {
                // for example, "re-throw" to "hide" HTTP specifics
                return $q.reject("Data not available");
            })
        },

        getIdentityVids: function(identity, identityItem, filters, page = 0, from = '', to = '', mediaType = null) {

            if (from)
                from = from.valueOf();
            else
                from = '';

            if (to)
                to = (new Date(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate(), 23, 59, 59, 999)).valueOf();
            else to = '';

            params = {};
            params.identity = identity;
            params.identityItem = identityItem;
            params.filters = filters;
            params.page = page;
            params.from = from;
            params.to = to;
            params.media_type = mediaType;

            return $http.post('index.php/api/vod/get_identity_videos', params).then(function(result) {

                return result.data;
            }).catch(function(err) {

                return $q.reject("Data not available");
            })
        },

        getActivityVids: function(activity, activityItem, filters, page = 0, from = '', to = '', mediaType = null) {

            if (from)
                from = from.valueOf();
            else
                from = '';

            if (to)
                to = (new Date(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate(), 23, 59, 59, 999)).valueOf();
            else to = '';

            params = {};
            params.activity = activity;
            params.activityItem = activityItem;
            params.filters = filters;
            params.page = page;
            params.from = from;
            params.to = to;
            params.media_type = mediaType;

            return $http.post('index.php/api/vod/get_activity_videos', params).then(function(result) {

                return result.data;
            }).catch(function(err) {

                return $q.reject("Data not available");
            })
        },
  
        getTournamentVids: function(tournamentId, filters, page = 0, from = '', to = '', mediaType = null) {

            if (from)
                from = from.valueOf();
            else
                from = '';

            if (to)
                to = (new Date(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate(), 23, 59, 59, 999)).valueOf();
            else to = '';

            params = {};
            params.tournament_id = tournamentId;
            params.filters = filters;
            params.page = page;
            params.from = from;
            params.to = to;
            params.media_type = mediaType;

            return $http.post('index.php/api/vod/get_tournament_videos', params).then(function(result) {

                return result.data;
            }).catch(function(err) {

                return $q.reject("Data not available");
            })
        },

        getRelatedById: function(id) {
            return $http.get('index.php/api/vod/get_related_by_id?id=' + id).then(function(result) {
                return result.data;
            }).catch(function(err) {
                // for example, "re-throw" to "hide" HTTP specifics
                return $q.reject("Data not available");
            })
        }
    }
});