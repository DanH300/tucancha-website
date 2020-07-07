uvodApp.factory("listFactory", function($http, $q, AuthService, User) {
    return {
        getWatchlist: function() {
            return $http.get('index.php/api/vod/get_watchlist').then(function(result) {
                return result.data;
            }).catch(function(err){
                // for example, "re-throw" to "hide" HTTP specifics
                return null;
            })
        },
        addWatchlist: function(id) {
            return $http.post('index.php/api/vod/add_to_watchlist', {video_id:id}).then(function(result) {
                if(!result.data.error){
                    User.watchlist = result.data.content;
                } 
                return result.data.content;
            }).catch(function(err){
               // for example, "re-throw" to "hide" HTTP specifics
               return null;
            })
        },
        removeWatchlist: function(id) {
            return $http.post('index.php/api/vod/remove_from_watchlist' , {video_id:id}).then(function(result) {
                if(!result.data.error){
                    User.watchlist = result.data.content;
                }
                return result.data.content;
            }).catch(function(err){
                // for example, "re-throw" to "hide" HTTP specifics
                return null;
            })
        },
        isInWatchlist: function(id){
            if(User._id && User.watchlist){
                if(User.watchlist.indexOf(id) != -1){
                    return true;
                }
                return false;
            }
            else{
                return false;
            }
        }
    }
});
