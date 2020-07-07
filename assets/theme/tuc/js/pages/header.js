var he = null;
uvodApp.controller('HeaderController', function($scope, $rootScope, AuthService, $location, User, vodFactory, GeoService, $log) {
    he = $scope;
    $scope.home = $location.host();
    $scope.searchText = '';
    $scope.user = User;
    $scope.categories = {};
    $scope.channels = {};
    $scope.root = $rootScope;
    $scope.identities= [];
    $scope.activities = [];
    AuthService.getCurrentUser();
    GeoService.getLocationData()
        .then(function(data) {
            $rootScope.geo = data;
        });

    $scope.userRegister = {
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        dni: ''
    };

    $scope.validDni = false;

    vodFactory.getItemsByType('identity|activity', null, null, 'media_type', '1').then(function(response) {

        for (var i = 0; i < response.length; i++) {
            if (response[i].media_type === 'activity') {
                $scope.activities.push(response[i]);
            }else if(response[i].media_type === 'identity'){
                $scope.identities.push(response[i]);
            }
        }
    });

    $scope.hideLiveEvent = function() {
        $scope.isLiveEvent = false;
    }

    $scope.search = function(keyword) {
        if ($scope.searchText) {
            $scope.go('search/' + keyword);
        }
    };

    $scope.go = function(url) {
        $location.path('/' + url);
    };
    $scope.finished_login = function(data) {
        AuthService.getCurrentUser();
    };

    // globalFactory.getMainMenu().then(function(data) {
    //     $scope.menu = data;
    // });

    // globalFactory.getCategories().then(function(data) {
    //     $scope.categories = data;
    // });
    // globalFactory.getChannels().then(function(data) {
    //     $scope.channels = data;
    // });

    $scope.getNotifications = function() {
        $scope.notifications = JSON.parse(window.localStorage.getItem('notificationDisplay'));

    }

    $scope.getNotifications();


    $scope.readNotification = function(notification, $event) {
        $event.stopPropagation();
        // var notificationIds = [];
        // notificationIds.push(notification._id);
        // User.markNotifications(notificationIds, function(data){
        //     $scope.getNotifications();
        // }, function(){})
        for (var i = 0; i < $scope.notifications.length; i++) {

            if ($scope.notifications[i].id == notification.id) {
                $scope.notifications[i].read = true;
            }
        }

        window.localStorage.setItem('notificationDisplay', JSON.stringify($scope.notifications));
    }

    $scope.unreadNotifications = function() {
        var count = 0;
        for (i in $scope.notifications) {
            if ($scope.notifications[i].read == false) {
                count++;
            }

        }

        return count;
    }

    $scope.logout = function() {
        AuthService.logout();
        $scope.user = {};
        $location.url('/');
    };


    $(document).on('click', '.navbar-collapse.in', function(e) {
        if ($(e.target).is('a')) {
            $(this).collapse('hide');
        }
    });

    $scope.validateDni = function () {
        var cad = document.getElementById("dni").value.trim();
        var total = 0;
        var longitud = cad.length;
        var longcheck = longitud - 1;
        
        if (cad !== "" && longitud === 10){
            for(i = 0; i < longcheck; i++){
                if (i%2 === 0) {
                    var aux = cad.charAt(i) * 2;
                    if (aux > 9) aux -= 9;
                    total += aux;
                } else {
                    total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
                }
            }
            
            total = total % 10 ? 10 - total % 10 : 0;
            
            if (cad.charAt(longitud-1) == total) {
            $scope.validDni = true;
        }else{
            $scope.validDni = false;
          }
        } else {
            $scope.validDni = false;
        }
      }


    $scope.openRegisterModel = function() {
        $scope.root.showRegister = true;
        $('.loginModal').modal('show');
    };

    $scope.openLoginModel = function() {
        $scope.root.showRegister = false;
        $('.loginModal').modal('show');
    };

    $scope.$on("auth-login-success", function() {
        $scope.user = angular.copy(User);

        // User.getNotifications(
        //     function(response){
        //         if(!response.data.error){
        //             $scope.notifications = response.data.content.entries;
        //         }
        //     },
        //     function(){

        // });
    });

    // if (OneSignal) {
    //     OneSignal.on('notificationDisplay', function(event) {
    //         console.warn('OneSignal notification displayed:', event);
    //         var arr = JSON.parse(window.localStorage.getItem('notificationDisplay')) ? JSON.parse(window.localStorage.getItem('notificationDisplay')) : [];
    //         event.read = false;
    //         arr.push(event);
    //         window.localStorage.setItem('notificationDisplay', JSON.stringify(arr));
    //         // console.log(JSON.parse(window.localStorage.getItem('notificationDisplay')));
    //         $scope.getNotifications();
    //         /*
    //       {
    //           "id": "ce31de29-e1b0-4961-99ee-080644677cd7",
    //           "heading": "OneSignal Test Message",
    //           "content": "This is an example notification.",
    //           "url": "https://onesignal.com?_osp=do_not_open",
    //           "icon": "https://onesignal.com/images/notification_logo.png"
    //       }
    //       */
    //     });
    // };

    // var event = {
    //     "id": "ce31de29-e1b0-4961-99ee-080644677cd7",
    //     "heading": "OneSignal Test Message",
    //     "content": "This is an example notification.",
    //     "url": "https://onesignal.com?_osp=do_not_open",
    //     "icon": "https://onesignal.com/images/notification_logo.png"
    // }
    // var arr = JSON.parse(window.localStorage.getItem('notificationDisplay'))?JSON.parse(window.localStorage.getItem('notificationDisplay')):[];
    // event.read = false;
    // arr.push(event);
    // window.localStorage.setItem('notificationDisplay', JSON.stringify(arr));

});

var finished_login = function(data) {
    //  	console.log("finished login 0", data);
    $("[ng-controller=HeaderController]").scope().finished_login(data);

};