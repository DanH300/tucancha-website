var h = null;
uvodApp.controller('HomeController', function($scope, $rootScope, AuthService, toastr, globalFactory, listFactory, User, $location, vodFactory) {
    h = $scope;
    $scope.user = User;

    $scope.featuredCategories = [];
    $scope.myList = [];
    $scope.watchlistLeft = 0;
    $scope.watchlistCarouselPosition = 0;

    $scope.page = [];
    $scope.page['news'] = 0;
    $scope.page['most_popular'] = 0;
    $scope.page['highlight'] = 0;
    $scope.showMore = [];
    $scope.showMore['news'] = false;
    $scope.showMore['most_popular'] = false;
    $scope.showMore['highlight'] = false;
    $scope.loading = [];
    $scope.loading['news'] = false;
    $scope.loading['most_popular'] = false;
    $scope.loading['highlight'] = false;
    
    $scope.channelIndex = 0;
    $scope.channelCaruselPosition = 0;
    $scope.listCaruselPosition = 0;
    $scope.listMoveLeft = 0;
    $rootScope.metadata = {
        title: 'TuCancha',
        description: 'Watch http://tucancha.ec',
        image: '/assets/theme/tuc/images/logo.png'
    };


    var showTransactionStatus = function(data){
         
        $scope.show_alert_pay_pending = 0;
        transactions = data.content;
       
        for(var i = 0; i < transactions.length ; i++){
            var transaction = transactions[i];

            var today = new Date();
            var day = new Date(transaction.added);

            if((today.getTime() - day.getTime()) <=  3600000 ){
                if(transaction.status == 'PENDING'){
                    $scope.show_alert_pay_pending = 1;
                    toastr.warning('El pago #'+transaction._id+' está en espera aprobación',
                    'Por favor, espere hasta 5 minutos hasta que su pago se procese. Si no realizó ningún pago desestime esta alerta.',
                    {timeOut: 50000});
                    
                }
                else if(transaction.status == 'APPROVED'){
                    $scope.show_alert_pay_pending = 1;
                    toastr.success('El pago #'+transaction._id+' fué aprobado.',
                    {timeOut: 50000});
                }
                else if(transaction.status == 'REJECTED'){
                    $scope.show_alert_pay_pending = 1;
                    toastr.error('El pago #'+transaction._id+' fué rechazado.',
                    {timeOut: 50000});
                }
                else if(transaction.status == 'ERROR'){
                    $scope.show_alert_pay_pending = 1;
                    toastr.error('El pago #'+transaction._id+' tuvo un error.',
                    {timeOut: 50000});
                }
                else if(transaction.status == 'FAILED'){
                    $scope.show_alert_pay_pending = 1;
                    toastr.error('El pago #'+transaction._id+' falló.',
                    {timeOut: 50000});
                }
            }
        }
    }

    var checkTransactions = function (){
        globalFactory.getAllP2PPay().then(function(data){
            globalFactory.getAllP2PPay().then(function(data){
                showTransactionStatus(data);
            });
        });
    }

    /* traigo el profile */
    if($scope.user){
        globalFactory.getProfileCurrent().then(function(data){
            payments = data.paymentData;
            var reqsId;
            for(var i = 0 ; i < payments.length ; i++){
                reqsId.push(payments[i].creditCardId);
            }
        })
          
        checkTransactions();

        globalFactory.getLastContract().then(function(data) {
            $scope.plans = data.content.entries;
            $scope.user.subscriptionPlan = data.content.entries[(data.content.entries.length-1)];
            var subscription = [];
            subscription.push($scope.user.subscriptionPlan)
            AuthService.setSubscription(subscription);  
            console.log(subscription)
        });
        
    }




    $scope.moveLeft = function() {
        if ($scope.channelCaruselPosition == 0) {
            $scope.channelCaruselPosition = 1;
        } else {
            $scope.channelCaruselPosition = 0;
        }
    };

    $scope.moveRight = function() {
        if ($scope.channelCaruselPosition == 0) {
            $scope.channelCaruselPosition = 1;
        } else {
            $scope.channelCaruselPosition = 0;
        }
    };

    $scope.moveListLeft = function() {
        if ($scope.listCaruselPosition > 0) {
            $scope.listCaruselPosition--;
            var left = (-25) * $scope.listCaruselPosition;
            $scope.listMoveLeft = "calc(" + left + "%)";
        }
    };

    $scope.moveListRight = function() {
        if ($scope.myList.length - $scope.listCaruselPosition > 4) {
            $scope.listCaruselPosition++;
            var left = (-25) * $scope.listCaruselPosition;
            $scope.listMoveLeft = "calc(" + left + "%)";
        }
    };

    // Checks whether the date is after now
    $scope.pastDate = function(end) {

        var now = Date.now();
        return (now < end);
    };

    $scope.isAllowed = globalFactory.isAllowed;

    $scope.go = function(path) {
        $location.path('/' + path);
    };

    globalFactory.getSlider().then(function(data) {
        $scope.slider = data;
    });

    listFactory.getWatchlist().then(function(data) {
        if (!data.error) {
            $scope.myList = data;
        }
    });

    globalFactory.getEvents().then(function(response) {
        $scope.events = response.content.entries;
        for (var i = 0; i < $scope.events.length; i++) {
            if ($scope.events[i].live_now) {
                $scope.isLiveEvent = true;
                $scope.liveEvent = $scope.events[i];
            }
        }
    });

    globalFactory.getPpvEvents({}).then(function(response) {
        $scope.ppvEvents = response.content.entries;
    });

    // //Get VOD with Featued Category "most_popular"
    // globalFactory.getByFeaturedCategory('most_popular', 0).then(function(data) {
        
    //     $scope.featuredCategories['most_popular'] = data;
    //     if(data.length < 4){
    //         $scope.showMore['most_popular'] = false;
    //     }else{
    //         $scope.showMore['most_popular'] = true;
    //     }
    // });

    //Get VOD with Featued Category "news"
    // globalFactory.getByFeaturedCategory('news', 0).then(function(data) {
    //     $scope.featuredCategories['news'] = data;
    //     if(data.length < 4){
    //         $scope.showMore['news'] = false;
    //     }else{
    //         $scope.showMore['news'] = true;
    //     }
    // });

    $scope.nextPage = function(category) {
        $scope.page[category]++;
        $scope.nextFeaturedItems(category,$scope.page[category]);
    }

    $scope.nextFeaturedItems = function(category,pageNum) {

        $scope.showMore[category] = false;
        $scope.loading[category] = true;
        globalFactory.getByFeaturedCategory(category,pageNum).then(function(data) {
            
            $scope.featuredCategories[category] = $scope.featuredCategories[category].concat(data);
            
            if(data.length < 4){
                $scope.showMore[category] = false;
            }else{
                $scope.showMore[category] = true;
            }
            $scope.loading[category] = false;
        });
    }

    $scope.$on("auth-login-success", function() {
        listFactory.getWatchlist().then(function(data) {
            if (!data.error) {
                $scope.myList = data;
            }
        });
    });
});


uvodApp.config(["toastrConfig",function(toastrConfig) {

    var options = {
          "closeButton": true,
          "debug": false,
          "newestOnTop": false,
          "progressBar": true,
          "positionClass": "toast-top-right",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        };  

        angular.extend(toastrConfig, options);
}]);
