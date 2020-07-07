uvodApp.directive('plansBlock', function() {
    return {
        scope: {
            item: '=',
            number: '=',
            total: '='
         
        },
        controller: ['$scope','$rootScope', 'User',function plansBlockController($scope, $rootScope, User) {
    
            $scope.checkout = function(){
                if(User._id){
                    $rootScope.$broadcast("load-plan", $scope.item);
                    var offsetTop = $("#main-slick").offset().top + 220;
                    $('html, body').animate({
                        scrollTop: offsetTop
                    }, 500);
                }else{
                    $('.loginModal').modal('show');
                }
            }

        }],
        templateUrl: '/assets/theme/tuc/html/directives/plans-block.html'
    };
});