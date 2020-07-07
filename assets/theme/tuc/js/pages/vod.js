var vo = null;
uvodApp.controller('VodController', function($scope, vodFactory, $window, AuthService, listFactory, globalFactory, User, $location, $routeParams) {
    vo = $scope;
    $scope.title = "Video on Demand";
    $scope.urlSplit = $location.absUrl().split("#!")
    $scope.encodedUrl = $scope.urlSplit[0] + "%23!" + $scope.urlSplit[1];
    // AuthService.getCurrentUser();
    $scope.allowAccess = true;
    $scope.loading = true;
    $scope.user = User;
    $scope.isAllowed = globalFactory.isAllowed;

    $scope.facebookShare = function() {
        const meta = btoa(JSON.stringify({
            image: $scope.video.PosterH,
            description: $scope.video.description ? utf8_encode($scope.video.description) : null,
            title: $scope.video.title ? utf8_encode($scope.video.title) : null
        }));
        console.log($location.absUrl() + '?meta=' + meta);
        FB.ui({
            method: 'share',
            href: $location.absUrl().split("?")[0] + '?meta=' + meta,
          }, function(response){});
    }
    $window.scroll(0, 0);
    vodFactory.getVideoById($routeParams.vodId).then(function(data) {
        $scope.video = data[0];
        $scope.addTwitterMeta($scope.video);
        $scope.videoType = ($scope.video.categories && $scope.video.categories.length > 0) ? $scope.video.categories[0].name : 'commerce_free_media';
        $scope.videoRating = ($scope.video.ratings && $scope.video.ratings.length > 0) ? ($scope.video.ratings[0] ? $scope.video.ratings[0].rating : 'G') : 'G';
        $scope.loading = false;
        vodFactory.getRelatedById($scope.video._id).then(function(data) {
            $scope.related = data;
        });
        $scope.getPermissions();
    });

    $scope.$on("auth-login-success", function() {
        $scope.user = angular.copy(User);
        $scope.getPermissions();
    });

    $scope.go = function(path) {
        $location.path(path);
    };

    $scope.hasAccess = function() {
        if ($scope.video) {
            if ($scope.video.categories && $scope.video.categories.length)
                if ($scope.video.categories[0]) {
                    if ($scope.video.categories[0].name == '' || $scope.video.categories[0].name == 'none' || $scope.video.categories[0].name == 'commerce_free_media')
                        return true;
                    else if ($scope.video.categories[0].name == "commerce_members_media")
                        return User._id;
                    else if ($scope.video.categories[0].name == 'commerce_subscription_basic_media');
                    return User.subscriptionPlan;
                }
        }
        return true;
    }

    $scope.getPermissions = function() {
        if ($scope.videoType == 'commerce_free_media' || $scope.videoType == '' || $scope.videoType == 'none') {
            $scope.allowAccess = true;
            return;
        }
        if ($scope.videoType == 'commerce_subscription_basic_media') {
            if (!$scope.user.subscriptionPlan) {
                $scope.permission = 'Subscribed';
                $scope.allowAccess = false;
                return;
            } else {
                $scope.permission = '';
            }
        }
        if (angular.isUndefined($scope.user._id) || $scope.user._id == null) {
            $scope.permission = 'a Member';
            $scope.allowAccess = false;
            return;
        }
        $scope.allowAccess = true;
    };

    $scope.addToList = function(video, $event) {
        $event.stopPropagation();
        if (!User._id) {
            $('.loginModal').modal('show');
        } else {
            listFactory.addWatchlist(video._id);
        }
    };

    $scope.removeFromList = function(video, $event) {
        $event.stopPropagation();
        listFactory.removeWatchlist(video._id).then(function(response) {
            if (response)
                if ($scope.myList && $scope.myList.length == 1)
                    $scope.myList = null;
                else
                    $scope.myList.splice($scope.myList.getIndexBy("_id", video._id), 1);
        });
    };

    $scope.isInWatchlist = function(id) {
        return listFactory.isInWatchlist(id);
    }



    $scope.openLoginModel = function() {
        $('.loginModal').modal('show');
    };

    $scope.addTwitterMeta = function(data) {
        $("meta[name='twitter\\:title']").attr("content", data.title);
        $("meta[name='twitter\\:description']").attr("content", data.description);
        $("meta[name='twitter\\:image']").attr("content", data.PosterH);
    }

});