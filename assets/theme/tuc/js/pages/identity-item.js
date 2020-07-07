var ca = null;
uvodApp.controller('IdentityItemController', function($scope, $rootScope, $routeParams, globalFactory, vodFactory, $location, $window, $document, listFactory, User, GeoService) {
    ca = $scope;
    $scope.title = $routeParams.identityName;
    $scope.selectedChannel = '';
    $scope.page = 0;
    $scope.showMore = false;
    $scope.selectedIdentity = $routeParams.identityName || '';
    $scope.selectedIdentityId = $routeParams.identityItem || '';
    $scope.selectedItemName = '';
    $scope.selectedItemLogo = '';
    $scope.loading = false;
    $scope.dateFromOpen = false;
    $scope.dateToOpen = false;
    $scope.pay = { value : false};
    $scope.showPlans = { value : false};
    $scope.selectedPlan = null;
    $scope.filterList = {};
    $window.scrollTo(0, 0);

    $scope.dtTo = null;
    $scope.dtFrom = null;

    GeoService.getLocationData()
        .then(function(data) {
            $rootScope.geo = data;
        });

    $scope.isAllowed = globalFactory.isAllowed;

    $scope.filterFields = ["Sports", "airedDate"];

    //Paginate
    $scope.getPage = function(pageNum) {

        if ($scope.selectedIdentityId !== "") {
            vodFactory.getVideoById($scope.selectedIdentityId).then(function(item) {
                $scope.identityItem = item[0];
                $scope.selectedItemName = item[0].title;
                $scope.selectedItemLogo = (item[0].PosterH) ? item[0].PosterH.downloadUrl : null;
                $scope.loadVideos(pageNum);
                $scope.getEvents();
                $scope.getHighlights();
            });
        } else {
            $scope.loadVideos(pageNum);
        }
    }

    //Get Videos By mediaType, Identity Type and Id
    $scope.loadVideos = function(pageNum) {

        $scope.showMore = false;
        $scope.loading = true;
        vodFactory.getIdentityVids($scope.selectedIdentity, $scope.selectedIdentityId, JSON.stringify($scope.filterList), pageNum, $scope.dtFrom, $scope.dtTo, "clip").then(function(data) {
            
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

    //Get Live Events by Identity ID
    $scope.getEvents = function(){

        if(globalFactory.isEmpty($scope.filterList)){
            var filter = {};
            
        }else{
            var filter = $scope.filterList;
        }
        
        filter['identities.id'] = $scope.selectedIdentityId;

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

    //Get Highlights by Identity ID
    $scope.getHighlights = function() {
        vodFactory.getIdentityVids($scope.selectedIdentity, $scope.selectedIdentityId, JSON.stringify($scope.filterList), 0, $scope.dtFrom, $scope.dtTo , "highlight").then(function(data) {
            $scope.highlights = data;
         });
    }

    $scope.nextPage = function() {
        $scope.getPage(++$scope.page);
    }


    $scope.go = function(url) {
        $location.path('/identity/' + url);
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

    $rootScope.$on("load-plan", function (event, plan) {
        $scope.selectedPlan = plan;
        if(typeof(plan._id) !== "undefined"){
            $scope.pay.value = true;
        }else{
            $scope.pay.value = false;
        }
        
     });

    $rootScope.$on("show-plans", function (event, show) {

        if(show){
            $scope.showPlans.value = true;
        }else{
            $scope.showPlans.value = false;
        }
        
     });


     $scope.checkout = function(plan){
        if(User._id){
            $rootScope.$broadcast("show-plans", false);
            $rootScope.$broadcast("load-plan", plan);
        }else{
            $('.loginModal').modal('show');
        }
    }

    $scope.getPage(0);
});