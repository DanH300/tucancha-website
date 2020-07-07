uvodApp.directive('mainslick', function() {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            selecteditem: '@'
        },

        controller: ['$scope','$window','$rootScope', function mainSlickController($scope, $window, $rootScope) {

        $scope.showRows = false,

        $scope.goToElement = function(element){
            var scrollTop = $(window).scrollTop();
            var elementOffset = $("#" + element).offset().top;
            var distance = (elementOffset - scrollTop) - 90;
            $("html,body").animate({scrollTop: distance}, 800);
        }

        $scope.back = function() {
           $window.history.back();
        };

        $scope.showPlans = function(value){
            $rootScope.$broadcast("show-plans", value); 
            $scope.showRows = value;

            // var elementOffset = $("#checkout-form").scrollTop();
            $('html, body').animate({
                scrollTop: $("#plan-row-content").offset().top
            }, 2000);
    

        }
           
        }],
        templateUrl: '/assets/theme/tuc/html/directives/main-slick.html'
    };
});