<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:tp="http://player.theplatform.com/" xml:lang="en" lang="en" ng-app="1spot">
<head>
    <meta http-equiv="Cache-Control" content="private" />
    <meta http-equiv="Expires" content="86400" />
    <meta http-equiv="Cache-Control" content="max-age=86400" />
<!-- 
    <meta name="apple-itunes-app" content="app-id=952715623, app-argument=onespotmedia://">
    <meta name="google-play-app" content="app-id=com.univtec.onespotmedia"> -->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Abel&display=swap" rel="stylesheet">
    <link rel="manifest" href="<?php echo "/assets/theme/".UVOD_THEME."/js/manifest.json"?>"">

    <meta name="keywords" content="website, business, store" />
    <meta name="robots" content="index, follow" />
    <meta name="google-site-verification" content="vD6AjRdZ4j60LaYkzVXhsrF_cBgKDRrpYew0aq1H3uI" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@shoot" />
    <meta name="twitter:title" content="<?php echo $title; ?>" />
    <meta name="twitter:description" content="<?php echo $description; ?>" />
    <meta name="twitter:image" content="<?php echo "/assets/theme/".UVOD_THEME."/images/logo.png"?>" />

 

    <meta property="fb:app_id" content="<?php echo FACEBOOK_APP_ID; ?>" />
	<meta property="og:url" content="<?php echo $url; ?>" >
	<meta property="og:type" content="website" >
	<meta property="og:title" content="<?php echo $title; ?>" >
	<meta property="og:description" content="<?php echo $description; ?> " >
    <meta property="og:image" content="<?php echo $image; ?>" >
    
    <!-- SweetAlert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>


    <link rel="shortcut icon" type="image/png" href="<?php echo "/assets/theme/".UVOD_THEME."/images/favicon.png"?>"/>
    <script>
        //Facebook SDK init
        window.fbAsyncInit = function() {
            FB.init({
                appId: "<?php echo FACEBOOK_APP_ID; ?>",
                xfbml: true,
                autoLogAppEvents : true,
                version: 'v2.10',
                cookie: true
            });
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));


        //Google Analyitics Init
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        // ga('create', 'UA-55351355-2', 'auto');

    </script>
    <script type="text/javascript" src="<?php echo $this->config->item("pixellot_sdk_url")?>" ></script>
    <!-- <script type="text/javascript" src="/assets/common/js/jwplayer-7.11.0/jwplayer.js" ></script>
    <script>jwplayer.key="wldzyhAXC/pV8hrmoKJJUJQUQU7UwoOXl6rN1w==";</script> -->

    <script src="/assets/common/js/aniview.js"></script>

    <link rel="stylesheet" type="text/css" href="/assets/common/css/font-awesome.min.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo "/assets/theme/".UVOD_THEME."/css/bootstrap.css"?>" />
    <link rel="stylesheet" type="text/css" href="<?php echo "/assets/theme/".UVOD_THEME."/css/less.php"?>" />

    <!-- <script type="text/javascript" src="https://cdn.tunneling.online/univ_rjr_jw7.js"></script> -->

    <!-- Javascript files -->
    <script type="text/javascript" src="/assets/common/js/jquery.min.js"></script>
    <script type="text/javascript" src="/assets/common/js/jquery.mixitup.min.js"></script>
    <script type="text/javascript" src="/assets/common/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="/assets/common/js/tether.min.js"></script>
    <script type="text/javascript" src="/assets/common/js/filters.panel.js"></script>
    <script type="text/javascript" src="/assets/common/js/functions.js"></script>
    <!-- Angular-->
    <script type="text/javascript" src="/assets/common/js/angular.min.js"></script>
    <script type="text/javascript" src="/assets/common/js/angular-route.min.js"></script>
    <script type="text/javascript" src="/assets/common/js/angular-sanitize.min.js"></script>
    <script type="text/javascript" src="/assets/common/js/angular-animate.min.js"></script>
    <script type="text/javascript" src="/assets/common/js/bootstrap-ui-tpls.min.js"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/components/app.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/ng-file-upload.min.js"?>"></script>

    <!-- Angular Controllers-->
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/category.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/home.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/header.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/live-stream.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/identity-item.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/identity.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/activity.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/activity-item.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/tournament.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/tournament-item.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/pay-per-view.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/pay-per-view-item.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/login.js"?>"></script>
    <!-- <script type="text/javascript" src="<?php //echo "/assets/theme/rjr/js/pages/devices.js"?>"></script> -->
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/tv-show.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/tv-shows.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/vod.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/account.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/phoneValidation.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/tvod.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/single-tvod.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/tvod-tv-show.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/tvod-episode.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/search.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/footer.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/registration-complete.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/event.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/event-item.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/pages/subscription.js"?>"></script>

    <!-- Angular Directives-->
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/jw-player.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/pixellot-player.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/jw-player-live.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/tvod-block.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/event-block.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/ppv-block.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/clip-block.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/user-clip-block.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/tv-show-block.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/episode-block.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/tournament-block.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/identity-block.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/activity-block.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/activity-item-carousel.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/main-slick.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/plans-block.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/checkout-form.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/filter-panel.js"?>"></script>
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/sports-carousel.js"?>"></script>
    
    <!-- Carousel for Tournaments. Added in TuCancha-->
    <?php 
    if(file_exists(FCPATH."/assets/theme/".UVOD_THEME."/js/directives/tournament-carousel.js")){
    ?>
        <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives/tournament-carousel.js"?>"></script>
    <?php
    }
    ?>

    <!-- Angula Directives Helpers -->
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/directives-helpers/slick.min.js"?>"></script>

    <!-- Angular Services-->
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/services/epg.js"?>"></script>

    <!-- Traductions-->
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/i18n/es-AR.js"?>"></script>

    <!-- Customer attr-->
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/customer.js"?>"></script>

    <!-- Angular Factories-->
    <script type="text/javascript" src="/assets/common/js/factories/user.js"></script>
    <script type="text/javascript" src="/assets/common/js/factories/vod.js"></script>
    <script type="text/javascript" src="/assets/common/js/factories/tvod.js"></script>
    <script type="text/javascript" src="/assets/common/js/factories/list.js"></script>
    <script type="text/javascript" src="/assets/common/js/factories/countries.js"></script>
    <script type="text/javascript" src="/assets/common/js/factories/sms.js"></script>
    <script type="text/javascript" src="/assets/common/js/factories/geolocation.js"></script>
    <script type="text/javascript" src="/assets/common/js/factories/global.js"></script>
    <script type="text/javascript" src="/assets/common/js/factories/social.js"></script>
    <script type="text/javascript" src="/assets/common/js/factories/notifications.js"></script>

    <!-- Angular Filters-->
    <script type="text/javascript" src="<?php echo "/assets/theme/".UVOD_THEME."/js/filters/filters.js"?>"></script>


    <!-- <script type="text/javascript">

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-55351355-2']);
        _gaq.push(['_trackPageview']);

        (function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();

    </script> -->
    <!-- Start of Unified Video Technologies Zendesk Widget script -->
    <!-- <script>/*<![CDATA[*/window.zEmbed || function (e, t) {
            var n, o, d, i, s, a = [], r = document.createElement("iframe");
            window.zEmbed = function () {
                a.push(arguments)
            }, window.zE = window.zE || window.zEmbed, r.src = "javascript:false", r.title = "", r.role = "presentation", (r.frameElement || r).style.cssText = "display: none", d = document.getElementsByTagName("script"), d = d[d.length - 1], d.parentNode.insertBefore(r, d), i = r.contentWindow, s = i.document;
            try {
                o = s
            } catch (c) {
                n = document.domain, r.src = 'javascript:var d=document.open();d.domain="' + n + '";void(0);', o = s
            }
            o.open()._l = function () {
                var o = this.createElement("script");
                n && (this.domain = n), o.id = "js-iframe-async", o.src = e, this.t = +new Date, this.zendeskHost = t, this.zEQueue = a, this.body.appendChild(o)
            }, o.write('<body onload="document._l();">'), o.close()
        }("//assets.zendesk.com/embeddable_framework/main.js", "univtec.zendesk.com");/*]]>*/</script> -->
    <!-- End of Unified Video Technologies Zendesk Widget script -->

    <base href="/">

    <link rel="manifest" href="/manifest.json">
    <!-- <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async></script> -->
    <script>
        var OneSignal = window.OneSignal || [];
        OneSignal.push(["init", {
            appId: "<?php echo $this->config->item("onesignal_app_id"); ?>",
            autoRegister: true,
            notifyButton: {
                enable: false /* Set to false to hide */

            }
        }]);
    </script>

    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- Google AdSense -->
<script>
  (adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "ca-pub-5392822421224150",
    enable_page_level_ads: false
  });
</script>


<script src="https://cdn.jsdelivr.net/npm/angular-toastr@2/dist/angular-toastr.tpls.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/angular-toastr@2/dist/angular-toastr.css">


</head>
<body>
    <div ng-include="<?php echo "'assets/theme/".UVOD_THEME."/html/components/header.html'";?>"></div>
    <div ng-view>
    </div>
    <div ng-include="<?php echo "'assets/theme/".UVOD_THEME."/html/components/footer.html'";?>"></div>
    <!-- Go to www.addthis.com/dashboard to customize your tools -->
<!-- <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5d30813849855953"></script> -->

</body>
</html>
