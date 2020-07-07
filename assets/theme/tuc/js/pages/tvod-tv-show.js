var tvodShow = null;

uvodApp.controller('TvodTvShowController', function($scope, globalFactory, $location, $routeParams, User, AuthService, $rootScope, $window, $document, $anchorScroll, socialFactory, tVodFactory) {
    tvodShow = $scope;

    $scope.user = User;
    $scope.loading = true;
    $scope.showId = $routeParams.showId;
    $scope.seasonId = $routeParams.seasonId;

    $scope.years = new Array(7);
    $scope.year = (new Date()).getFullYear();

    $scope.changeSeason = function(index) {
        $scope.selectedSeason = index;
        $scope.page = 0;
    }

    $scope.go = function(path) {
        $location.path(path);
    };

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
                            User.sendTVODEmail(response.data, userdata, $scope.show);
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
                        $scope.buying = false;
                        $scope.purchasingError = true;
                        $scope.errorMessage = response.data.message;
                    } else {
                        $scope.buying = false;
                        $scope.billing = null;
                        $scope.formSubmitted = false;
                        $scope.successfulPurchase = true;
                        AuthService.getCurrentUser().then(function(userdata) {
                            User.sendTVODEmail(response.data, userdata, $scope.show);
                        });
                    }
                }).catch(
                    function(err) {

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

    $scope.changePage = function(num) {
        $scope.page = num;
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
        $scope.loading = true;
        $scope.episode = null;
        tVodFactory.get_tvod_item($scope.showId, $scope.user ? $scope.user.transactionalPlans : null).then(show => {
            if (show && show.seasons) {
                show.episodes = 0;
                show.posterH = show.PosterH ? show.PosterH : show.PosterV;
                show.seasons.forEach(season => {
                    show.episodes += season.episodes ? season.episodes.length : 0;
                    if (season.episodes) {
                        season.episodes.forEach(episode => {
                            episode.aired_date = episode.media.aired_date;
                        });
                    }
                });
                if ($scope.seasonId && $routeParams.episodeId) {
                    if (show.seasons[$scope.seasonId] && show.seasons[$scope.seasonId].episodes) {
                        show.seasons[$scope.seasonId].episodes.forEach(episode => {
                            if (episode.media._id == $routeParams.episodeId) {
                                $scope.episode = episode;

                            }

                        });
                    }
                }
            }
            $scope.selectedSeason = $scope.seasonId || 0;
            $scope.show = show;
            $scope.loading = false;
            $scope.page = 0;
        });
        if ($scope.user.transactionalPlans) {
            var now = (new Date()).valueOf();
            $scope.user.transactionalPlans.forEach(plan => {
                if (plan.media_id == $scope.showId && now < plan.contractEndDate && now > plan.contractStartDate)
                    $scope.validUntil = plan.contractEndDate;
            });
        }

    }


    $scope.facebookShare = function() {
        var url = '';

        var description = $scope.episode ? $scope.episode.media.description : $scope.show.desciption;
        var title = $scope.episode ? $scope.episode.media.title : $scope.show.title;
        var image = $scope.episode ? $scope.episode.media.PosterH.downloadUrl : $scope.show.PosterH.downloadUrl;

        if ($scope.episode) url = 'https://tucancha.ec/#!/tvod/tv-show/' + $routeParams.showId + '/' + $scope.seasonId + '/' + $scope.episodeId;
        else url = 'https://tucancha.ec/#!/tvod/tv-show/' + $routeParams.showId + '/';
        FB.ui({
            display: 'popup',
            method: 'share',
            description: description,
            href: url,
            picture: image,
            name: title
        });
    }
    $scope.twitterShare = function() {
        var url = '';
        if ($scope.episode) url = 'https://tucancha.ec/%23!/tvod/tv-show/' + $routeParams.showId + '/' + $scope.seasonId + '/' + $scope.episodeId;
        else url = 'https://tucancha.ec/%23!/tvod/tv-show/' + $routeParams.showId + '/';
        $window.open("https://twitter.com/intent/tweet?text=" + url, "_blank")
    }
    $scope.openLoginModel = function() {
        $('.loginModal').modal('show');
    };
});