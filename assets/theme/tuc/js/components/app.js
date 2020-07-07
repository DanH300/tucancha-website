var uvodApp = angular.module('1spot', ['ngRoute', 'toastr', 'ngSanitize', 'ngAnimate', 'ui.bootstrap', 'ngFileUpload'])

.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/assets/theme/tuc/html/pages/home.html',
                controller: 'HomeController'
            })
            .when('/vod/:vodId', {
                templateUrl: '/assets/theme/tuc/html/pages/vod.html',
                controller: 'VodController'
            })
            .when('/login', {
                templateUrl: '/assets/theme/tuc/html/pages/login.html',
                controller: 'LoginController'
            })
            .when('/category/:categoryName', {
                templateUrl: '/assets/theme/tuc/html/pages/category.html',
                controller: 'CategoryController'
            })
            .when('/category/', {
                templateUrl: '/assets/theme/tuc/html/pages/category.html',
                controller: 'CategoryController'
            })
            .when('/identity/:identityId/:identityItem', {
                templateUrl: '/assets/theme/tuc/html/pages/identity-item.html',
                controller: 'IdentityItemController'
            })
            .when('/identity/:identityId', {
                templateUrl: '/assets/theme/tuc/html/pages/identity.html',
                controller: 'IdentityController'
            })
            .when('/activity/:activityId/:activityItem', {
                templateUrl: '/assets/theme/tuc/html/pages/activity-item.html',
                controller: 'ActivityItemController'
            })
            .when('/activity/:activityId', {
                templateUrl: '/assets/theme/tuc/html/pages/activity.html',
                controller: 'ActivityController'
            })
            .when('/account', {
                templateUrl: '/assets/theme/tuc/html/pages/account.html',
                controller: 'AccountController'
            })
            .when('/account/:tab', {
                templateUrl: '/assets/theme/tuc/html/pages/account.html',
                controller: 'AccountController'
            })
            .when('/tv-shows', {
                templateUrl: '/assets/theme/tuc/html/pages/tv-shows.html',
                controller: 'TvShowsController'
            })
            .when('/tv-shows/:showId', {
                templateUrl: '/assets/theme/tuc/html/pages/tv-show.html',
                controller: 'TvShowController'
            })
            .when('/tv-shows/:showId/:seasonNum/:episodeId', {
                templateUrl: '/assets/theme/tuc/html/pages/tv-show.html',
                controller: 'TvShowController'
            })
            .when('/tvod', {
                templateUrl: '/assets/theme/tuc/html/pages/tvod.html',
                controller: 'tvodController'
            })
            .when('/tvod/:vodId', {
                templateUrl: '/assets/theme/tuc/html/pages/single-tvod.html',
                controller: 'singleTvodController'
            })
            .when('/tvod/tv-show/:showId', {
                templateUrl: '/assets/theme/tuc/html/pages/tvod-tv-show.html',
                controller: 'TvodTvShowController'
            })
            .when('/tvod/tv-show/:showId/:seasonId/:episodeId', {
                templateUrl: '/assets/theme/tuc/html/pages/tvod-tv-show.html',
                controller: 'TvodTvShowController'
            })
            .when('/live-stream/:channel', {
                templateUrl: '/assets/theme/tuc/html/pages/live-stream.html',
                controller: 'StreamController'
            })
            .when('/live-stream/:channel/:epgStart/:epgEnd', {
                templateUrl: '/assets/theme/tuc/html/pages/live-stream.html',
                controller: 'StreamController'
            })
            .when('/events', {
                templateUrl: '/assets/theme/tuc/html/pages/events.html',
                controller: 'EventsController'
            })
            .when('/event/:eventId', {
                templateUrl: '/assets/theme/tuc/html/pages/event-item.html',
                controller: 'EventItemController'
            })
            .when('/pay-per-view', {
                templateUrl: '/assets/theme/tuc/html/pages/pay-per-view.html',
                controller: 'PayController'
            })
            .when('/pay-per-view/:ppvId', {
                templateUrl: '/assets/theme/tuc/html/pages/pay-per-view-item.html',
                controller: 'PayItemController'
            })
            .when('/tournaments', {
                templateUrl: '/assets/theme/tuc/html/pages/tournament.html',
                controller: 'TournamentController'
            })
            .when('/tournament/:tId', {
                templateUrl: '/assets/theme/tuc/html/pages/tournament-item.html',
                controller: 'TournamentItemController'
            })
            .when('/subscription', {
                templateUrl: '/assets/theme/tuc/html/pages/subscription.html',
                controller: 'SubscriptionController'
            })
            .when('/phone-validation', {
                templateUrl: '/assets/theme/tuc/html/pages/phone-validation.html',
                controller: 'phoneValidationController'
            })
            .when('/terms-and-conditions', {
                templateUrl: '/assets/theme/tuc/html/pages/terms.html',
                controller: 'LoginController'
            })
            .when('/privacy-policy', {
                templateUrl: '/assets/theme/tuc/html/pages/policy.html',
                controller: 'LoginController'
            })
            .when('/gleaner', {
                templateUrl: '/assets/theme/tuc/html/pages/gleaner.html',
                controller: 'GleanerController'
            })
            .when('/search', {
                templateUrl: '/assets/theme/tuc/html/pages/search.html',
                controller: 'SearchController'
            })
            .when('/search/:keyword', {
                templateUrl: '/assets/theme/tuc/html/pages/search.html',
                controller: 'SearchController'
            })
            .when('/about', {
                templateUrl: '/assets/theme/tuc/html/pages/about.html',
                controller: 'HomeController'
            })
            .when('/support', {
                templateUrl: '/assets/theme/tuc/html/pages/support.html',
                controller: 'HomeController'
            })
            .otherwise({
                redirectTo: '/'
            });

            $locationProvider.html5Mode(true);
    })
    .run(function($rootScope, $window, $location, GeoService) {
        ga('create', 'UA-55351355-29', 'auto');
        $rootScope.$on('$routeChangeSuccess', function() {
            ga('send', 'pageview', $location.path());
        });
        //Get User Location
        GeoService.getLocationData()
        .then(function(data) {
            if (data && data.countryCode) {
                $rootScope.geo = data;
            } else {
                $rootScope.geo = { countryCode: "JM", error: "Get Geo no Data" };
            }
        });
    });


    uvodApp.filter('debug', function() {
        return function(input) {
          if (input === '') return 'empty string';
          return input ? input : ('' + input);
        };
      });