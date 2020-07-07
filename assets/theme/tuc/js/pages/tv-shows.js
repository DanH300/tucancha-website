var tvs = null;
uvodApp.controller('TvShowsController',
    function($scope, $location, globalFactory, $window) {
        tvs = $scope;
        $scope.title = "TV Shows";
        $scope.seriesInfo = [];
        $scope.mainImage;
        $scope.page = 0;
        $scope.showMore = false;

        $scope.allseries = {
            0: { PosterH: "http://tucancha.ec/assets/theme/tuc/images/series/Day_Time_Live_Shows_Banner.jpg", _id: "58a3226b8120de00042049bc" },
            1: { PosterH: "http://tucancha.ec/assets/theme/tuc/images/series/Ent_Squeeze_Shows_Banner.jpg", _id: "78016038511" },
            2: { PosterH: "http://tucancha.ec/assets/theme/tuc/images/series/ER_Shows_Banner.jpg", _id: "616973379832" },
            3: { PosterH: "http://tucancha.ec/assets/theme/tuc/images/series/Intense_Shows_Banner.jpg", _id: "617005123879" },
            4: { PosterH: "http://tucancha.ec/assets/theme/tuc/images/series/Kwikie_Shows_Banner.jpg", _id: "78016038530" },
            5: { PosterH: "http://tucancha.ec/assets/theme/tuc/images/series/Magnum_Shows_Banner.jpg", _id: "392388163540" },
            6: { PosterH: "http://tucancha.ec/assets/theme/tuc/images/series/SCQ_Shows_Banner.jpg", _id: "335708739578" },
            7: { PosterH: "http://tucancha.ec/assets/theme/tuc/images/series/Shows_Banner_Home_Page.jpg", _id: "578fb80d08995903006ade5a" },
            8: { PosterH: "http://tucancha.ec/assets/theme/tuc/images/series/Smile_Shows_Banner.jpg", _id: "616017475978" },
            9: { PosterH: "http://tucancha.ec/assets/theme/tuc/images/series/Weekend_Smile_Shows_Banner.jpg", _id: "617188419517" }
        };


        $window.scroll(0, 0);
        globalFactory.getAllSeries($scope.page).then(function(data) {
            $scope.series = data;
            $scope.mainImage = "/assets/theme/tuc/images/banners/shows.PNG";
            $scope.showMore = true;
            angular.forEach($scope.series, function(series, k) {
                angular.forEach($scope.allseries, function(value, key) {
                    if (value._id == series._id) {
                        value.seasons_count = series.seasons_count;
                        value.episodes_count = series.episodes_count;
                    }
                });
            });
        })
        $scope.getPage = function(pageNum) {
            $scope.showMore = false;
            globalFactory.getAllSeries(pageNum).then(function(data) {
                var entries = data;
                if (!pageNum)
                    $scope.series = entries;
                else $scope.series = $scope.series.concat(entries);
                if (entries.length < 12) {
                    $scope.showMore = false;
                } else {
                    $scope.showMore = true;
                }
            });
        }

        $scope.nextPage = function() {
            $scope.getPage(++$scope.page);
        }

        $scope.go = function(showId) {
            $location.path('/tv-shows/' + showId);
        };

        $scope.getPosterH = function(video) {
            if (video.PosterH) {
                return video.PosterH.downloadUrl;
            }
            var content = video.content;
            var i;
            for (i = 0; i < Object.keys(content).length; i++) {
                if (content[i].assetTypes[0] == "Poster H") {
                    return content[i].downloadUrl;
                }
            }
        };
    });