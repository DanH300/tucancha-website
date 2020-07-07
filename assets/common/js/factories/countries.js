uvodApp.factory("countriesFactory", function($http) {
    return {
        getCountries: function() {
            return $http.get('https://restcountries.eu/rest/v1/all').then(function(data) {
            //    console.log(data);
                return data.data;
            }).catch(function(err){
                // for example, "re-throw" to "hide" HTTP specifics
                return "Data not available";
            })
        }
    }
});
