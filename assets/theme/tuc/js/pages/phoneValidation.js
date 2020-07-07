var pv = null;
uvodApp.controller('phoneValidationController',function($scope, AuthService, User, $rootScope, $location, countriesFactory, smsFactory, $timeout) {
    pv = $scope;
    $scope.phone;
    $scope.country=-1;
    $scope.editPhone = true;
    $scope.validationError = '';

    $scope.go = function(path){
        $location.path(path);
    };

    $scope.user = User;
    $timeout(function(){
        if(!$scope.user._id)
            $scope.go("/");

    },50);

    countriesFactory.getCountries().then(function(data){
        $scope.countries= data;
    });

    $scope.user = User;

    $scope.sendSms = function(){
        if($scope.country>=0 && $scope.phone>=100000000)
        {
            $scope.editPhone=false;
            smsFactory.sendValidationSMS($scope.countries[$scope.country].callingCodes[0]+$scope.phone);
        }
    }

    $scope.validate = function(){
        if($scope.code>=99999)
        {
            $scope.validationError = '';
            smsFactory.validatePin($scope.code,$scope.countries[$scope.country].callingCodes[0]+$scope.phone).then(function(data){
                if(data)
                    $scope.go("/");
                else
                    $scope.validationError = "Incorrect Code";
            });
        }
    }





});
