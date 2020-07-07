uvodApp.factory("tVodFactory", function($http, $q) {
    return {
       list_clips: function(ids = '', page = 0, size = 20) {
           return $http.get('index.php/api/tvod/clips?ids='+ ids +'&page=' + page + '&size=' + size).then(function(result) {
               return result.data;
           }).catch(function(err){
              return $q.reject("Data not available");
             })
        },
        list_shows: function(ids = '', page = 0, size = 20) {
            return $http.get('index.php/api/tvod/shows?ids='+ ids +'&page=' + page + '&size=' + size).then(function(result) {
                return result.data;
            }).catch(function(err){
               return $q.reject("Data not available");
              })
         },
        listFeatured: function(ids = '', page = 0, size = 20) {
            return $http.get('index.php/api/tvod/featured').then(function(result) {
                return result.data;
            }).catch(function(err){
               return $q.reject("Data not available");
              })
         },
        get_tvod: function(id, plans) {
            return $http.get('index.php/api/tvod/item?id='+id+"&plans="+JSON.stringify(plans)).then(function(result) {
                return result.data;
            }).catch(function(err){
               // for example, "re-throw" to "hide" HTTP specifics
               return $q.reject("Data not available");
              })
        },
        get_tvod_item: function(id, plans) {
            var deffered = $q.defer();
            $http({method: 'POST', url: 'index.php/api/tvod/tvod_item', data: {id: id, plans: JSON.stringify(plans) } }).
            then(function(data, status, headers, config) {
                deffered.resolve(data.data);
            }).
            catch(function(data, status, headers, config) {
                deffered.reject(data)
            });
            return deffered.promise;
        }

     }
});
