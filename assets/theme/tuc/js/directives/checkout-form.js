uvodApp.directive('checkoutForm', function() {
    return {
        restrict: 'EA',
        scope: {
            it : '=',
            plan: '=',
            pay : '='
        },
        controller: ['$scope', '$rootScope', 'globalFactory', 'AuthService', 'User', '$location','$window',function checkoutFormController($scope, $rootScope, globalFactory, AuthService, User, $location, $window) {
        
            // su = $scope;
            // AuthService.getCurrentUser();
            $scope.user = User;
            $scope.item = $scope.it;
            // $scope.submitted = {
            //     payment: false
            // };
            $scope.payment = $scope.user.billingInfo;
            $scope.$watch('it', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.item = newValue;
                }
        
            });
            // $scope.pay = false;
            // $scope.plans = {};
            // $scope.currentPlan = {};
            // $scope.campain = false;
            // $scope.shippingInfo = {};
            // $scope.campainMessage = false;

            // $scope.subscribe = function(form) {
            //     if (form.$invalid) {
            //         $scope.submitted.payment = true;
            //         return;
            //     }
            //     $scope.subscribing = true;
            //     $scope.payment.pi_year = $scope.payment.pi_month + '/' + $scope.payment.pi_year;
            //     $scope.payment.pi_number = $scope.payment.pi_number.replace(/\s+/g, '');
            //     User.subscribe($scope.payment, $scope.currentPlan._id).then(
            //         function(data) {
            //             if (!data.data.error) {
            //                 AuthService.getCurrentUser();
            //                 form.$setPristine();
            //                 form.$setUntouched();
            //                 $scope.payment = {};
            //                 $scope.submitted.payment = false;
            //                 //$scope.pay = false;
            //                 ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'Subscribe', eventLabel: 'Subscription Complete' });
            //                 //$scope.go("phone-validation");


            //                 if (($scope.currentPlan.subscriptionLength == 12 || $scope.currentPlan.subscriptionLength == 6) && $scope.currentPlan.campaign_count < $scope.currentPlan.campaign_max_count && $scope.currentPlan.campaign_active) {
            //                     $scope.campain = true;

            //                 } else {
            //                     $scope.go("phone-validation");
            //                 }
            //             } else {
            //                 $scope.subscriptionError = data.data.message;
            //             }
            //             $scope.subscribing = false;
            //         }
            //     );;

            // };

            // $scope.changeIsUserCardHolder = function(cardInformation) {
            //     if (cardInformation.userIsCardHolder) {
            //         cardInformation.firstName = $scope.user.firstName;
            //         cardInformation.lastName = $scope.user.lastName;
            //         cardInformation.email = $scope.user.email;
            //     } else {
            //         cardInformation.firstName = '';
            //         cardInformation.lastName = '';
            //         cardInformation.email = '';
            //     }
            // }

            $scope.modify = function() {
                $scope.pay.value = false;
                $rootScope.$broadcast("load-plan", {});        
                $rootScope.$broadcast("show-plans", true);
                var offsetTop = $("#main-slick").offset().top - 100;
                $('html, body').animate({
                    scrollTop: offsetTop
                }, 500);
               
            };

            // $scope.buy = function(plan) {
            //     if ($scope.user && $scope.user._id) {
            //         if ($scope.user.subscriptionPlan) {
            //             $scope.go("account/subscription");
            //         } else {
            //             $scope.currentPlan = plan;
            //             $scope.pay = true;
            //         }
            //     } else {
            //         $scope.openLoginModel();
            //     }

            // };

            $scope.go = function(url) {
                if (url == "terms-and-conditions") {
                    $window.open('/#!/' + url, '_blank');
                } else {
                    $location.path('/' + url);
                }
            };
            // globalFactory.getSubscriptionPlans().then(function(data) {
            //     $window.scroll(0, 0);
            //     $scope.plans = data.content.entries;
            // });

            // $scope.openLoginModel = function() {
            //     $('.loginModal').modal('show');
            // };

            // $scope.cancelCampaign = function() {
            //     $scope.campain = false;
            //     $scope.go("phone-validation");
            // };

            // $scope.sendShippingAddress = function() {
            //     $scope.campaignUpdate = true;
            //     $scope.shippingInfo.email = User.email;

            //     User.sendUserShippingAddress($scope.plans[3]._id, $scope.shippingInfo).then(function(data) {

            //         if (!data.data.error) {
            //             $scope.campainMessage = true;
            //             $scope.go("phone-validation");
            //         }
            //         $scope.campaignUpdate = false;

            //     });
            // };
           

        }],
        templateUrl: '/assets/theme/tuc/html/directives/checkout-form.html'
    };
});