var stvod = null;
uvodApp.controller('singleTvodController', function($scope, User, $routeParams, AuthService, tVodFactory, $location, $window) {
    stvod = $scope;

    $scope.user = User;
    $scope.tvodId = $routeParams.vodId;

    $scope.years = new Array(7);
    $scope.year = (new Date()).getFullYear();

    tVodFactory.list_clips().then(function(data) {
        $scope.recomended = data;
    })

    // tVodFactory.listFeatured().then(function (data){
    //   $scope.recomended = data;
    // });

    tVodFactory.get_tvod_item($scope.tvodId).then(function(data) {
        $scope.tvod = data;
    })


    $scope.startPurchase = function(offer) {
        $scope.buying = false;
        $scope.successfulPurchase = false;
        $scope.purchasingError = false;
        $scope.formSubmitted = true;
        $scope.billing = null;
        $scope.editingCard = false;
        $scope.cloneBillingInfo();
        if (!$scope.user || !$scope.user._id) {
            $('.loginModal').modal('show');
        } else {
            $scope.selectedOffer = offer; // add choose option on rent click
            $('.tvodModal').modal('show');
        }

    }

    $scope.closeModal = function() {
        $('.tvodModal').modal('hide');
    }

    $scope.buyTicket = function(form) {
        $scope.successfulPurchase = false;
        $scope.purchasingError = false;

        if (form.$invalid) {
            return;
        }
        $scope.buying = true;
        $scope.formSubmitted = true;

        $scope.billingInfo = angular.copy($scope.billing);

        $scope.billingInfo.pi_year = $scope.billingInfo.pi_month + '/' + $scope.billingInfo.pi_year;
        $scope.billingInfo.pi_number = $scope.billingInfo.pi_number.replace(/\s+/g, '');
        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'TVOD', eventLabel: 'Subscription Start' });
        if ($scope.user.billingInfo && !$scope.editingCard) {
            User.tvodSubscribeWithExistingCC($scope.selectedOffer.subscriptionId)
                .then(function(response) {
                    if (response.data.error) {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'TVOD', eventLabel: 'Subscription Error' });
                        $scope.buying = false;
                        $scope.purchasingError = true;
                        $scope.errorMessage = response.data.message;
                    } else {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'TVOD', eventLabel: 'Subscription Success' });
                        $scope.buying = false;
                        $scope.billing = null;
                        $scope.formSubmitted = false;
                        $scope.successfulPurchase = true;
                        $scope.calculateExpiration();
                        $scope.closeModal();

                        AuthService.getCurrentUser().then(function(userdata) {
                            User.sendTVODEmail(response.data, userdata, $scope.tvod);
                        });

                    }
                }).catch(
                    function() {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'TVOD', eventLabel: 'Subscription Server Error' });

                    });
        } else {
            User.tvodSubscribe($scope.billingInfo, $scope.selectedOffer.subscriptionId)
                .then(function(response) {
                    $scope.buying = false;
                    $scope.formSubmitted = false;
                    if (response.data.error) {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'TVOD', eventLabel: 'Subscription Error' });
                        $scope.buying = false;
                        $scope.purchasingError = true;
                        $scope.errorMessage = response.data.message;
                    } else {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'TVOD', eventLabel: 'Subscription Success' });

                        $scope.buying = false;
                        $scope.billing = null;
                        $scope.formSubmitted = false;
                        $scope.successfulPurchase = true;

                        AuthService.getCurrentUser().then(function(userdata) {
                            User.sendTVODEmail(response.data, userdata, $scope.tvod);
                        });
                    }
                }).catch(
                    function(err) {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'TVOD', eventLabel: 'Subscription Server Error' });

                    });
        }

    };

    $scope.$watch('user', function(newValue, oldValue) {
        $scope.cloneBillingInfo();
        $scope.check_subscription();

    }, true);

    $scope.cloneBillingInfo = function() {
        if ($scope.user && $scope.user.billingInfo) {
            $scope.billing = {
                firstName: $scope.user.billingInfo.first_name,
                lastName: $scope.user.billingInfo.last_name,
                pi_type: $scope.user.billingInfo.type,
                pi_number: $scope.user.billingInfo.number,
                security_code: "xxx",
                pi_month: $scope.user.billingInfo.expire_month < 10 ? "0" + $scope.user.billingInfo.expire_month : $scope.user.billingInfo.expire_month,
                pi_year: $scope.user.billingInfo.expire_year,
            };
        }
    }

    $scope.editCard = function() {
        if ($scope.editingCard) {
            $scope.editingCard = false;
            $scope.cloneBillingInfo();
        } else {
            $scope.editingCard = true;
            $scope.billing = {};
        }

    }

    $scope.calculateExpiration = function() {
        var now = new Date().valueOf();

        var times = { hour: 60 * 60 * 1000 };
        times.day = times.hour * 24;
        times.week = times.day * 7;
        times.month = times.day * 30;
        return new Date(now + $scope.selectedOffer.length * times[$scope.selectedOffer.units]);
    }

    $scope.showTVod = function() {
        $scope.closeModal();
        AuthService.getCurrentUser();
    }

    $scope.check_subscription = function() {
        tVodFactory.get_tvod_item($scope.tvodId, $scope.user.transactionalPlans).then(function(data) {
            $scope.tvod = data;
        });
        if ($scope.user.transactionalPlans) {
            var now = (new Date()).valueOf();
            $scope.user.transactionalPlans.forEach(plan => {
                if (plan.media_id == $scope.tvodId && now < plan.contractEndDate && now > plan.contractStartDate) {
                    $scope.validUntil = plan.contractEndDate;
                }
            });
        }

    }

    $scope.addTwitterMeta = function(data) {
        $("meta[name='twitter\\:title']").attr("content", data.title);
        $("meta[name='twitter\\:description']").attr("content", data.description);
        $("meta[name='twitter\\:image']").attr("content", data.PosterH.downloadUrl);
    }

    $scope.facebookShare = function() {
        FB.ui({
            display: 'popup',
            method: 'share',
            description: $scope.tvod.description,
            href: $location.absUrl(),
            picture: $scope.tvod.PosterH.downloadUrl,
            name: $scope.tvod.title
        })
    }

    $scope.twitterShare = function() {
        url = 'https://tucancha.ec/%23!/tv-shows/' + $scope.tvod._id + '/';

        $window.open("https://twitter.com/intent/tweet?text=" + url, "_blank")
    }


});