var ca = null;
uvodApp.controller('IdentityController', function($scope, $routeParams, globalFactory, vodFactory, $location, $window, GeoService) {
    
    ca = $scope;
    $scope.mainIdentity = null,
    $scope.selectedChannel = '';
    $scope.page = 0;
    $scope.selectedIdentityId = $routeParams.identityId || '';
    $scope.loading = false;
    $scope.activeTab = $routeParams.tab;
    $window.scroll(0, 0);
    GeoService.getLocationData()
        .then(function(data) {
            $rootScope.geo = data;
        });

    $scope.isAllowed = globalFactory.isAllowed;

    vodFactory.getVideoById( $scope.selectedIdentityId ).then(function(response) {
        if(response.length > 0){
            $scope.mainIdentity = response[0];
        }
    })

    $scope.getPage = function() {

            var customFilter = {}; 
            customFilter.identityId =  $scope.selectedIdentityId; 

            vodFactory.getItemsByType('identity_item', 0, 50, "title", "1", customFilter).then(function(item) {
                $scope.identities = item;
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