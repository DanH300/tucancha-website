var payItem = null;
uvodApp.controller('PayItemController', function($scope, $interval, $routeParams, globalFactory, User, AuthService, $window, $location, $log, $http) {
    payItem = $scope;
    $scope.lineup = 1;
    $window.scroll(0, 0);
    var deadline = Date.now() + 2 * 60 * 60 * 1000;
    $scope.user = User;
    $scope.wallet = User.wallet || null;
    $scope.billingInfo = $scope.user.billingInfo;
    $scope.allowAccess = true;
    $scope.loading = true;
    $scope.eventIsLive = false;
    $scope.paymentType = "none";
    if ($scope.billingInfo) {
        $scope.billingInfo.exDate = $scope.billingInfo.expire_month + '/' + $scope.billingInfo.expire_year;
        $scope.billingInfo.security = "XXX";
    }
    $scope.submitted = {
        billingForm: false,
        payment: false
    };
    globalFactory.getPpvEventById($routeParams.ppvId).then(function(data) {
        $scope.event = data;
        $scope.eventType = $scope.event.categories ? $scope.event.categories[0].name : 'commerce_free_media';
        $http({
            method: 'GET',
            url: 'assets/theme/tuc/js/ppv-days.json'
        }).then(function successCallback(response) {
            $scope.ppvDays = response.data[$scope.event.title];
        }, function errorCallback(response) {

        });
        $scope.activeVideo = $scope.event.event_videos[0];
        $scope.mainImage = $scope.getPosterF($scope.event.content);
        initializeClock($scope.event.event_date);
        // console.log(($scope.event));
        $scope.eventIsLive = $scope.event.event_sessions[0].live_now;
        $scope.showAllAvailable = false;

        if ($scope.eventIsLive) {
            $scope.mainEvent = $scope.event.event_sessions[0];
        }

        $scope.getPermissions();
    });

    $scope.backgroundGradient = "/assets/theme/tuc/images/rectangle.png";
    $scope.availablePerformances = {};


    $scope.hasAccess = function() {
        if ($scope.event) {
            if ($scope.event.categories && $scope.event.categories.length)
                if ($scope.event.categories[0]) {
                    if ($scope.event.categories[0].name == '' || $scope.event.categories[0].name == 'none' || $scope.event.categories[0].name == 'commerce_free_media')
                        return true;
                    else if ($scope.event.categories[0].name == "commerce_members_media")
                        return User._id;
                    else if ($scope.event.categories[0].name == 'commerce_subscription_basic_media');
                    return User.subscriptionPlan;
                }
        }
        return true;
    }

    $scope.getPermissions = function() {
        if ($scope.eventType == 'commerce_free_media' || $scope.eventType == '' || $scope.eventType == 'none') {
            $scope.allowAccess = true;
            return;
        }
        if ($scope.eventType == 'commerce_subscription_basic_media') {
            if (!$scope.user.subscriptionPlan) {
                $scope.permission = 'Subscribed';
                $scope.allowAccess = false;
                return;
            } else {
                $scope.permission = '';
            }
        }
        if (angular.isUndefined($scope.user._id)) {
            $scope.permission = 'a Member';
            $scope.allowAccess = false;
            return;
        }
        $scope.allowAccess = true;
    };

    $scope.changePaymentType = function(type) {
        $scope.paymentType = type;
    };

    $scope.menu = {
        0: { name: "Tickets", id: "tickets" },
        // 1:{name:"Line Up", id:"line-up"}
        // 2:{name:"Performers", id:"performers", directive:"performers"},
        1: { name: "Videos", id: "videos" }
    };

    $scope.playVideo = function(slide) {
        $scope.activeVideo = slide;
    }
    $scope.performersPosition = 0;
    $scope.caruselPosition = 0;
    $scope.alreadyPurchased = false;
    $scope.remainingTime = {};
    $scope.model = {};
    $scope.activeVideo = {};
    $scope.activeTab = "tickets";
    $scope.selectedPurchases = [];
    $scope.showConfirmation = false;
    $scope.allEvents = [];
    $scope.newCard = false;
    $scope.billing = {};

    var timeinterval;

    $scope.moveDown = function() {
        if ($scope.performersPosition == 0) {
            $scope.performersPosition = 1;
        } else if ($scope.performersPosition == 1 && Object.keys($scope.performers).length > 8) {
            $scope.performersPosition = 2;
        } else {
            $scope.performersPosition = 0;
        }
    };

    $scope.moveLeft = function() {
        if ($scope.caruselPosition == 0) {
            $scope.caruselPosition = 1;
        } else {
            $scope.caruselPosition = 0;
        }
    };
    $scope.moveRight = function() {
        if ($scope.caruselPosition == 0) {
            $scope.caruselPosition = 1;
        } else {
            $scope.caruselPosition = 0;
        }
    };

    $scope.length = function(object) {
        if (!object) {
            return 0;
        }
        return Object.keys(object).length;
    };

    $scope.watch = function(video) {
        $scope.activeVideo = video;
    };

    $scope.payWithCreditCard = function() {
        globalFactory.createRequest($scope.selectedTicket).then(function(data) {
            console.log(data)
            if(data.message == 'ok'){
                window.location.href = data.content.processUrl;
            }
        });
    };

    $scope.goToPayment = function() {
        if ($scope.selectedPurchases.length == 0) {
            $scope.noSelected = "Please select tickets";
            return;
        }
        if (!$scope.user._id) {
            $('.loginModal').modal('show');
            return;
        } else {
            $scope.pay = true;
        }
        $window.scroll(0, 0);
        $scope.noSelected = false;
    };

    $scope.changeTicket = function() {

            $scope.pay = false;
            $scope.paymentType = "none";

    };

    $scope.buyTicket = function(form) {
        $scope.successfulPurchase = false;
        $scope.submitted.billingForm = true;
        if (form.$invalid) {
            return
        }
        $scope.buying = true;
        $scope.purchasingError = false;
        $scope.billing.pi_year = $scope.billing.pi_month + '/' + $scope.billing.pi_year;
        $scope.billing.pi_number = $scope.billing.pi_number.replace(/\s+/g, '');
        for (var i = 0; i < $scope.selectedPurchases.length; i++) {
            ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'PPV', eventLabel: 'Subscription Start' });
            User.purchaseEvent($scope.billing, $scope.selectedPurchases[i],
                function(response) {
                    $scope.buying = false;
                    $scope.submitted.billingForm = false;
                    if (response.data.error) {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'PPV', eventLabel: 'Subscription Error' });
                        $scope.buying = false;
                        $scope.purchasingError = true;
                        $scope.errorMessage = response.data.message;
                    } else {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'PPV', eventLabel: 'Subscription Success' });
                        User.sendConfirmation(response.data);
                        AuthService.getCurrentUser();
                        $scope.buying = false;
                        $scope.billing = {};
                        $scope.submitted.billingForm = false;
                        $scope.successfulPurchase = true;
                    }
                },
                function(err) {
                    ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'PPV', eventLabel: 'Subscription Server Error' });

                });
        }
    };

    $scope.buyTicketByStoredCC = function() {
        $scope.buying = true;
        $scope.successfulPurchase = false;
        $scope.purchasingError = false;
        for (var i = 0; i < $scope.selectedPurchases.length; i++) {
            ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'PPV', eventLabel: 'Subscription Start' });
            User.purchaseEventByStoredCC($scope.selectedPurchases[i],
                function(response) {
                    if (response.data.error) {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'PPV', eventLabel: 'Subscription Error' });
                        $scope.buying = false;
                        $scope.purchasingError = true;
                        $scope.errorMessage = response.data.message;
                        $scope.billing = {};
                        $scope.submitted.billingForm = false;
                        $scope.successfulPurchase = false;
                    } else {
                        ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'PPV', eventLabel: 'Subscription Success' });
                        User.sendConfirmation(response.data);
                        AuthService.getCurrentUser();
                        $scope.buying = false;
                        $scope.billing = {};
                        $scope.submitted.billingForm = false;
                        $scope.successfulPurchase = true;
                    }
                },
                function() {
                    ga('send', { hitType: 'event', eventCategory: 'User Type', eventAction: 'PPV', eventLabel: 'Subscription Server Error' });
                });
        }
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

    $scope.changeCard = function(form) {
        $scope.billing = {};
        form.$setPristine();
        form.$setUntouched();
        $scope.newCard = true;
    };

    $scope.cancel = function(form) {
        $window.scroll(0, 0);
        $scope.newCard = false;
        $scope.pay = false;
        $scope.successfulPurchase = false;
        $scope.billing = {};
        $scope.purchasingError = false;
        $scope.submitted.billingForm = false;
        $scope.successfulPurchase = false;
        form.$setPristine();
        form.$setUntouched();
    };

    $scope.confirmPurchase = function() {
        $scope.showConfirmation = false;
        $scope.alreadyPurchased = true;
    };

    $scope.showActiveTab = function(tab) {
        $scope.activeTab = tab;
    };
    $scope.showSelect = function(ticket) {
        if (ticket.offerEndDate - Date.now() > 0) {
            return true;
        } else return false;
    }
    $scope.select = function(ticket) {
        $scope.selectedTicket = ticket;
        if (ticket.offerEndDate - Date.now() < 0) {
            return;
        }
        if (!$scope.userPurchased(ticket)) {
            if ($scope.isInPurchases(ticket)) {
                $scope.selectedPurchases.splice($scope.selectedPurchases.indexOf(ticket), 1);
            } else {
                for (var i = 0; i < $scope.selectedPurchases.length; i++) {
                    for (var j = 0; j < ticket.sessions_included.length; j++) {
                        if ($scope.selectedPurchases[i].sessions_included.indexOf(ticket.sessions_included[j]) != -1) {
                            $scope.selectedPurchases.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
                $scope.selectedPurchases.push(ticket);
            }
        }
    };

    $scope.isInPurchases = function(ticket) {
        var i;
        for (i = 0; i < $scope.selectedPurchases.length; i++) {
            if (angular.equals($scope.selectedPurchases[i], ticket)) {
                return true;
            }
        }
        return false;
    };

    $scope.userPurchased = function(ticket) {
        var i;
        for (i = 0; i < $scope.length($scope.user.ppvTickets); i++) {
            if ($scope.user.ppvTickets[i].id == ticket._id) {
                return true;
            }
        }
        return false
    };

    $scope.userHasAccess = function(session) {
        if (session) {
            var i;
            for (i = 0; i < $scope.length($scope.user.ppvTickets); i++) {
                if (session.access_tickets.indexOf(User.ppvTickets[i].id) != -1) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    $scope.offerHasStarted = function(ticket) {
        if (ticket.offerStartDate < Date.now()) return true;
        else return false;
    }
    $scope.ticketIncluded = function(item) {
        if (!$scope.userPurchased(item)) {
            var count = 0;
            for (var i = 0; i < $scope.event.tickets.length; i++) {
                if ($scope.event.tickets[i]._id != item._id && $scope.userPurchased($scope.event.tickets[i])) {
                    for (var j = 0; j < $scope.event.tickets[i].event_session_id.length; j++) {
                        if (item.event_session_id.indexOf($scope.event.tickets[i].event_session_id[j]) != -1) {
                            count++;
                        }
                    }
                }
            }
            if (count >= item.event_session_id.length) {
                return;
            }
        }
        return item;
    }

    $scope.buyWithWallet = function() {
        $scope.subscribing = true;
        User.buyeWithWallet($scope.selectedTicket._id).then(
            function(data) {
                if (!data.data.error) {
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
        );
    };

    $scope.getPosterH = function(content) {
        if (content) {
            var i;
            for (i = 0; i < Object.keys(content).length; i++) {
                if (content[i].assetTypes[0] == "Poster H") {
                    return content[i].downloadUrl;
                }
            }
            return "";
        }

    };

    $scope.getPosterF = function(content){
        if (content) {
            var i;
            for (i = 0; i < Object.keys(content).length; i++) {
                if (content[i].assetTypes[0] == "Poster F") {
                    return content[i].downloadUrl;
                }
            }
            return "";
        }

    };

    function getTimeRemaining(endtime) {
        var t = endtime - Date.now();
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        $scope.remainingTime.days = (days >= 10) ? days : '0' + days;
        $scope.remainingTime.hours = (hours >= 10) ? hours : '0' + hours;
        $scope.remainingTime.minutes = (minutes >= 10) ? minutes : '0' + minutes;
        $scope.remainingTime.seconds = (seconds >= 10) ? seconds : '0' + seconds;
        $scope.remainingTime.total = t;
    }

    function initializeClock(endtime) {

        function updateClock() {
            getTimeRemaining(endtime);

            if ($scope.remainingTime.total <= 0) {
                $interval.cancel(timeinterval);
            }
        }

        updateClock();
        timeinterval = $interval(updateClock, 1000);
    }

    $scope.$on("auth-login-success", function() {
        $scope.user = User;
        $scope.buying = false;
        $scope.billing = {};
        $scope.submitted.billingForm = false;
        $scope.billingInfo = $scope.user.billingInfo;
        if ($scope.billingInfo) {
            $scope.billingInfo.exDate = $scope.billingInfo.expire_month + '/' + $scope.billingInfo.expire_year;
            $scope.billingInfo.security = "XXX";
        }
    });

    $scope.go = function(url) {
        $location.path(url);
    };

    $scope.enoghCredits = function() {

        return $scope.selectedTicket.price <= $scope.wallet.credits;

    }



});