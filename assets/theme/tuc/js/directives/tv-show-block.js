uvodApp.directive('tvShowBlock', function() {
    return {
        restrict: 'EA',
        scope: {
            block: '=',
            hrefBase: '@'
        },
        controller: ['$scope', '$rootScope', '$location', 'User', function tvShowController($scope, $rootScope, $location, User) {

            $scope.user = User;

            $scope.$watch(
                "user._id",
                (newVal, oldVal) => {
                    $scope.check_subscription();
                },
                true
            );

            $scope.check_subscription = function() {
                if ($scope.user.transactionalPlans) {
                    var now = (new Date()).valueOf();
                    $scope.user.transactionalPlans.forEach(plan => {
                        if (plan.media_id == $scope.block._id && now < plan.contractEndDate && now > plan.contractStartDate)
                            $scope.validUntil = plan.contractEndDate;
                    });
                }
            }

            $scope.go = function(id) {
                if (!$scope.hrefBase)
                    $scope.hrefBase = "tv-shows";
                $location.path('/' + $scope.hrefBase + '/' + id);
            };
        }],
        templateUrl: '/assets/theme/tuc/html/directives/tv-show-block.html'
    };
});