var ca = null;
uvodApp.controller('ActivityItemController', function($scope, $routeParams, globalFactory, vodFactory, $location, $window, $document, listFactory, User, GeoService) {
    ca = $scope;
    $scope.title = $routeParams.activityName;
    $scope.selectedChannel = '';
    $scope.page = 0;
    $scope.showMore = false;
    $scope.selectedActivityId = $routeParams.activityId || '';
    $scope.selectedActivityItem = $routeParams.activityItem || '';
    $scope.selectedItemName = '';
    $scope.loading = false;
    $scope.dateFromOpen = false;
    $scope.dateToOpen = false;
    $scope.filterList = {};
    $window.scroll(0, 0);
    GeoService.getLocationData()
        .then(function(data) {
            $rootScope.geo = data;
        });
    $scope.dtTo = null;
    $scope.dtFrom = null;

    $scope.clearMenu = function() {
        $scope.selectedChannel = '';
        $scope.selectedChannel = '';
        $scope.dtTo = '';
        $scope.dtFrom = '';
        $scope.videos = null;
        $scope.getPage(0);
    }

    $scope.filterFields = ["Ligas", "airedDate"];
    $scope.isAllowed = globalFactory.isAllowed;

    vodFactory.getVideoById($scope.selectedActivityId).then(function(item) {
        if(item.length > 0){
            $scope.mainActivity = item[0];
        }
    })
    

    //Paginate
     $scope.getPage = function(pageNum) {

        if ($scope.selectedActivityItem !== "") {
            vodFactory.getVideoById($scope.selectedActivityItem).then(function(item) {
                $scope.selectedItemName = item[0].title;
                $scope.selectedItemLogo = item[0].PosterH.downloadUrl;
                $scope.loadVideos(pageNum);
                $scope.getEvents();
                $scope.getHighlights();
            });
        } else {
            $scope.loadVideos(pageNum);
        }
    }

    //Get Videos By mediaType, Activity Type and Id
    $scope.loadVideos = function(pageNum) {
        $scope.showMore = false;
        $scope.loading = true;
        vodFactory.getActivityVids($scope.selectedActivityId, $scope.selectedActivityItem, JSON.stringify($scope.filterList), pageNum, $scope.dtFrom, $scope.dtTo, "clip").then(function(data) {
            
            if (!pageNum)
                $scope.videos = data;
            else {
                $scope.videos = $scope.videos.concat(data);
            }

            if (data.length < 15) {
                $scope.showMore = false;
            } else {
                $scope.showMore = true;
            }
            $scope.loading = false;
        });
    }

    //Get Live Events by Activity ID
    $scope.getEvents = function(){

        if(globalFactory.isEmpty($scope.filterList)){
            var filter = {};
            
        }else{
            var filter = $scope.filterList;
        }

        filter['activity.id'] = $scope.selectedActivityItem;

        globalFactory.getEvents(filter, $scope.dtFrom, $scope.dtTo).then(function(response) {
            $scope.events = response.content.entries;
            for (var i = 0; i < $scope.events.length; i++) {
                if ($scope.events[i].live_now) {
                    $scope.isLiveEvent = true;
                    $scope.liveEvent = $scope.events[i];
                }
            }
        });
    }

    //Get Highlights by Activity ID
    $scope.getHighlights = function() {
      vodFactory.getActivityVids($scope.selectedActivityId, $scope.selectedActivityItem, JSON.stringify($scope.filterList), 0, $scope.dtFrom, $scope.dtTo , "highlight").then(function(data) {
          $scope.highlights = data;
       });
    }

    $scope.nextPage = function() {
        $scope.getPage(++$scope.page);
    }

    $scope.go = function(url) {
        $location.path('/activity/' + url);
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