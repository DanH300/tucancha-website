var su = null;
uvodApp.controller('SubscriptionController', function($scope, globalFactory, AuthService,toastr, User, $location, $rootScope, $log, $window) {
    su = $scope;
    // AuthService.getCurrentUser();
    $scope.user = User;
    $window.scroll(0, 0);
    $scope.submitted = {
        payment: false
    };
    $scope.payment = $scope.user.billingInfo;
    $scope.pay = false;
    $scope.plans = {};
    $scope.currentPlan = {};
    $scope.wallet =  User.wallet || null;
    $scope.campain = false;
    $scope.shippingInfo = {};
    $scope.campainMessage = false;
    $scope.paymentType = "none";

    $scope.subscribe = function(form) {
        if (form.$invalid) {
            $scope.submitted.payment = true;
            return;
        }
        $scope.subscribing = true;
        $scope.payment.pi_year = $scope.payment.pi_month + '/' + $scope.payment.pi_year;
        $scope.payment.pi_number = $scope.payment.pi_number.replace(/\s+/g, '');
        User.subscribe($scope.payment, $scope.currentPlan._id).then(
            function(data) {
                if (!data.data.error) {
                    AuthService.getCurrentUser();
                    form.$setPristine();
                    form.$setUntouched();
                    $scope.payment = {};
                    $scope.submitted.payment = false;
                    //$scope.pay = false;
                    ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Subscribe', eventLabel: 'Subscription Complete' });
                    //$scope.go("phone-validation");


                    if (($scope.currentPlan.subscriptionLength == 12 || $scope.currentPlan.subscriptionLength == 6) && $scope.currentPlan.campaign_count < $scope.currentPlan.campaign_max_count && $scope.currentPlan.campaign_active) {
                        $scope.campain = true;

                    } else {
                        $scope.go("phone-validation");
                    }
                } else {
                    $scope.subscriptionError = data.data.message;
                }
                $scope.subscribing = false;
            }
        );;

    };

    $scope.subscribeWithWallet = function() {
        $scope.subscribing = true;
        User.subscribeWithWallet($scope.currentPlan._id).then(
            function(data) {
                if (!data.data.error) {
                    $scope.payment = {};
                    $scope.submitted.payment = false;
                    var subscription = [];
                    subscription.push(data.data.content)
                    AuthService.setSubscription(subscription);
                    $scope.subscriptionSuccess = true;
                    $scope.go("account/subscription");
                    if (($scope.currentPlan.subscriptionLength == 12 || $scope.currentPlan.subscriptionLength == 6) && $scope.currentPlan.campaign_count < $scope.currentPlan.campaign_max_count && $scope.currentPlan.campaign_active) {
                        $scope.campain = true;
                    }
                } else {
                    ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Subscribe', eventLabel: 'Subscription Error' });
                    $scope.subscriptionError = data.data.message;
                }
                $scope.subscribing = false;
            }
        );;

    };

    $scope.changeIsUserCardHolder = function(cardInformation) {
        if (cardInformation.userIsCardHolder) {
            cardInformation.firstName = $scope.user.firstName;
            cardInformation.lastName = $scope.user.lastName;
            cardInformation.email = $scope.user.email;
        } else {
            cardInformation.firstName = '';
            cardInformation.lastName = '';
            cardInformation.email = '';
        }
    }

    $scope.modify = function() {
        $scope.pay = false;
        $scope.paymentType = "none";
    };

    $scope.changePaymentType = function(type) {
        $scope.paymentType = type;
    };

    $scope.buy = function(plan) {
        if ($scope.user && $scope.user._id) {
            if ($scope.user.subscriptionPlan && (JSON.stringify($scope.user.subscriptionPlan) != "[null]")) {
                $scope.go("account/subscription");
            } else {
                $scope.currentPlan = plan;
                $scope.pay = true;
            }
        } else {
            $scope.openLoginModel();
        }

    };

    $scope.payWithCreditCard = function() {

        globalFactory.getAllP2PPay().then(function(data){

            console.log("Viendo por pagos pendientes...")
            $scope.show_alert_pay_pending = 0;
            transactions = data.content;
           
            for(var i = 0; i < transactions.length ; i++){
                var transaction = transactions[i];

                var today = new Date();
                var day = new Date(transaction.added);
                
                if(transaction.status == 'PENDING'){
                    $scope.show_alert_pay_pending = 1;
                    toastr.warning('El pago #'+transaction.transactionId+' está en espera aprobación',
                    'Por favor, espere hasta 5 minutos hasta que su pago se procese. Si no realizó ningún pago desestime esta alerta.',
                    {timeOut: 50000});
                    
                } 
            }
            
        });

        Swal.fire({
            html: '¿Acepta los <a target="_blank" href="/terms-and-conditions">términos y condiciones</a>?',
            buttons: true,
            confirmButtonText: 'Acepto',
            cancelButtonText:'No Acepto',
            showCancelButton: true,
          })
          .then((Acepta) => {
            if (Acepta.value) {
                globalFactory.createRequest($scope.currentPlan).then(function(data) {
                    console.log(data)
                    if(data.message == 'ok'){
                        window.location.href = data.content.processUrl;
                    }
                    else{
                        Swal.close();
                        Swal.fire('Error',data.message,'error'); 
                    }
                });
                Swal.close();
                Swal.fire({
                    title: 'Redirigiendo a realizar el pago',
                    html: 'Por favor espere',
                    onBeforeOpen: () => {
                      Swal.showLoading()
                    },
                  });      
        
            }
            else{
                
            }
          });
                

    };

    $scope.go = function(url) {
        if (url == "terms-and-conditions") {
            $window.open('/#!/' + url, '_blank');
        } else {
            $location.path('/' + url);
        }
    };
    globalFactory.getSubscriptionPlans().then(function(data) {
        $window.scroll(0, 0);
        $scope.plans = data.content.entries;
    });

    $scope.openLoginModel = function() {
        $('.loginModal').modal('show');
    };

    $scope.cancelCampaign = function() {
        $scope.campain = false;
        $scope.go("phone-validation");
    };


    $scope.$on("auth-login-success", function(event, args) {
        $scope.profile = User;
        $scope.subscription = User.subscriptionPlan;
        if ($scope.subscription) {
            $scope.subscription.status = "active";
        }
        if (!$scope.pay)
            $scope.changingPlan = !User.subscriptionPlan;
        $scope.billingInfo = $scope.profile.billingInfo;
        $scope.phoneValidated = $scope.profile.phone;
        if (User.billingInfo) {
            $scope.billingInfo.exDate = $scope.billingInfo.expire_month + '/' + $scope.billingInfo.expire_year;
            $scope.billingInfo.security = "XXX";
        }
    });

    $scope.enoghCredits = function() {

        return $scope.currentPlan.price <= $scope.wallet.credits;

    }

    $scope.sendShippingAddress = function() {
        $scope.campaignUpdate = true;
        $scope.shippingInfo.email = User.email;

        User.sendUserShippingAddress($scope.plans[3]._id, $scope.shippingInfo).then(function(data) {

            if (!data.data.error) {
                $scope.campainMessage = true;
                $scope.go("phone-validation");
            }
            $scope.campaignUpdate = false;

        });
    };

    AuthService.getWallet().then(function(data) {
        $scope.wallet = data.data.content;
    });

});


