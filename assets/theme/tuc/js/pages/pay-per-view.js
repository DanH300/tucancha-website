var pay = null;
uvodApp.controller('PayController', function($scope, $interval, $location, globalFactory, User, AuthService, $log) {
    pay = $scope;
    $scope.user = User;
    $scope.filterList = {};

    AuthService.getOrders().then(function() {})

    $scope.getEvents = function() {

        globalFactory.getPpvEvents($scope.filterList).then(function(data) {
            $scope.availablePerformances = data.content.entries;
            $scope.mainEvent = $scope.availablePerformances[0];
            $scope.mainEventPoster = $scope.getPosterF($scope.mainEvent.content);

            // initializeClock($scope.mainEvent.event_sessions[0].event_date);
            angular.forEach($scope.availablePerformances, function(value, key) {
                initializeClock(key, value.event_sessions[0].event_date);
            });

            for (evt in $scope.availablePerformances) {
                $scope.availablePerformances[evt].tickets = $scope.availablePerformances[evt].tickets.sort(function(itemA, itemB) {
                    var var1 = itemA.title.slice(" ")[itemA.title.slice(" ").length - 1];
                    var var2 = itemB.title.slice(" ")[itemB.title.slice(" ").length - 1];
                    if (var1.charCodeAt(0) > 64)
                        return 9 > var2;
                    if (var2.charCodeAt(0) > 64)
                        return var1 < 9;
                    return var1 > var2;
                });
            }

        });

    }

    $scope.getEvents();

    $scope.mainImage = "";
    $scope.backgroundGradient = "/assets/theme/tuc/images/rectangle.png";
    $scope.availablePerformances = [];

    $scope.performersPosition = 0;
    $scope.caruselPosition = 0;
    $scope.alreadyPurchased = false;
    $scope.remainingTime = {};
    $scope.model = {};
    $scope.activeVideo = {};
    $scope.activeTab = "tickets";
    $scope.selectedPurchases = [];
    $scope.paymentType = "none";
    $scope.showConfirmation = false;
    $scope.allEvents = [];

    var timeinterval;

    globalFactory.getMainMenu().then(function(data) {
        $scope.filters = data;
    });

    $scope.applyFilter = function(mainCategory, category, categoryId, value) {

        if (value) {

            if (!(mainCategory in $scope.filterList)) {
                $scope.filterList[mainCategory] = {};
            }

            if (!(category in $scope.filterList[mainCategory])) {
                $scope.filterList[mainCategory][category] = [];
            }

            $scope.filterList[mainCategory][category].push(categoryId);

        } else {

            //Get index of the category ID
            var index = $scope.filterList[mainCategory][category].indexOf(categoryId);
            if (index > -1) {
                //Remove the category ID from the category array
                $scope.filterList[mainCategory][category].splice(index, 1);

                //Remove the category array if it's empty
                if ($scope.filterList[mainCategory][category].length == 0) {
                    delete $scope.filterList[mainCategory][category];

                    //Remove the mainCategory array if it's empty
                    if (Object.keys($scope.filterList[mainCategory]).length === 0 && $scope.filterList[mainCategory].constructor === Object) {
                        delete $scope.filterList[mainCategory];
                    }
                }
            }
        }

        $scope.getEvents();
    }


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

    $scope.changePaymentType = function(type) {
        $scope.paymentType = type;
    };

    $scope.watch = function(video) {
        $scope.activeVideo = video;
    };

    $scope.buyTicket = function() {
        $scope.showConfirmation = true;
    };

    $scope.confirmPurchase = function() {

        /**
         *TODO:
         */
        $scope.showConfirmation = false;
        $scope.alreadyPurchased = true;
    };


    $scope.showActiveTab = function(tab) {
        $scope.activeTab = tab;
    };

    $scope.select = function(ticket) {
        if (!$scope.userPurchased(ticket)) {
            if ($scope.isInPurchases(ticket)) {
                $scope.selectedPurchases.splice($scope.selectedPurchases.indexOf(ticket), 1);
            } else {
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

    $scope.userPurchasedFromEvent = function(singleEvent) {
        if (!singleEvent || !singleEvent.tickets || singleEvent.tickets.length < 1 ||
            !$scope.user || !$scope.user.ppvTickets || $scope.user.ppvTickets.length < 1) return false;
        for (i = 0; i < $scope.user.ppvTickets.length; i++) {
            if ($scope.user.ppvTickets[i].product.event_id === singleEvent._id) {
                return true;
            }
        }
        return false;


    };

    $scope.userHasAccess = function(session) {
        var i;
        for (i = 0; i < $scope.length($scope.user.ppvTickets); i++) {
            if (session.access_tickets.indexOf($scope.user.ppvTickets[i].id) != -1) {
                return true;
            }
        }
        return false;
    };

    $scope.ticketIncluded = function(singleEvent) {
        return function(item) {
            if (!$scope.userPurchased(item)) {
                var count = 0;
                for (var i = 0; i < singleEvent.tickets.length; i++) {
                    if (singleEvent.tickets[i]._id != item._id && $scope.userPurchased(singleEvent.tickets[i])) {
                        for (var j = 0; j < singleEvent.tickets[i].event_session_id.length; j++) {
                            if (item.event_session_id.indexOf(singleEvent.tickets[i].event_session_id[j]) != -1) {
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
    };


    $scope.getPosterH = function(content) {
        var i;
        if (content) {
            for (i = 0; i < Object.keys(content).length; i++) {
                if (content[i].assetTypes[0] == "Poster H") {
                    return content[i].downloadUrl;
                }
            }
            return "";
        }
    };

    $scope.getPosterF = function(content) {
        var i;
        if (content) {
            for (i = 0; i < Object.keys(content).length; i++) {
                if (content[i].assetTypes[0] == "Poster F") {
                    return content[i].downloadUrl;
                }
            }
            return "";
        }

    };

    $scope.offerHasStarted = function(ticket) {
        if (ticket.offerStartDate < Date.now()) return true;
        else return false;
    }

    function getTimeRemaining(key, endtime) {
        var t = endtime - Date.now();
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        // $scope.remainingTime.days = (days >= 10)?days:'0'+days;
        // $scope.remainingTime.hours = (hours >= 10)?hours:'0'+hours;
        // $scope.remainingTime.minutes = (minutes >= 10)?minutes:'0'+minutes;
        // $scope.remainingTime.seconds =  (seconds >= 10)?seconds:'0'+seconds;
        // $scope.remainingTime.total = t;
        $scope.availablePerformances[key].days = (days >= 10) ? days : '0' + days;
        $scope.availablePerformances[key].hours = (hours >= 10) ? hours : '0' + hours;
        $scope.availablePerformances[key].minutes = (minutes >= 10) ? minutes : '0' + minutes;
        $scope.availablePerformances[key].seconds = (seconds >= 10) ? seconds : '0' + seconds;
        $scope.availablePerformances[key].total = t;
    }

    function initializeClock(key, endtime) {

        function updateClock() {
            getTimeRemaining(key, endtime);

            // if ($scope.remainingTime.total <= 0) {
            //     $interval.cancel(timeinterval);
            // }
        }

        updateClock();
        timeinterval = $interval(updateClock, 1000);
    }
    $scope.go = function(url) {
        $location.path('/' + url);
    };

    AuthService.getWallet().then(function(data) {
        $scope.wallet = data.data.content;
    });
});