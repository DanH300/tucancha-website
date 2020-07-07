var tvc = null;

uvodApp.controller('TvodEpisodeController', function($scope, globalFactory, vodFactory, listFactory, $location, $routeParams, User, $rootScope, $window, $document, $anchorScroll, socialFactory) {
    tvc = $scope;

    $scope.user = User;
    $scope.seasons = {};
    $scope.seriesInfo = {};
    $scope.currentSeason = 1;
    $scope.currentEpisode = 1;
    $scope.loadingSeasons = true;
    $scope.loadingPlayer = false;
    $scope.episodeIndex = 0;
    $scope.watching = false;
    $scope.allowAccess = true;
    $scope.activeVideo;
    $scope.totalEpisodes = 0;
    $scope.totalSeasons = 0;
    $scope.rating = "";
    $scope.seriesPosterH = "";
    $scope.seriesPosterV = "";

    $scope.currentEpisodesLength = 10;

    $window.scroll(0, 0);
    vodFactory.getSeries($routeParams.showId).then(function(data) {
        $scope.seriesInfo = data;
        $scope.seasons = $scope.seriesInfo.seasons;
        var lastSeason = 1;
        if ($scope.seasons) {
            angular.forEach($scope.seasons, function(value, key) {
                lastSeason = key;
                $scope.totalEpisodes += value.episodes.length;
                $scope.totalSeasons++;
            });
            $scope.episodes = $scope.seasons[lastSeason].episodes;
            $scope.currentSeason = $scope.seasons[lastSeason].number;
            $scope.totalSeasonEpisodes = $scope.episodes.length;
            $scope.currentEpisodesLength = $scope.totalSeasonEpisodes - $scope.episodeIndex;
        }
        // Checks if params of season and episode were passed and plays video
        if ($routeParams.seasonNum && $routeParams.episodeId) {
            for (var i = 0; i < $scope.seasons[$routeParams.seasonNum].episodes.length; i++) {
                if ($scope.seasons[$routeParams.seasonNum].episodes[i].media._id == $routeParams.episodeId) {
                    $scope.watch($scope.seasons[$routeParams.seasonNum].episodes[i]);
                    $scope.getEpisodes($scope.seasons[$routeParams.seasonNum]);
                }
            }
        }
        $scope.seriesChannel = "/assets/theme/tuc/images/logos/TVJ_Logo.png";
        $scope.seriesPosterH = $scope.getPosterH($scope.seriesInfo.content);
        $scope.seriesPosterV = $scope.getPosterV($scope.seriesInfo.content);
        $scope.rating = $scope.seriesInfo.ratings ? ($scope.seriesInfo.ratings[0] ? $scope.seriesInfo.ratings[0].rating : 'G') : 'G';
        $scope.commerceMedia = $scope.seriesInfo.categories ? ($scope.seriesInfo.categories[0] ? $scope.seriesInfo.categories[0].name : 'commerce_free') : 'commerce_free';
        $scope.loadingSeasons = false;
    });

    globalFactory.getAllSeries(0).then(function(data) {
        $scope.otherShows = data;
    })

    $scope.addToList = function(videoId, $event) {
        $event.stopPropagation();
        if (!User._id) {
            $('.loginModal').modal('show');
        } else {
            listFactory.addWatchlist(videoId);
        }
    };

    $scope.removeFromList = function(videoId, $event) {
        $event.stopPropagation();
        listFactory.removeWatchlist(videoId);
    };

    $scope.isInWatchlist = function(id) {
        return listFactory.isInWatchlist(id);
    }

    $scope.getPosterH = function(content) {
        var i;
        for (i = 0; i < Object.keys(content).length; i++) {
            if (content[i].assetTypes[0] == "Poster H") {
                return content[i].downloadUrl;
            }
        }
    };

    $scope.getPosterV = function(content) {
        var PosterH = "";
        var i;
        for (i = 0; i < Object.keys(content).length; i++) {
            if (content[i].assetTypes[0] == "Poster V") {
                return content[i].downloadUrl;
            }
            if (content[i].assetTypes[0] == "Poster H") {
                PosterH = content[i].downloadUrl;
            }
        }
        return PosterH;
    };

    $scope.getEpisodes = function(season) {
        $scope.episodes = season.episodes;
        $scope.currentSeason = season.number;
        $scope.totalSeasonEpisodes = $scope.episodes.length;
        $scope.episodeIndex = 0;
        $scope.currentEpisodesLength = $scope.totalSeasonEpisodes - $scope.episodeIndex;
    };

    $scope.getEpisode = function(episode) {
        $scope.currentEpisode = episode.number;
    };
    $scope.subscriptionType = function(type) {
        if (type == "commerce_free_media") {
            return 'free';
        }
        if (type == "commerce_members_media") {
            return 'members';
        }
        if (type == "commerce_subscription_basic_media") {
            return 'subscription';
        }
        return 'free';
    };

    $scope.changeEpisodeIndex = function(index) {
        $scope.episodeIndex = index;
        $scope.currentEpisodesLength = $scope.totalSeasonEpisodes - $scope.episodeIndex;
    };

    $scope.watch = function(episode) {
        $window.scroll(0, 0);
        $scope.loadingPlayer = true;
        $scope.currentEpisode = episode.number;
        $scope.activeVideo = episode.media;
        $scope.currentRating = $scope.activeVideo.ratings ? ($scope.activeVideo.ratings[0] ? $scope.activeVideo.ratings[0].rating : 'G') : 'G';
        var subscriptionType = episode.media.categories ? (episode.media.categories[0] ? episode.media.categories[0].name : 'commerce_free_media') : 'commerce_free_media';
        if (subscriptionType == 'commerce_subscription_basic_media') {
            if (angular.isUndefined(User._id) || !User.subscriptionPlan) {
                $scope.permission = 'Subscribed';
                $scope.allowAccess = false;
                $scope.loadingPlayer = false;
                return;
            }
        }
        if (subscriptionType == 'commerce_members_media' && angular.isUndefined(User._id)) {
            $scope.permission = 'a Member';
            $scope.allowAccess = false;
            $scope.loadingPlayer = false;
            return;
        }
        $scope.permission = 'Free';
        $scope.allowAccess = true;
        $scope.watching = true;
        $scope.currentEpisode = episode.number;
        $scope.loadingPlayer = false;

    };

    $scope.go = function(path) {
        $location.path(path);
    };

    $scope.hasAccess = function() {
        return ((!$scope.activeVideo.categories || $scope.activeVideo.categories[0].name == '' || $scope.activeVideo.categories[0].name == 'commerce_free_media') ||
            ($scope.activeVideo.categories[0].name == 'commerce_members_media' && User._id) || ($scope.activeVideo.categories[0].name == 'commerce_subscription_basic_media' && User.subscriptionPlan))
    }

    $scope.facebookShareSeries = function() {
        $scope.facebookShare($scope.seriesInfo.description, $scope.seriesInfo.title, $scope.seriesPosterV);
    }

    $scope.facebookShareEpisode = function() {
        $scope.facebookShare($scope.activeVideo.description, $scope.activeVideo.title, $scope.getPosterH($scope.activeVideo.content));
    }

    $scope.facebookShare = function(description, title, image) {
        var url = '';
        if ($scope.activeVideo) url = 'https://tucancha.ec/#!/tv-shows/' + $routeParams.showId + '/' + $scope.currentSeason + '/' + $scope.activeVideo._id;
        else url = 'https://tucancha.ec/#!/tv-shows/' + $routeParams.showId + '/';
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
        if ($scope.activeVideo) url = 'https://tucancha.ec/%23!/tv-shows/' + $routeParams.showId + '/' + $scope.currentSeason + '/' + $scope.activeVideo._id;
        else url = 'https://tucancha.ec/%23!/tv-shows/' + $routeParams.showId + '/';
        $window.open("https://twitter.com/intent/tweet?text=" + url, "_blank")
    }
    $scope.openLoginModel = function() {
        $('.loginModal').modal('show');
    };
});