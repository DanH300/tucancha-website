uvodApp.factory("globalFactory", function($http, $q, $rootScope) {
    return {
        isEmpty : function(obj){
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        },

        getSlider: function() {
            return $http.get("index.php/api/vod/get_slider").then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },
        getMainMenu: function() {

            return $http.get("index.php/api/vod/get_main_menu").then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },
        getByFeaturedCategory: function(category,pageNum = 0) {
            return $http.get("index.php/api/vod/get_by_featured_category?category=" + category + "&page=" + pageNum).then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },

        getCategories: function() {
            return $http.get("index.php/api/vod/get_categories").then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },

        getSubscriptionPlans: function() {
            return $http.get("index.php/api/account/get_subscription_plans").then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },

        getLastContract: function() {
            return $http.get("index.php/api/account/get_last_contract").then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },

        createRequest: function(plan){
            
            return $http.get("index.php/api/account/createRequest?plan="+plan._id).then(function(result){
                if(result.error){
                    return result;
                }
                else{
                    return result.data;
                }
             
                
            }).catch(function(err) {
                return $q.reject("Data not available");
            });
        },

        getAllP2PPay : function(){

            // Obtengo listado de todas mis requestId (Transacciones  

            
            return $http.post("index.php/api/account/getAllP2PPay").then(function(result){
                return result.data;
                
                
            }).catch(function(err) {
                return $q.reject("Data not available");
            });

        },

        checkPayP2P: function(requestId){
            
            // Obtengo listado de todas mis requestId (Transacciones)
            // Pregunto Para cada una de estas PENDING el status
            // Si resuelve OK, actualizo billingInfo
            //
            // Si No  muestro TOAST de advertencia de pago pendiente.

            params = { requestId : requestId};
            
            return $http.post("index.php/api/account/checkPayP2P",params).then(function(result){
                return result.data;
                
                
            }).catch(function(err) {
                return $q.reject("Data not available");
            });
        },

        getProfileCurrent: function(){
            return $http.get("index.php/api/account/getProfile").then(function(result){
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            });
        },

        getEvents: function(filters, from = '', to = '') {


            if (from)
                from = from.valueOf();
            else
                from = '';

            if (to)
                to = (new Date(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate(), 23, 59, 59, 999)).valueOf();
            else to = '';

            params = {};
            params.filters = filters;
            params.from = from;
            params.to = to;

            return $http.post("index.php/api/event/list", params).then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },

        getEventById: function(id) {
            return $http.get("index.php/api/event/get_by_id?id=" + id).then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },

        getPpvEvents: function(filters, from = '', to = '') {


            if (from)
                from = from.valueOf();
            else
                from = '';

            if (to)
                to = (new Date(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate(), 23, 59, 59, 999)).valueOf();
            else to = '';

            params = {};
            params.filters = filters;
            params.from = from;
            params.to = to;

            return $http.post("index.php/api/ppv/get_event_list", params).then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },
        getPpvEventById: function(id) {
            return $http.get("index.php/api/ppv/get_event_by_id?id=" + id).then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },
        search: function(keyword, page = 0, filters, from = '', to = '', media_type = '') {
            if (from)
            from = from.valueOf();
            else
                from = '';

            if (to)
                to = (new Date(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate() + 1, 23, 59, 59, 999)).valueOf();
            else to = '';

            params = {};
            params.keyword = keyword;
            params.filters = filters;
            params.page = page;
            params.from = from;
            params.to = to;
            params.media_type = media_type;

            return $http.post("index.php/api/vod/search",params).then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },

        isAllowed: function(vid) {

            var result = true;
            if (vid) {

                var countryIndex = -1;
                if (vid.countries) {
                    countryIndex = vid.countries.indexOf($rootScope.geo.geoplugin_countryCode);
                }

                if (vid.allowedCountries) {
                    result = countryIndex > -1

                }
                if (vid.excludeCountries) {
                    result = !(countryIndex > -1)
                }
            }
            return result;
        },

        getUserClips: function(userId, page = null, size  = null, sort  = null, order  = null, filters  = null) {

            params = {};
            params.userId = userId;
            params.page = page;
            params.size = size;
            params.sort = sort;
            params.order = order;
            params.filters = filters;

            return $http.post("index.php/api/account/get_user_clips", params).then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },

        getUserTransactions: function(userId, page = null, size  = null, sort  = null, order  = null, filters  = null) {

            params = {};
            params.userId = userId;
            params.page = page;
            params.size = size;
            params.sort = sort;
            params.order = order;
            params.filters = filters;

            return $http.post("index.php/api/account/get_wallet_transactions", params).then(function(result) {
                return result.data;
            }).catch(function(err) {
                return $q.reject("Data not available");
            })
        },
    }
});