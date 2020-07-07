uvodApp.directive('pixellotplayer', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            video: '=video',
            autoplay: '=autoplay',
            id: '@id'
        },
        controller: ['$scope', 'globalFactory', '$filter','$window', 'User', 'AuthService', function jwpCtrl($scope, globalFactory, $filter, $window, User, AuthService) {
            var httpsFilt = $filter('https')
            $scope.playCalled = false,
            $scope.playerContainer = null;
            $scope.player = null;
            $scope.errorMessage = '';
            $scope.isRecording = false;
            $scope.isAdded = false;

                $scope.setupVideo = function(vid, $filter) {
                    var sources = [];
                    var autostart = true;

                    if (vid) {

                        if (vid.HLSStream) {
                            var videoUrl = vid.HLSStream.url || vid.HLSStream;
                            if (videoUrl.indexOf("?") < 0)
                                videoUrl += "?";

                            var posterUrl = $scope.getPosterUrl(vid);
                            sources.push(httpsFilt(videoUrl));
                        }else if (vid.HLSBlockedStream) {
                            var videoUrl = vid.HLSBlockedStream.url || vid.HLSBlockedStream;
                            if (videoUrl.indexOf("?") < 0)
                                videoUrl += "?";

                            var posterUrl = $scope.getPosterUrl(vid);
                            sources.push({ file: httpsFilt(videoUrl), image: posterUrl });
                        }
                        
                        if (vid.content) {
                            angular.forEach(vid.content, function(value, key) {
                                if (value.assetTypes[0] == "HLS Stream" || value.assetTypes[0] == "HLS Blocked Stream" || value.assetTypes[0] == "Video") {
                                    var videoUrl = value.url || value;
                                    if (videoUrl.indexOf("?") < 0)
                                        videoUrl += "?";
                                    sources.push({ file: httpsFilt(videoUrl) });
                                }
                            });
                        }

                        if (sources.length) {
                            $scope.loadPlayer(vid, sources, true);
                        } 

                        if(vid.media_type === 'user_clip'){
                            $('.clip-create-button').hide();
                        }
                    } 
                };
            
            $scope.verifyPixellotToken = function(){
                return new Promise(
                    (resolve,  reject) => {
                        const now = Math.round(Date.now() / 1000);
                        if(now >  User.AuthExpire){
                            User.refreshAuth().then(function(){
                                resolve();
                            });
                        }else {
                            resolve();
                        }
                    }
                );
            }

            $scope.loadPlayer = function(vid, sources, autostart) {

                $scope.PixellotWebSDK = $window['pixellot-web-sdk'];
                $scope.playerContainer = document.getElementById($scope.id);
                $scope.player = $scope.PixellotWebSDK.Player($scope.playerContainer) ;
                $scope.player.setSource(sources[0]);
                $scope.videoUrl = sources[0];

                //If there is a referenceID, then enable the Clipping and Tagging decorators
                if(vid.referenceId){

                    //Define Clip and Tag decorator
                    const { ClipCreateDecorator, TagDecorator } = $scope.PixellotWebSDK.Decorators;
                    $scope.ClipService = $scope.PixellotWebSDK.ClipService;
                    //Apply Clip Decorator
                    $scope.clipDecorator = ClipCreateDecorator(
                        $scope.player,
                        {
                            onClipCreateRequest: ({from, to}) => { 
    
                                $('.clip-create-button').hide();
                                $('.clip-create-timer').hide();
                                var options = {
                                    startTime: from,
                                    endTime: to,
                                    name: $scope.video.title,
                                    targetId: $scope.video.referenceId,
                                    url: $scope.videoUrl
                                }
                                console.log(options);
                                
                                //Create clip just if there is an Authentication signature available
                                if(User.Auth){
                                    const Auth = User.Auth;    
                                    $scope.ClipService.createClip(options)
                                    .then(response => response.json())
                                    .then(response => { 
                                        console.log(response);
                                        
                                        $scope.isRecording = false;

                                        if(!response.data.code){

                                                $('.alert-success').show();
                                                var filter = {}
                                                filter.reference_id = response.data.id;
                                                $scope.userId = User._id;
                                                $scope.clipCreationDate = new Date().getTime();
                                                
                                                //Check if the user clip is ready
                                                $scope.checkClipInterval = setInterval(function() {
                                                    globalFactory.getUserClips($scope.userId, 0, 1, 'added', '-1' ,filter).then(function(data) {
                                                      
                                                        if (data.length > 0 && data[0].userId === $scope.userId) {
        
                                                            var clipTmp = new Date(data[0].added);
                                                            var clipAddedDate = clipTmp.getTime();
                                                            
                                                            //Check if the last user clip created is the new one
                                                            if(clipAddedDate > $scope.clipCreationDate){
        
                                                                clearInterval($scope.checkClipInterval);
                                                                //Change to the success message
                                                                $('.loading-txt').html('Your clip is ready! You can find it out on <a href="/#!/account/clips">My Account</a>');
                                                                $('.loader').hide(600);
                                                                $('.process-complete-icon').show(600);
                                                                $('.clip-create-button').show();
                                                                $('.clip-create-timer').show();
                                                            }    
                                                        }
                                                    });
                                                }, 10000);
                                           
                                        }else{
                                            $scope.errorMessage = response.data.message;
                                            $('.alert-danger').show(function(){
                                                $('.clip-create-button').show();
                                                $('.clip-create-timer').show();
                                                $('.alert-danger').fadeIn('slow').delay(10000).fadeTo("slow", 0);
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    );
    
                    //Apply Tag Decorator
                    if(User.Auth){

                        //Don't remove. The player SKD fetch an Auth constant into the environment
                        const Auth = User.Auth; 
                        $scope.tagDecorat = TagDecorator($scope.player);
                        var options = {
                            targetId : $scope.video.referenceId,
                            videoType: 'vod',
                            streamName: 'hd',
                            limit: 20
                        };
                        $scope.PixellotWebSDK.TagService.getTags(options)
                        .then(response => response.json())
                        .then(res => {
                            if(typeof(res.data.error) == 'undefined' || res.data.error.length == 0){
                                const tags = res.data.result;
                                $scope.tagDecorat.showTags(tags);
                            }
                        });
                    }
                }
                
                $scope.player.addEventListener("play", function(){
                    $scope.verifyPixellotToken().then(() =>{
                        //Add the buttons into the player to change the player stream if the video has a Pano Stream url
                        if(!$scope.isAdded && $scope.video.PanoStream){
                            $scope.isAdded = true;
                            // hide btns to change between HD / Pano
                            // $('.theo-top-controlbar').append('<div class="stream-icons"><div class="stream-icon hd-icon active" data-action="hd" title="HD Stream"></div><div class="stream-icon pano-icon" data-action="pano" title="Panoramic Stream"></div></div>')
                        }

                        clearInterval($scope.intervalTimer);
                        //CHECK DEVICES
                        if (vid.categories && vid.categories.length > 0 && vid.categories[0].name !== "commerce_free_media") {
                            $scope.intervalTimer = setInterval(function() {
                                AuthService.checkDevices().then(function(data) {
                                    if (!data.data.content.enabled) {
                                        clearInterval($scope.intervalTimer);
                                    }
                                });
                            }, 60000);
                        }
                    });
                });

                //google analytics play event (on setup end)
                $scope.handleMediaEvents('Play', vid.title);

                //Create clip button. Click event listener
                $('.clip-create-button').click(function(){
                    if(!$scope.isRecording){
                        $scope.clipDecorator.cancelRecording();

                        //Check if the user is logged before start to recording
                        if(User._id){
                            $scope.resetLoadingTxt();
                            $scope.isRecording = true;
                            $scope.clipDecorator.startRecording();
                        }else{
                            $('.loginModal').modal('show');
                        }
                    }                    
                })

            };

            //The stream-icons were added by jquery append, so ng-click doesn't work.
            $(document).on('click','.stream-icon',function(){
                
                if(!$(this).hasClass('active')){
                    
                    var action = $(this).attr('data-action');
                    var canChange = false;
                    
                    //Check what is the stream choosed and if it's available in the video data
                    if(action === 'hd' && typeof($scope.video.HLSStream) !==  'undefined'){
                        $scope.videoUrl = $scope.video.HLSStream;
                        canChange = true;
                    }else if(action === 'pano' && typeof($scope.video.PanoStream) !==  'undefined'){
                        $scope.videoUrl = $scope.video.PanoStream;
                        canChange = true;
                    }

                    if(canChange){

                        $('.stream-icon').removeClass('active');
                        $(this).addClass('active');
                        var currentTime = $scope.player.currentTime;
                        
                        $scope.player.setSource($scope.videoUrl);
                        $scope.player.currentTime = currentTime;
                        $scope.player.play();
                    }
                }
            })

            $scope.handleMediaEvents = function(action, videoName) {
                ga('send', { hitType: 'event', eventCategory: 'Videos', eventAction: action, eventLabel: videoName });
            };

            $scope.$on('$routeChangeStart', function(next, current) {
                $scope.player.stop();
                $scope.player = null;
                $scope.PixellotWebSDK = null;
                clearInterval($scope.intervalTimer);
            });

            $scope.getPosterUrl = function(vid) {
                var livePoster = '';
                if (vid.PosterH) {
                    livePoster = vid.PosterH.downloadUrl || vid.PosterH.streamingUrl;
                }
                return livePoster;
            };

            $scope.closeAlert = function(alert){
                $(alert).fadeTo('slow', 0, function(){
                    $(alert).hide();
                });
            }

            $scope.resetLoadingTxt = function(){
                $('.alert-success').hide(600);
                $('.loading-txt').html('The clip is being created. Please wait...');
                $('.process-complete-icon').hide(600);
                $('.loader').show(600);
            }
        }],
        link: function(scope, element, attrs) {
            scope.$watch("video", function(newValue, oldValue) {
                scope.setupVideo(newValue);
            }, true);
        },
        templateUrl: '/assets/theme/tuc/html/directives/pixellot-player.html'
    };
})