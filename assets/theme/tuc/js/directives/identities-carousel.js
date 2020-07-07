uvodApp.directive('identitiesCarousel', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        carouselId : '@'
      },
      controller: ['$scope','$location','$interval','$timeout','globalFactory', function identitiesCarouselController($scope, $location, $interval, $timeout, globalFactory) {
          $scope.caruselPosition = 0;
          $scope.relatedPosition = 0;
          $scope.identities = null;

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
          $scope.go = function(identityType,identityId){
            $location.path("/identity/"+identityType + "/" + identityId);
          }

          $scope.$watch('identities', function(newVal, oldVal) {
            
            var isInitialized = false;
            if (newVal !== oldVal && !isInitialized) {
    
                isInitialized = true;
                $timeout(function(){
                $('.identity-container').slick({
                    nextArrow: '<div class="next identityNext"><i class="icon icon-arrow-right-32x83"></i></div>',
                    prevArrow: '<div class="prev identityPrev"><i class="icon icon-arrow-left-32x83"></i></div>',
                    slidesToShow: 6,
                    slidesToScroll: 6,
                    infinite: false,
                    responsive: [
                        {
                          breakpoint: 1024,
                          settings: {
                            slidesToShow: 5,
                            slidesToScroll: 1,
                            infinite: true
                          }
                        },
                        {
                          breakpoint: 600,
                          settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                          }
                        },
                        {
                          breakpoint: 480,
                          settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                          }
                        }
                    ]
                });
            })
            }
        });

        globalFactory.getIdentities().then(function(data) {
            $scope.identities = data;
        });

      }],

      templateUrl: '/assets/theme/tuc/html/directives/identities-carousel.html'
    };
  })
