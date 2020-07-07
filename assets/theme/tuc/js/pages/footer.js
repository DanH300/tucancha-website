var foo = null;
uvodApp.controller('FooterController', function($scope, $rootScope, $location, globalFactory) {
    foo = $scope;

    // globalFactory.getChannels().then(function (data){
    //     $scope.channels={} = data;
    // });

    $scope.channels = {
        0: { logoLarge: "/assets/theme/tuc/images/logos/fame_logo.png", _id: "78016038529" },
        1: { logoLarge: "/assets/theme/tuc/images/logos/hitz_logo.png", _id: "78016038511" },
        2: { logoLarge: "/assets/theme/tuc/images/logos/jnn_logo.png", _id: "77999142467" },
        3: { logoLarge: "/assets/theme/tuc/images/logos/music99_logo.png", _id: "78016038531" },
        4: { logoLarge: "/assets/theme/tuc/images/logos/power106_logo.png", _id: "78016038530" },
        5: { logoLarge: "/assets/theme/tuc/images/logos/rjr94_logo.png", _id: "78016038538" },
        6: { logoLarge: "/assets/theme/tuc/images/logos/tvj_logo.png", _id: "79336998495" },
        7: { logoLarge: "/assets/theme/tuc/images/logos/tvjsn_logo.png", _id: "105260070736" },
        8: { logoLarge: "/assets/theme/tuc/images/logos/retv_ok.png", _id: "79336998577" }
    };

    $scope.go = function(url) {
        $location.path('/' + url);
    };

});