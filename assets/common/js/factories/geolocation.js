uvodApp.service("GeoService", function($q, $http) {
    this.getLocationData = function() {
        return $http.get('https://pro.ip-api.com/json/?key=6HnAGUqohlpdJwK').then(function(data) {
            return data.data;
        }).catch(function(err) {
            console.error("GeoService: getLocationData : error Catch", err);
            return { countryCode: 'JM' };
        })

    };
});