uvodApp.directive('jwplayer', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            video: '=video',
            autoplay: '=autoplay',
            id: '@id'
        },
        controller: ['$scope', '$log', '$filter', function jwpCtrl($scope, $log, $filter) {
            var httpsFilt = $filter('https')
            $scope.playCalled = false,
                $scope.setupVideo = function(vid, $filter) {
                    var sources = [];
                    var autostart = true;

                    $('#aniplayer').empty();

                    if (vid) {

                        if (vid.HLSBlockedStream) {
                            var videoUrl = vid.HLSBlockedStream.url || vid.HLSBlockedStream.downloadUrl;
                            if (videoUrl.indexOf("?") < 0)
                                videoUrl += "?";

                            var posterUrl = $scope.getPosterUrl(vid);
                            sources.push({ file: httpsFilt(videoUrl), image: posterUrl });
                        }
                        if (vid.HLSStream) {
                            var videoUrl = vid.HLSStream.url || vid.HLSStream.downloadUrl;
                            if (videoUrl.indexOf("?") < 0)
                                videoUrl += "?";

                            var posterUrl = $scope.getPosterUrl(vid);
                            sources.push({ file: httpsFilt(videoUrl), image: posterUrl });
                        }
                        if (vid.Video) {
                            var videoUrl = vid.Video.url || vid.Video.downloadUrl;
                            if (videoUrl.indexOf("?") < 0)
                                videoUrl += "?";

                            var posterUrl = $scope.getPosterUrl(vid);
                            sources.push({ file: httpsFilt(videoUrl), image: posterUrl });
                        }
                        if (vid.Trailer) {
                            var videoUrl = vid.Trailer.url || vid.Trailer.downloadUrl;
                            $scope.trailer = true;
                            if (videoUrl.indexOf("?") < 0)
                                videoUrl += "?";
                            sources.push({ file: httpsFilt(videoUrl) });
                        }
                        if (vid.mainTrailer) {
                            var videoUrl = vid.mainTrailer.url || vid.mainTrailer.downloadUrl;
                            $scope.trailer = true;
                            if (videoUrl.indexOf("?") < 0)
                                videoUrl += "?";
                            sources.push({ file: httpsFilt(videoUrl) });
                        }
                        if (vid.content) {
                            angular.forEach(vid.content, function(value, key) {
                                if (value.assetTypes[0] == "HLS Stream" || value.assetTypes[0] == "HLS Blocked Stream" || value.assetTypes[0] == "Video") {
                                    var videoUrl = value.url || value.downloadUrl;
                                    if (videoUrl.indexOf("?") < 0)
                                        videoUrl += "?";
                                    sources.push({ file: httpsFilt(videoUrl) });
                                }
                            });
                        }
                        if (vid.catchUpUrl) {
                            var videoUrl = vid.catchUpUrl;
                            if (videoUrl.indexOf("?") < 0)
                                videoUrl += "?";
                            sources.push({ file: httpsFilt(videoUrl) });
                        }

                        var channelId = '';
                        var publisherId = '';
                        if (vid.adPolicyId) {
                            channelId = vid.adPolicyId;
                            publisherId = "5acb749228a061637874caa2";
                        }
                        if (sources.length) {
                            $('#aniplayer').empty();
                            if (publisherId != "") {
                                var adData = {
                                    "publisherId": publisherId,
                                    "channelId": channelId,
                                    "ref1": "AV_URL=%%REFERRER_URL_UNESC%%&AV_SUBID=%%PATTERN:utm_medium%%",
                                    "width": 100,
                                    "height": 0,
                                    "autoPlay": true,
                                    "soundButton": true,
                                    "pauseButton": true,
                                    "closebutton": false,
                                    "logLevel": 10,
                                    "HD": true,
                                    "skip": true,
                                    "noMuteOnBlur": true,
                                    "skipTimer": 5,
                                    "skipText": "Skip This Ad",
                                    "errorlimit": 0,
                                    "autosound": true,
                                    "vastRetry": 0,
                                    "mode": 0,
                                    "loop": false,
                                    "autoplay": true,
                                    "lastFrame": false,
                                    "logo": true,
                                    "position": 'aniplayer'
                                }

                                var player = new avPlayer(adData);

                                player.onLoad = function() {
                                    $scope.loadJwPlayer(vid, sources, false);
                                }

                                player.onSkip = function() {
                                    $('#aniplayer').hide();
                                    player.close();
                                }

                                player.onPlay100 = function() {
                                    $('#aniplayer').hide();
                                    player.close();
                                }

                                player.onError = function(a) {
                                    if (a && a.errorlimit) {
                                        $('#aniplayer').hide();
                                        player.close();
                                    }
                                }

                                player.onClose = function() {
                                    jwplayer($scope.id).play();
                                    $rootScope.playCalled = false;
                                }

                                player.onReady = function() {
                                    clearInterval($scope.intervalTimer);
                                }

                                player.onClick = function(event) {
                                    if (player.playing) {
                                        player.pause();
                                        player.playing = false;
                                    } else {
                                        player.resume();
                                        player.playing = true;
                                    }

                                    event.stopPropagation();
                                }

                                player.onError = function(a) {
                                    if (a && a.errorlimit) {
                                        $('#aniplayer').hide();
                                        player.close();
                                    }
                                }


                                if (!$scope.playCalled) {
                                    player.play();
                                    $scope.playCalled = true;
                                }
                            } else {
                                $scope.loadJwPlayer(vid, sources, true);
                            }
                        } else {
                            jwplayer($scope.id).remove();
                        }

                    } else {
                        jwplayer($scope.id).remove();
                    }
                    jwplayer($scope.id).on('error', function(e) {
                        if (jwplayer().getPlaylist().length - 1 != jwplayer($scope.id).getPlaylistIndex()) {
                            jwplayer($scope.id).next();
                        }
                    });

                    jwplayer($scope.id).on('play', function() {
                        clearInterval($scope.intervalTimer);
                        if (vid.categories[0].name !== "commerce_free_media") {
                            $scope.intervalTimer = setInterval(function() {
                                AuthService.checkDevices().then(function(data) {
                                    if (!data.data.content.enabled) {
                                        clearInterval($scope.intervalTimer);
                                    }
                                });
                            }, 60000);
                        }
                    });


                    jwplayer($scope.id).onQualityLevels(function(event) {
                        jwplayer($scope.id).setCurrentQuality(0);
                    });

                };

            $scope.loadJwPlayer = function(vid, sources, autostart) {

                jwplayer($scope.id).setup({
                    playlist: sources,
                    primary: vid.title.toUpperCase().includes("FM") || vid.title.toUpperCase().includes("RETV") ? 'flash' : 'html5',
                    //  primary: 'html5',
                    androidhls: true,
                    autostart: autostart,
                    aspectratio: "16:9",
                    controls: true,
                    preload: "auto",
                    p2pConfig: { streamrootKey: '32d63aaa-41c7-4518-9b91-c7c9574d3263' },
                    width: "100%",
                    icons: false,
                    visualplaylist: false,
                    // logo: {
                    //     file: vid.ChannelLogoRadio ? vid.ChannelLogoRadio.downloadUrl + "?" : '/assets/theme/tuc/images/logo_player.png?',
                    //     position: 'bottom-right',
                    //     hide: 'false'
                    //         //over: '10',
                    //         //out: '0.75'
                    // },
                    events: {
                        onError: function(e) {
                            $scope.handleMediaEvents('Error', vid.title);
                        },
                        onComplete: function() {
                            if ($scope.video.live) {
                                $scope.setupVideo($scope.video.live);
                            }

                        }
                    }
                });

                //google analytics play event (on setup end)
                $scope.handleMediaEvents('Play', vid.title);

                if (vid.ChannelLogoRadio) {
                    $(".jw-logo").addClass("display-block");
                }
            };

            $scope.handleMediaEvents = function(action, videoName) {
                ga('send', { hitType: 'event', eventCategory: 'Videos', eventAction: action, eventLabel: videoName });
            };

            $scope.$on('$routeChangeStart', function(next, current) {
                $scope.setupVideo(null);
                $scope.playCalled = false;
                clearInterval($scope.intervalTimer);
            });

            $scope.getPosterUrl = function(vid) {
                var livePoster = '';
                if (vid.PosterH) {
                    livePoster = vid.PosterH.downloadUrl || vid.PosterH.streamingUrl;
                }
                return livePoster;
            };
        }],
        link: function(scope, element, attrs) {
            scope.$watch("video", function(newValue, oldValue) {
                scope.setupVideo(newValue);
            }, true);
        },
        templateUrl: '/assets/theme/tuc/html/directives/jw-player.html'
    };
})