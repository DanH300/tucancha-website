var ca = null;
uvodApp.controller('ActivityController', function($scope, $routeParams, globalFactory, vodFactory, $location, $window, GeoService) {
    
    ca = $scope;
    $scope.selectedChannel = '';
    $scope.page = 0;
    $scope.selectedActivityId = $routeParams.activityId || '';
    $scope.loading = false;
    $window.scroll(0, 0);
    GeoService.getLocationData()
        .then(function(data) {
            $rootScope.geo = data;
        });

    $scope.isAllowed = globalFactory.isAllowed;

    vodFactory.getVideoById( $scope.selectedActivityId ).then(function(response) {
        if(response.length > 0){
            $scope.mainActivity = response[0];
        }
    })

    $scope.getPage = function() {

        var customFilter = {}; 
        customFilter.activityId =  $scope.selectedActivityId; 

        vodFactory.getItemsByType('activity_item', 0, 50, null, null, customFilter).then(function(item) {
            $scope.activities = item;
        });
     
    }

    $scope.nextPage = function() {
        $scope.getPage(++$scope.page);
    }

    $scope.go = function(url) {
        $location.path('/' + url);
    };

    // angular.element($window).bind("scroll", function(e) {
    //     var offset = $window.pageYOffset;
    //     var winHeight = $window.innerHeight;
    //     if ($('.category-menu').innerHeight() + 200 > winHeight) {
    //         if (offset > 300) {
    //             $('.category-menu').css('top', '' + (offset - 300) + 'px');
    //         }
    //     } else {
    //         $('.category-menu').css('top', '' + (offset) + 'px');
    //     }
    // })

    $scope.getPage();
});