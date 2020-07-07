uvodApp.directive('tvodBlock', function() {
    return {
        restrict: 'EA',
        scope: {
            video: '=',
            section: '@'
        },
        controller: ['$scope', '$rootScope', '$location', 'User', function tVodController($scope, $rootScope, $location, User) {

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
                        if (plan.media_id == $scope.video._id && now < plan.contractEndDate && now > plan.contractStartDate)
                            $scope.validUntil = plan.contractEndDate;
                    });
                }
            }

            $scope.go = function(path) {
                $location.path(path);
            }
        }],
        templateUrl: '/assets/theme/tuc/html/directives/tvod-block.html'
    };
});