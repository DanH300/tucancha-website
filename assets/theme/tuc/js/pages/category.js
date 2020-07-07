var ca = null;
uvodApp.controller('CategoryController', function($scope, $routeParams, globalFactory, vodFactory, $location, $window, $document, listFactory, User, GeoService) {
    ca = $scope;
    $scope.title = "Category";
    $scope.selectedChannel = '';
    $scope.page = 0;
    $scope.showMore = false;
    $scope.selectedCategory = $routeParams.categoryName || '';
    $scope.loading = false;
    $scope.dateFromOpen = false;
    $scope.dateToOpen = false;
    $window.scroll(0, 0);
    GeoService.getLocationData()
    .then(function(data) {
        $rootScope.geo = data;
    });

    $scope.selectCategory = function(name) {
        if ($scope.selectedCategory == name)
            $scope.selectedCategory = '';
        else
            $scope.selectedCategory = name;
        $scope.videos = null;
        $scope.getPage(0);
    };

    $scope.selectChannel = function(channel) {
        if (channel == $scope.selectedChannel)
            $scope.selectedChannel = "";
        else
            $scope.selectedChannel = channel;
        $scope.videos = null;
        $scope.getPage(0);
    };


    $scope.clearMenu = function() {
        $scope.selectedChannel = '';
        $scope.selectedChannel = '';
        $scope.dtTo = '';
        $scope.dtFrom = '';
        $scope.videos = null;
        $scope.getPage(0);
    }

    $scope.isAllowed = globalFactory.isAllowed;

    $scope.getPage = function(pageNum) {

        $scope.showMore = false;
        $scope.loading = true;
        vodFactory.getCategoryVids($scope.selectedCategory, pageNum, $scope.selectedChannel, $scope.dtFrom, $scope.dtTo).then(function(data) {
            if (!pageNum)
                $scope.videos = data;
            else $scope.videos = $scope.videos.concat(data);
            if (data.length < 15) {
                $scope.showMore = false;
            } else {
                $scope.showMore = true;
            }
            $scope.loading = false;
        });

    }

    $scope.nextPage = function() {
        $scope.getPage(++$scope.page);
    }

    globalFactory.getCategories().then(function(data) {
        $scope.categories = data;
    });

    globalFactory.getChannels().then(function(data) {
        $scope.channels = data;
    });

    $scope.go = function(url) {
        $location.path('/' + url);
    };

    $scope.addToList = function(video, $event) {
        $event.stopPropagation();
        if (!User._id) {
            $('.loginModal').modal('show');
        } else {
            listFactory.addWatchlist(video._id).then(function(response) {
                if (response) {
                    if ($scope.myList == null)
                        $scope.myList = [];
                    $scope.myList.unshift(video);
                }

            });
        }
    };

    $scope.removeFromList = function(video, $event) {
        $event.stopPropagation();
        listFactory.removeWatchlist(video._id).then(function(response) {
            if (response)
                if ($scope.myList.length == 1)
                    $scope.myList = null;
                else
                    $scope.myList.splice($scope.myList.getIndexBy("_id", video._id), 1);
        });
    };

    $scope.isInWatchlist = function(id) {
        return listFactory.isInWatchlist(id);
    }

    angular.element($window).bind("scroll", function(e) {
        var offset = $window.pageYOffset;
        var winHeight = $window.innerHeight;
        if ($('.category-menu').innerHeight() + 200 > winHeight) {
            if (offset > 300) {
                $('.category-menu').css('top', '' + (offset - 300) + 'px');
            }
        } else {
            $('.category-menu').css('top', '' + (offset) + 'px');
        }
    })

    $scope.openDateFrom = function() {
        $scope.dateFromOpen = true;
    };

    $scope.openDateTo = function() {
        $scope.dateToOpen = true;
    };

    $scope.$watch('dtFrom', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.getPage(0);
        }
    });

    $scope.$watch('dtTo', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.getPage(0);
        }

    });

    $scope.getPage(0);
});