<?php
	
    function get_secure_hls_url($url, $secret="", $expiration=60, $ci=10, $cd=10) {

        if (!$secret) return $url;

        $base_url = substr($url, 0, strrpos($url, "/") + 1);
        $p = strlen($base_url);
        $ci = 60;
        $cd = 60;
        $e = time() + $expiration*60;
        $cf = time() + 240*60*60;
        $hash = md5($secret . $base_url . "?p=$p&ci=$ci&cd=$cd&e=$e&cf=$cf");

        return $url . "?p=$p&ci=$ci&cd=$cd&e=$e&cf=$cf&h=$hash";
    }

?>