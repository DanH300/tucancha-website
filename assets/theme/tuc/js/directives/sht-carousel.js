uvodApp.directive('rjrCarousel', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            model: '=',
            autoPlay: '=',
            index: '=',
            watchlist: '='
        },
        controller: ['$scope', '$rootScope', '$location', 'listFactory', 'User', function rjrCarouselController($scope, $rootScope, $location, listFactory, User) {
            sca = $scope;
            $scope.setupCarousel = function(model) {
                setTimeout(function() {
                    $('.tuc-carousel-' + $scope.index).slick({
                        nextArrow: '<div class="next pr"><i class="icon icon-arrow-right-32x83"></i></div>',
                        prevArrow: '<div class="prev pr"><i class="icon icon-arrow-left-32x83"></i></div>',
                        dots: false,
                        infinite: true,
                        speed: 300,
                        centerMode: true,
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        initialSlide: 1,
                        autoplay: $scope.autoPlay,
                        autoplaySpeed: 2000,
                        centerPadding: '40px',
                        responsive: [{
                                breakpoint: 1400,
                                settings: {
                                    slidesToShow: 3,
                                    infinite: true
                                }
                            },
                            {
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 2,
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 2,
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: false,
                                    autoplay: false,
                                    centerMode: true,
                                    swipeToSlide: true,
                                    slidesToShow: 1,
                                }
                            }
                        ]
                    });
                }, 0);
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
                    if ($scope.watchlist && response)
                        if ($scope.model.length == 1)
                            $scope.model = null;
                        else
                            $scope.model.splice($scope.model.getIndexBy("_id", video._id), 1);
                });
            };

            $scope.isInWatchlist = function(id) {
                return listFactory.isInWatchlist(id);
            }

            $scope.subscriptionType = function(type) {
                if (type == "commerce_free_media") {
                    return 'free';
                }
                if (type == "commerce_members_media") {
                    return 'member';
                }
                if (type == "commerce_subscription_basic_media") {
                    return 'subscribe';
                }
                return 'free';
            };

            $scope.getPosterH = function(video) {
                if (angular.isUndefined(video)) {
                    return "";
                }
                if (video.PosterH) {
                    return video.PosterH.downloadUrl;
                }
                if (angular.isUndefined(video.content)) {
                    return "";
                }
                var content = video.content;
                var i;
                for (i = 0; i < Object.keys(content).length; i++) {
                    if (content[i].assetTypes[0] == "Poster H") {
                        return content[i].downloadUrl;
                    }
                }
            };
            $scope.$watchCollection("model", function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $('.tuc-carousel-' + $scope.index).slick('unslick');
                    $scope.setupCarousel($scope.model);
                }
            });
            $scope.go = function(path) {
                $location.path(path);
            }
        }],
        link: function(scope, element, attrs) {
            scope.setupCarousel(scope.model);

        },
        templateUrl: '/assets/theme/tuc/html/directives/tuc-carousel.html'
    };
})