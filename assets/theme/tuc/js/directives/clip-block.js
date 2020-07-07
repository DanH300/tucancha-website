uvodApp.directive('clipBlock', function() {
    return {
        restrict: 'E',
        scope: {
            video: '=',
            myList: '=',
            transparent: '@'
        },
        controller: ['$scope', '$rootScope', '$location', 'listFactory', 'User', function clipController($scope, $rootScope, $location, listFactory, User) {

            $scope.addToList = function(video, $event) {
                $event.stopPropagation();
                if (!User._id) {
                    $('.loginModal').modal('show');
                } else {
                    listFactory.addWatchlist(video._id).then(function(response) {
                        if (response) {
                            // $scope.$parent.myList = response;
                            if ($scope.$parent.myList == null){
                                $scope.$parent.myList = [];
                            }
                            
                            $scope.$parent.myList.unshift(video);
                        }

                    });
                }
            };

            $scope.removeFromList = function(video, $event) {
                $event.stopPropagation();
                listFactory.removeWatchlist(video._id).then(function(response) {
                    if (response){
                    $scope.$parent.myList.splice($scope.$parent.myList.getIndexBy("_id", video._id), 1);         
                    }
                            
                });
            };

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

            $scope.go = function(id) {
                $location.path('/vod/' + id);
            };
        }],
        templateUrl: '/assets/theme/tuc/html/directives/clip-block.html'
    };
});