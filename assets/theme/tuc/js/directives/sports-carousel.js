uvodApp.directive('sportsCarousel', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        carouselId : '@'
      },
      controller: ['$scope','$location','$timeout','vodFactory', function sportsCarouselController($scope, $location, $timeout, vodFactory) {
          $scope.caruselPosition = 0;
          $scope.relatedPosition = 0;
          $scope.sports = null;

          $scope.secondaryMoveLeft = function () {
              if ($scope.caruselPosition == 0) {
                  $scope.caruselPosition = 1;
              }else {
                  $scope.caruselPosition = 0;
              }
          }
          $scope.secondaryMoveRight = function () {
              if ($scope.caruselPosition == 0) {
                  $scope.caruselPosition = 1;
              }else {
                  $scope.caruselPosition = 0;
              }
          }
          $scope.moveRelated = function () {
              if ($scope.relatedPosition == 0) {
                  $scope.relatedPosition = 1;
              }else {
                  $scope.relatedPosition = 0;
              }
          }
          $scope.go = function(sportType,sportId){
            $location.path("/activity/"+sportType + "/" + sportId);
          }

          $scope.$watch('sports', function(newVal, oldVal) {
            
            var isInitialized = false;
            if (newVal !== oldVal && !isInitialized) {
    
                isInitialized = true;
            //     $timeout(function(){
            //     $('.sport-container').slick({
            //         nextArrow: '<div class="next sportNext"><i class="icon icon-arrow-right-32x83"></i></div>',
            //         prevArrow: '<div class="prev sportPrev"><i class="icon icon-arrow-left-32x83"></i></div>',
            //         slidesToShow: 6,
            //         slidesToScroll: 6,
            //         infinite: false,
            //          responsive: [
            //              {
            //                breakpoint: 1024,
            //                settings: {
            //                  slidesToShow: 5,
            //                  slidesToScroll: 5,
            //                  infinite: false
            //                }
            //              },
            //              {
            //                breakpoint: 768 ,
            //                settings: {
            //                  slidesToShow: 4,
            //                  slidesToScroll: 4
            //                }
            //              },
            //              {
            //                breakpoint: 600,
            //                settings: {
            //                  slidesToShow: 3,
            //                  slidesToScroll: 3
            //                }
            //              },
            //              {
            //                breakpoint: 480,
            //                settings: {
            //                  slidesToShow: 2,
            //                  slidesToScroll: 2
            //                }
            //              }
            //         ]
            //     });
            // })
            }
        });

        vodFactory.getItemsByType("activity_item", 0, 20, "aired_date", "-1").then(function(data) {
          $scope.sports = data;
      });

      }],

      templateUrl: '/assets/theme/tuc/html/directives/sports-carousel.html'
    };
  })
