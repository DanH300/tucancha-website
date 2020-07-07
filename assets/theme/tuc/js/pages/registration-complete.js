var rc = null;
uvodApp.controller('registrationCompleteController',function($scope, globalFactory, AuthService, User, $location) {
    rc = $scope;

    globalFactory.getPpvEvents().then(function(response){
        $scope.events = response.content.entries;
        for (var i = 0; i < $scope.events.length; i++) {
            if($scope.events[i].live_now){
                $scope.isLive = true;
                $scope.liveEvent = $scope.events[i];
            }
        }

    });

    $scope.closeRegistrationComplete = function(){
        $('.registrationComplete').modal('hide');
    }

    $scope.go = function(url){
        $location.path('/' + url);
    };

    $scope.hideLiveEvent = function(){
        $scope.isLive = false;
    }
});
