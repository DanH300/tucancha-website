<?php
    $param = $_GET['_escaped_fragment_'];
    $actual_link = "https" . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $data = explode('/', $param);

    if (!$data[1]) {
        $item = array();
        $item[0]['title'] = 'Shoott';
        $item[0]['description'] = 'shoot.co.za is a Jamaican provider of Live Events and On-Demand Content to viewers all over the world';
        $item[0]['PosterH']['downloadUrl'] = '/assets/theme/sht/images/logo.png';
    }elseif (count($data)==5){
        if($data[1] == 'tv-shows'){
            $item = $this->vod_item_model->get_item_data($data[4]);
        }
    }else {
        if($data[1] == 'vod'){
            $item = $this->vod_item_model->get_item_data($data[2]);
        }
        if($data[1] == 'tv-shows'){
            $item = $this->vod_item_model->get_item_data($data[2]);
        }
        if($data[1] == 'tvod' && $data[2] != 'tv-show'){
            $result = $this->tvod_model->get_by_id($data[2]);
            $item[0]= $result;
        }
        if($data[1] == 'tvod' && $data[2] == 'tv-show'){
            $result = $this->tvod_model->get_by_id($data[3]);
            $item[0]= $result;
        }
    }

    makePage($item[0], $actual_link);

function makePage($data, $actual_link) {
    ?>

    <!DOCTYPE html>
    <html>
        <head>
            <meta name="twitter:card" content="player">
            <meta name="twitter:site" content="@Shoott">
            <meta name="twitter:title" content="<?php echo $data['title']; ?>">
            <meta name="twitter:description" content="<?php echo $data['description']; ?>">
            <meta name="twitter:image" content="<?php echo $data['PosterH']['downloadUrl'] ?>">
            <meta name="twitter:player" content="<?php echo $actual_link ?>">
            <meta name="twitter:player:width" content="600">
            <meta name="twitter:player:height" content="345">

            <meta property="og:title" content="<?php echo $data['title']; ?>" />
            <meta property="og:type" content="website" />
            <!-- <meta property="og:url" content="http://www.imdb.com/title/tt0117500/" /> -->
            <meta property="og:image" content="<?php echo $data['PosterH']['downloadUrl'] ?>" />
             
            <!-- <meta property="al:ios:app_store_id" content="952715623" />
            <meta property="al:ios:url" content="https://shoott.co.za" />
            <meta property="al:ios:app_name" content="Shoott" />
             
            <meta property="al:android:package" content="com.univtec.onespotmediajamaica" />
            <meta property="al:android:url" content="https://shoott.co.za" />
            <meta property="al:android:app_name" content="Shoott" /> -->

            <script type="text/javascript" src="/assets/common/js/jwplayer-7.11.0/jwplayer.js?ver=<?php echo VERSION_NUMBER?>" ></script>
            <script>jwplayer.key="wldzyhAXC/pV8hrmoKJJUJQUQU7UwoOXl6rN1w==";</script>

            <meta property="og:title" content="<?php echo $data['title']; ?>" />
            <meta property="og:type" content="website" />
            <!-- <meta property="og:url" content="http://www.imdb.com/title/tt0117500/" /> -->
            <meta property="og:image" content="<?php echo $data['PosterH']['downloadUrl'] ?>" />
             
            <!-- <meta property="al:ios:app_store_id" content="952715623" />
            <meta property="al:ios:url" content="https://shoott.co.za" />
            <meta property="al:ios:app_name" content="Shoott" />
             
            <meta property="al:android:package" content="com.univtec.onespotmedia" />
            <meta property="al:android:url" content="https://shoott.co.za" />
            <meta property="al:android:app_name" content="Shoott" /> -->



        </head>
        <body>
            <div class="jwplayer" id="jwplayer"></div>
            <!-- <h1><?php //echo $data['title']; ?></h1> -->
            <!-- <p><?php //echo $data['description']; ?></p> -->
            <!-- <img src="<?php //echo $data['PosterH']['downloadUrl'] ?>"> -->

            <script>
                var sources = [];
                var vid = <?php echo json_encode($data);?>;
                var videoUrl = '';
                console.log(vid);

                if (vid.AISBlockedStream) {
                    videoUrl = vid.AISBlockedStream.url || vid.AISBlockedStream.downloadUrl;
                    if(videoUrl.indexOf("?")<0)
                        videoUrl +="?";
                    sources.push({ image: vid.PosterH.downloadUrl, defualt:true,file: videoUrl.replace('http://', 'https://') });

                }else if (vid.AISStream) {
                    videoUrl = vid.AISStream.url || vid.AISStream.downloadUrl;
                    if(videoUrl.indexOf("?")<0)
                        videoUrl +="?";
                    sources.push({ image: vid.PosterH.downloadUrl, defualt:true,file: videoUrl.replace('http://', 'https://') });

                }else{
                    if(vid.HLSBlockedStream){
                        videoUrl = vid.HLSBlockedStream.url || vid.HLSBlockedStream.downloadUrl;
                        if(videoUrl.indexOf("?")<0)
                            videoUrl +="?";
                        sources.push({image: vid.PosterH.downloadUrl, file: videoUrl.replace('http://', 'https://') });
                    }
                    if(vid.HLSStream){
                        videoUrl = vid.HLSStream.url || vid.HLSStream.downloadUrl;
                        if(videoUrl.indexOf("?")<0)
                            videoUrl +="?";
                        sources.push({image: vid.PosterH.downloadUrl, file: videoUrl.replace('http://', 'https://')});
                    }
                    if(vid.Video){
                        videoUrl = vid.Video.url || vid.Video.downloadUrl;
                        if(videoUrl.indexOf("?")<0)
                            videoUrl +="?";
                        sources.push({image: vid.PosterH.downloadUrl, file: videoUrl.replace('http://', 'https://')});
                    }
                    if(vid.Trailer){
                        videoUrl = vid.Trailer.url || vid.Trailer.downloadUrl;
                        if(videoUrl.indexOf("?")<0)
                            videoUrl +="?";
                        sources.push({image: vid.PosterH.downloadUrl, file: videoUrl.replace('http://', 'https://')});

                    }
                    if(vid.mainTrailer){
                        videoUrl = vid.mainTrailer.url || vid.mainTrailer.downloadUrl;
                        if(videoUrl.indexOf("?")<0)
                            videoUrl +="?";
                        sources.push({image: vid.PosterH.downloadUrl, file: hvideoUrl.replace('http://', 'https://')});
                    }  
                };

                jwplayer('jwplayer').setup({
                    playlist: sources,
                    primary: 'html5',
                    androidhls: true,
                    autostart: false,
                    aspectratio: "16:9",
                    controls: true,
                    width: "100%",
                    icons: false,
                    visualplaylist:false,
                    image: vid.PosterH.downloadUrl
                });

            </script>

        </body>
    </html>

    <?php
}
?>
