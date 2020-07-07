uvodApp.directive('activityBlock', function() {
    return {
        restrict: 'E',
        scope: {
            mainActivity : '=mainactivity',
            activity: '=',
            myList: '=',
            transparent: '@'
        },
        controller: ['$scope', '$rootScope', '$location', 'listFactory', 'User', function activityController($scope, $rootScope, $location, listFactory, User) {

            

            Array.prototype.getIndexBy = function(name, value) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i][name] == value) {
                        return i;
                    }
                }
                return -1;
            }

            $scope.getPosterH = function(content) {
                if (!content)
                    return;
                var i;
                for (i = 0; i < Object.keys(content).length; i++) {
                    if (content[i].assetTypes[0] == "Poster H") {
                        return content[i].downloadUrl;
                    }
                }
            };

            $scope.isInWatchlist = function(id) {
                return listFactory.isInWatchlist(id);
            }

            $scope.go = function(type,id) {
                $location.path('/activity/' + type + '/'+ id);
            };
        }],
        templateUrl: '/assets/theme/tuc/html/directives/activity-block.html'
    };
});