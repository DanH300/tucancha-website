uvodApp.directive('activityItemCarousel', function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      items: '=',
      activityItemId: '='
    },
    controller: ['$scope', '$location', '$timeout', 'vodFactory', function activtyItemCarouselController($scope, $location, $timeout, vodFactory) {
      $scope.caruselPosition = 0;
      $scope.relatedPosition = 0;
      $scope.defaultPoster = '/assets/theme/tuc/images/no-photo.png';

      $scope.showItem = function (item) {
        console.log(item);
        return true;
      }

      $scope.secondaryMoveLeft = function () {
        if ($scope.caruselPosition == 0) {
          $scope.caruselPosition = 1;
        } else {
          $scope.caruselPosition = 0;
        }
      }
      $scope.secondaryMoveRight = function () {
        if ($scope.caruselPosition == 0) {
          $scope.caruselPosition = 1;
        } else {
          $scope.caruselPosition = 0;
        }
      }
      $scope.moveRelated = function () {
        if ($scope.relatedPosition == 0) {
          $scope.relatedPosition = 1;
        } else {
          $scope.relatedPosition = 0;
        }
      }
      $scope.go = function (tournamentId) {
        $location.path("/tournament/" + tournamentId);
      }



      $scope.$watch('items', function (newVal, oldVal) {
        if (!newVal) return;
        $timeout(function () {
          $('.' + $scope.activityItemId).slick({
            nextArrow: '<div class="next sportNext"><i class="icon icon-arrow-right-32x83"></i></div>',
            prevArrow: '<div class="prev sportPrev"><i class="icon icon-arrow-left-32x83"></i></div>',
            slidesToShow: 6,
            slidesToScroll: 6,
            infinite: false,
            responsive: [{
                breakpoint: 1024,
                settings: {
                  slidesToShow: 5,
                  slidesToScroll: 5,
                  infinite: false
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 4
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
                }
              }
            ]
          });
        })
      });
    }],
    templateUrl: '/assets/theme/tuc/html/directives/activity-item-carousel.html'
  };
})