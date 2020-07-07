var s = null;
uvodApp.controller('SearchController', function($scope, $routeParams, AuthService, $location, User, globalFactory, listFactory, vodFactory, $log, $window) {
    s = $scope;

    $scope.today = new Date();
    $scope.keyWord = $routeParams.keyword;
 
    $scope.page = 0;
    
    $scope.loading = true;
    $scope.isAllowed = globalFactory.isAllowed;
    $scope.dateFromOpen = false;
    $scope.dateToOpen = false;
    $scope.filterList = {};
    $window.scroll(0, 0);

    $scope.search = function(){

        globalFactory.search($scope.keyWord, $scope.page, JSON.stringify($scope.filterList), $scope.dtFrom, $scope.dtTom, 'clip|highlight').then(function(data) {
            $scope.loading = null;
            $scope.videos = [];
            $scope.highlights = [];
            for ( i = 0; i < data.length; i++) {
                if(data[i].media_type === 'clip'){
                    $scope.videos.push(data[i]);
                }else if(data[i].media_type === 'highlight'){
                    $scope.highlights.push(data[i]);
                }                
            }

            if (data.length >= 20)
                $scope.pager = true;
        });
    }
  
    $scope.nextPage = function() {
        $scope.loading = true;
        globalFactory.search($scope.keyWord, ++$scope.page, JSON.stringify($scope.filterList), $scope.dtFrom, $scope.dtTo, 'clip|highlight').then(function(data) {
            $scope.loading = null;
            if (data && data.length)
                $scope.videos = $scope.videos.concat(data);
            if (!data || !data.length || data.length < 20)
                $scope.pager = false;
        });
    };


      //Get Filter options
    globalFactory.getMainMenu().then(function(data) {
        $scope.filters = data;
    });
  

   //Apply filters and reload the results
   $scope.applyFilter = function(mainCategory, category, categoryId, value) {

        if (value) {

            if (!(mainCategory in $scope.filterList)) {
                $scope.filterList[mainCategory] = {};
            }

            if (!(category in $scope.filterList[mainCategory])) {
                $scope.filterList[mainCategory][category] = [];
            }

            $scope.filterList[mainCategory][category].push(categoryId);

        } else {

            //Get index of the category ID
            var index = $scope.filterList[mainCategory][category].indexOf(categoryId);
            if (index > -1) {
                //Remove the category ID from the category array
                $scope.filterList[mainCategory][category].splice(index, 1);

                //Remove the category array if it's empty
                if ($scope.filterList[mainCategory][category].length == 0) {
                    delete $scope.filterList[mainCategory][category];

                    //Remove the mainCategory array if it's empty
                    if (Object.keys($scope.filterList[mainCategory]).length === 0 && $scope.filterList[mainCategory].constructor === Object) {
                        delete $scope.filterList[mainCategory];
                    }
                }
            }
        }
        $scope.search();
    }


    $scope.go = function(object) {
        if (object.media_type == "tv_show") $location.path('/tv-shows/' + object._id);
        else $location.path('/vod/' + object._id);
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

        });
    };

    $scope.isInWatchlist = function(id) {
        return listFactory.isInWatchlist(id);
    }

    $scope.search();

});
