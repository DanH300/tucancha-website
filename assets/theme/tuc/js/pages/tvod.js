var tvod = null;
uvodApp.controller('tvodController', function($scope, User, $routeParams, AuthService, globalFactory, tVodFactory, $location) {
    tvod = $scope;

    $scope.activeTab = 'tv_show';

    $scope.user = User;

    $scope.$watch('user', function(newValue, oldValue) {
        if ($scope.user.transactionalPlans && $scope.user.transactionalPlans.length)
            $scope.getMyTVods();
    }, true);

    tVodFactory.list_clips().then(function(data) {
        $scope.transVideos = data;
    });

    tVodFactory.list_shows().then(function(data) {
        $scope.transShows = data;

    });

    $scope.sort = function(field) {
        $scope.sortField = field;
    }

    tVodFactory.listFeatured().then(function(data) {
        $scope.featuredTransVideos = data;
    });

    $scope.getMyTVods = function() {

        var ids = [];
        $scope.user.transactionalPlans.forEach(plan => {
            if (plan.contractEndDate >= (new Date()).valueOf() && plan.media_id)
                ids.push(plan.media_id);
        });

        if (ids.length >= 1) {
            tVodFactory.list_clips(ids.join("|")).then(function(data) {
                $scope.myTransClips = data;
            });
            tVodFactory.list_shows(ids.join("|")).then(function(data) {
                $scope.myTransShows = data;
            });
        }

    }

    $scope.go = function(path) {
        $location.path(path);
    }

    $scope.slides = [
        { image_url: "/assets/theme/tuc/images/banners/Magnum_Banner.jpg", _id: "78016038529" },
        { image_url: "/assets/theme/tuc/images/banners/Smile_Banner.jpg", _id: "78016038511" }
    ];

});