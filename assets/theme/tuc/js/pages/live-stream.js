var liv = null
uvodApp.controller('StreamController',
    function($scope, EpgService, $routeParams, $location, $log, $document, User, GeoService, $timeout, $window) {
        liv = $scope;

        $scope.currentEpg = {};
        $scope.activeVideo = {};
        $scope.channels = {};
        $scope.channelCaruselPosition = 0;
        $scope.channelListingPosition = 0;
        $scope.schedulePosition = 1;
        $scope.channelListing = 0;
        $scope.progress = true;
        $scope.epgId = $routeParams.channel;
        $scope.epgStart = $routeParams.epgStart;
        $scope.epgEnd = $routeParams.epgEnd;
        $scope.channelsInfo = [];
        $scope.currentChannelLogo;
        $scope.scheduleMoves = 1;

        $window.scroll(0, 0);
        $scope.loading = true;
        EpgService.getLiveStreams(function(response) {
            $scope.user = angular.copy(User);
            $scope.channels = response.data;
            $scope.loading = false;
            GeoService.getLocationData()
                .then(function(data) {
                    if (data && data.countryCode)
                        $scope.geo = data;
                    else {
                        console.error("Get Geo returned No Data", data);
                        $scope.geo = { countryCode: "JM", error: "Get Geo no Data" };
                    }

                    $scope.getNowOn($scope.channels);
                })
                .catch(function(err) {

                    $scope.geo = { countryCode: "JM", error: "Get Geo catch" };

                    $scope.getNowOn($scope.channels);
                });
        }, function(error) {
            $scope.loading = false;
        });
        $scope.today = Date.now();


        $scope.openLoginModel = function() {
            $('.loginModal').modal('show');
        };

        $scope.changeChannel = function(channel) {
            $scope.epgId = channel._id;
            $scope.currentEpg = channel.timeline;
            $scope.getNowOn($scope.channels);
            $window.scroll(0, 0);
        };
        //schedule left/right functions
        $scope.moveListingRight = function() {
            getListingsWidth();
            if ($scope.channelListingPosition < $scope.scheduleMoves) {
                $scope.channelListingPosition++;
            }
            if ($scope.channelListingPosition <= $scope.scheduleMoves) {
                $scope.channelListing = ($scope.channelListingPosition * -85);
            }
        };

        $scope.moveListingLeft = function() {
            if ($scope.channelListingPosition > 0) {
                $scope.channelListingPosition--;
                $scope.channelListing = ($scope.channelListingPosition * -85);
            }
        };

        $scope.hasPermission = function() {
            if (!User._id) {
                return false;
            }
            return (($scope.geo && $scope.geo.countryCode == 'JM') || User.subscriptionPlan);
        }

        // Checks whether the date is after now
        $scope.pastDate = function(date) {
            var now = Date.now();
            return now < date;
        };

        $scope.showIsOnFilter = function(item) {
            var now = Date.now();
            if (item.startTime < now && now < item.endTime) {
                return item;
            }
        }
        $scope.epgByGeo = function(title) {
            var pattern = /(\||,)/g;
            if (pattern.test(title)) {
                var parts = title.split('|');
                if ($scope.geo.countryCode == 'JM') return parts[0];
                else return parts[1];

            } else {
                return title;
            }
        }
        $scope.showEndedFilter = function(item) {
            var now = Date.now();
            if (now < item.endTime) {
                return item;
            }
        }

        $scope.showProgress = function(start, end) {
            var length = end - start;
            var now = Date.now();
            if (end < now || now < start) {
                return "width: 0%;";
            }
            var width = Math.round(((now - start) / length) * 100);
            return "width: " + width + "%;";
        };

        $scope.getDifference = function(start, end) {
            if (!start || !end) return;
            var dif = (end - start) / 60000;
            if (dif < 60) return dif + " minutes";
            if (dif == 60) return "1 hour";
            if (dif % 60 == 0) return Math.floor(dif / 60) + " hours";
            return Math.floor(dif / 60) + " hours " + dif % 60 + " minutes";
        }

        $scope.showLength = function(start, end) {
            var length = (end - start) / 10000;
            var vw = 20;
            var hourmm = 360;
            var width = (length / hourmm) * vw;
            if (width < 6) {
                width = 6;
            }
            return "width: " + width + "vw;";
        };

        $scope.getNowOn = function(channels) {
            var video;
            angular.forEach(channels, function(value, key) {
                EpgService.getEpgTimelineById(value._id, function(response) {
                    value.timeline = response.data;
                });
                if (value._id == $scope.epgId) {
                    video = value;
                    $scope.currentChannelLogo = value.ChannelLogoLarge.url;
                    return;
                }
            });
            if ($scope.geo && $scope.geo.countryCode == 'JM') {
                video.HLSBlockedStream = null;
                video.AISBlockedStream = null;
                video.AndroidBlockedStream = null;
            } else {
                video.HLSStream = null;
                video.AISStream = null;
                video.AndroidStream = null;
            }
            if ($scope.epgStart && $scope.epgEnd) {
                $scope.setCatchUpVideo(video, $scope.epgStart, $scope.epgEnd)
            } else {
                $scope.activeVideo = video;
            }

            scrollToChannel();
        };

        function getListingsWidth() {
            var maxWidth = 0;
            angular.forEach($scope.channels, function(value, key) {
                var element = $('.channel' + value._id)[0];
                if (element) {
                    if (element.offsetWidth > maxWidth) {
                        maxWidth = element.offsetWidth;
                    }
                }
            });
            var scheduleObj = $("#schedule")[0];
            $scope.scheduleMoves = Math.floor(maxWidth / scheduleObj.offsetWidth) + 2;
        }

        function scrollToChannel() {
            var element = $('.channel-' + $scope.activeVideo._id)[0];
            var top = element.offsetTop;
            var height = element.offsetHeight;
            $(".all-channels-list")[0].scrollTop = top - height;
        }


        $scope.go = function(path) {
            $location.path(path);
        };

        $scope.$on("auth-login-success", function() {
            $scope.user = angular.copy(User);
        });


        $scope.toggleCatchUp = function(cannelId) {
            if ($scope.isCatchUpShown(cannelId)) {
                $scope.shownCatchUp = null;
            } else {
                EpgService.getEpgCatchUpById(cannelId, function(response) {
                    // $scope.catch_Up_Epg = response.data;
                    $scope.catch_Up_Epg = [];
                    $scope.catch_Up_Epg.push(response.data[response.data.length - 1]);
                    $scope.catch_Up_Epg.push(response.data[response.data.length - 2]);
                    $scope.shownCatchUp = cannelId;
                });

            }
        };

        $scope.isCatchUpShown = function(cannelId) {
            return $scope.shownCatchUp === cannelId;
        };

        $scope.go_live = function(id) {

            $location.path('/live-stream/' + id);
        };

        $scope.go_catch_up = function(id, start, end) {

            $location.path('/live-stream/' + id + '/' + start + '/' + end);
        };

        $scope.setCatchUpVideo = function(cannel, start, end) {

            var _start = (start / 1000) + 40;
            var _end = (end / 1000) + 40;
            // var _start = start;
            // var _end = end;

            var programTime = _end - _start;
            // var programTime = (_end / 1000 ) - (_start / 1000);

            var url = 'http://x6.streamgates.net/univ_video_tvj/tvj_local_cu/playlist_dvr_range-' + _start + '-' + programTime + '.m3u8';
            $scope.activeVideo = {
                _id: cannel._id,
                catchUpUrl: url,
                title: cannel.title,
                live: cannel
            }


        };


    });