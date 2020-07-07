var fbf = null;
uvodApp.factory("socialFactory", function ($http, $location, $rootScope, User, $q, $interval) {
    var scope = {};
    fbf = scope;
    
    scope.postTwitterStatus = function (item, image) {
        var status = {};
        status.link = $location.absUrl();
        status.message = item.title;
        status.picture = image;
        $http({
            method: 'POST',
            url: '/api/social/post_twitter_status',
            data: status
        }).success(function (data, status, headers, config) {
            //	console.log('save profile success', data);
        }).error(function (data, status, headers, config) {
            //		console.log('save profile error', data);
        });
    }

    return scope;

});
