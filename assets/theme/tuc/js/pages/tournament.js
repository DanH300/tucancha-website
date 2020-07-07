var ca = null;
uvodApp.controller('TournamentController', function ($scope, $routeParams, globalFactory, vodFactory, $location, $window, GeoService) {

    ca = $scope;
    $scope.selectedChannel = '';
    $scope.page = 0;
    $scope.loading = false;
    GeoService.getLocationData()
        .then(function (data) {
            $rootScope.geo = data;
        });
    $window.scroll(0, 0);
    $scope.isAllowed = globalFactory.isAllowed;
    $scope.activityItems = [];
    $scope.classifiedTournaments = {
        others: []
    };

    $scope.getPage = function () {

        vodFactory.getItemsByType('tournament').then(function (items) {
            items.forEach(tournament => {
                if (tournament.activities) {
                    if (!$scope.classifiedTournaments[tournament.activities.id]) {
                        $scope.classifiedTournaments[tournament.activities.id] = [];
                    }
                    $scope.classifiedTournaments[tournament.activities.id].push(tournament);
                } else {
                    $scope.classifiedTournaments.others.push(tournament);
                }
            });
        });

        vodFactory.getItemsByType('activity_item').then(function (item) {
            $scope.activityItems = item;
        });
    }

    $scope.go = function (url) {
        $location.path('/' + url);
    };


    $scope.getPage();
});