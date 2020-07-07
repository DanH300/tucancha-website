<?php

function getEntryId($entry) {
    $item_id_arr = explode("/", $entry->_id);
    return $item_id_arr[sizeof($item_id_arr) - 1];
}

function getEntryCategories($entry) {
    $ret = "";
    if ($entry && $entry->categories) {
        $retArr = array();
        for ($i = 0; $i < sizeof($entry->categories); $i++) {
            $retArr[] = $entry->categories[i]->name;
        }
        $ret = implode(",", $retArr);
    }
    return $ret;
}

function getEntryFirstGenre($entry) {
    $ret = "";
    if ($entry &&
            isset($entry->categories) &&
            sizeof($entry->categories) > 0) {
        $ret = $entry->categories[0]->name;
    }
    return $ret;
}

function getEntryFirstVodCategory($entry) {
    $ret = "";
    if ($entry &&
            isset($entry->vod_category) &&
            sizeof($entry->vod_category) > 0) {
        $ret = $entry->vod_category[0];
    }

    return $ret;
}

function getEntryFirstMediaType($entry) {
    $ret = "";
    if ($entry &&
            isset($entry->media_type)) {
        $ret = $entry->media_type;
    }
    return $ret;
}

function getEntryFirstFeaturedCategory($entry) {
    $ret = "";
    if ($entry &&
            isset($entry->featured_category) &&
            sizeof($entry->featured_category) > 0) {
        $ret = $entry->featured_category[0];
    }
    return $ret;
}

function getEntryProperty($entry, $property) {

    $ret = "";

    switch ($property) {
        case 'cover':
            if ($entry->thumbnails &&
                    sizeof($entry->thumbnails) &&
                    $entry->thumbnails[0]->url) {
                $ret = $entry->thumbnails[0]->url;
            }
            break;
        case 'title':
            if (isset($entry->title)) {
                $ret = $entry->title;
            }
            break;
        case 'year':
            if (isset($entry->movie_year)) {
                $ret = $entry->movie_year;
            }
            break;
        case 'runtime':
            if (isset($entry->runtime)) {
                $ret = $entry->runtime;
            }
            break;

        case 'director':
            if (isset($entry->directors)) {
                $ret = $entry->directors;
            }
            break;
        case 'actors':
            if (isset($entry->actors)) {
                $ret = $entry->actors;
            }
            break;
        case 'description':
            if (isset($entry->description)) {
                $ret = $entry->description;
            }
            break;
        case 'adPolicyId':
            if (isset($entry->pladPolicyId)) {
                $ret = $entry->pladPolicyId;
            }
            break;
        case 'genre':
            if (isset($entry->categories)) {
                $arr_genres = array();
                for ($i = 0; $i < sizeof($entry->categories); $i++) {
                    if ($entry->categories[$i]->scheme != 'commerce') {
                        $arr_genres[] = $entry->categories[$i]->name;
                    }
                }
                $ret = implode(", ", $arr_genres);
            }
            break;
        case 'commerce':
            if (isset($entry->categories)) {
                $arr_genres = array();
                for ($i = 0; $i < sizeof($entry->categories); $i++) {
                    if ($entry->categories[$i]->scheme == 'commerce') {

                        $arr_genres[] = $entry->categories[$i]->name;
                    }
                }
                $commerce_class = implode(", ", $arr_genres);
                switch ($commerce_class) {
                    case 'commerce_free_media':
                        $ret = 'commerce_free';
                        break;
                    case 'commerce_members_media':
                        $ret = 'commerce_members';
                        break;
                    case 'commerce_subscription_basic_media':
                        $ret = 'commerce_subscription';
                        break;
                    default:
                        $ret = 'commerce_free';
                        break;
                }
            }
            break;
        case 'writer':
            if (isset($entry->writer)) {
                $ret = $entry->writer;
            }
            break;
        case 'tags':
            if (isset($entry->keywords)) {
                $ret = $entry->keywords;
            }
            break;
        case 'rating':
            if (isset($entry->ratings) && sizeof($entry->ratings)) {
                $arr_sub_ratings = array();
                if (isset($entry->ratings[0]->subRatings)) {
                    for ($i = 0; $i < sizeof($entry->ratings[0]->subRatings); $i++) {
                        $arr_sub_ratings[] = strtoupper($entry->ratings[0]->subRatings[$i]);
                    }
                }
                $ret = strtoupper($entry->ratings[0]->rating) . (sizeof($arr_sub_ratings) ? " (" . implode(", ", $arr_sub_ratings) . ")" : "");
            }
            break;
        case 'media_definition':
            if (isset($entry->mediaDefinition)) {
                $ret = $entry->mediaDefinition[0];
            }
            if (isset($entry->media_definition)) {
                $ret = $entry->media_definition[0];
            }
            break;
        case 'language':
        case 'trailer':
        case 'media_type':
            if (isset($entry->media_type)) {
                $ret = $entry->media_type;
            }
            break;
        case 'blocked_stream_public_url':
            if (isset($entry->blocked_stream_public_url)) {
                $ret = $entry->blocked_stream_public_url;
            }
            break;
        case 'blocked_stream_hls_url':
            if (isset($entry->blocked_stream_hls_url)) {
                $ret = $entry->blocked_stream_hls_url;
            }
            break;
        case 'aired_date':
            if (isset($entry->aired_date)) {
                $date = $entry->aired_date;
                $ret = $date;
            } else {
                $ret = '';
            }
            break;
    }

    return $ret;
}

function getEntryReleaseId($entry, $rendition = "Video") {
    $ret = "";
    if ($entry && $entry->content) {
        for ($i = 0; $i < sizeof($entry->content); $i++) {
            if ($entry->content[$i]->assetTypes[0] == $rendition) {
                $ret = $entry->content[$i]->releases[0]->pid;
                break;
            }
        }
    }
    return $ret;
}

function getEntryReleaseUrl($entry, $rendition = "Video") {
    $ret = "";
    if ($entry && $entry->content) {
        for ($i = 0; $i < sizeof($entry->content); $i++) {
            if (isset($entry->content[$i]->assetTypes) &&
                    sizeof($entry->content[$i]->assetTypes)) {
                for ($j = 0; $j < sizeof($entry->content[$i]->assetTypes); $j++) {
                    if ($entry->content[$i]->assetTypes[$j] == $rendition &&
                            isset($entry->content[$i]->releases) &&
                            sizeof($entry->content[$i]->releases)) {
                        $ret = $entry->content[$i]->releases[0]->url;
                        break;
                    }
                }
            }
            if ($ret)
                break;
        }
    }
    return $ret;
}

function getEntryStreamingUrl($entry, $rendition = "Video") {
    $ret = "";
    if ($entry && $entry->content) {
        for ($i = 0; $i < sizeof($entry->content); $i++) {
            if (isset($entry->content[$i]->assetTypes) &&
                    sizeof($entry->content[$i]->assetTypes)) {
                for ($j = 0; $j < sizeof($entry->content[$i]->assetTypes); $j++) {
                    if ($entry->content[$i]->assetTypes[$j] == $rendition &&
                            isset($entry->content[$i]->streamingUrl)) {
                        $ret = urldecode($entry->content[$i]->streamingUrl);
                        break;
                    }
                }
            }
            if ($ret)
                break;
        }
    }
    return $ret;
}

function getEntryFileUrl($entry, $rendition = "Video") {
    $ret = "";
    if ($entry && $entry->content) {
        for ($i = 0; $i < sizeof($entry->content); $i++) {
            if (isset($entry->content[$i]->assetTypes) &&
                    sizeof($entry->content[$i]->assetTypes)) {
                for ($j = 0; $j < sizeof($entry->content[$i]->assetTypes); $j++) {
                    if ($entry->content[$i]->assetTypes[$j] == $rendition &&
                            isset($entry->content[$i]->url)) {
                        $ret = $entry->content[$i]->url;
                        break;
                    }
                }
            }
            if ($ret)
                break;
        }
    }
    return $ret;
}

function getEntryRenditions($entry, $rendition = "Video") {
    $ret = array();
    if ($entry && $entry->content) {
        for ($i = 0; $i < sizeof($entry->content); $i++) {
            if (isset($entry->content[$i]->assetTypes) && sizeof($entry->content[$i]->assetTypes)) {
                for ($j = 0; $j < sizeof($entry->content[$i]->assetTypes); $j++) {
                    if ($entry->content[$i]->assetTypes[$j] == $rendition &&
                            isset($entry->content[$i]->streamingUrl)) {

                        $rend = new stdClass();

                        $rend->file = urldecode($entry->content[$i]->streamingUrl);
                        $rend->label = $entry->content[$i]->width . 'x' . $entry->content[$i]->height . ' ' . formatBytes($entry->content[$i]->bitrate, 0);
                        $rend->bitrate = $entry->content[$i]->bitrate;

                        $ret[] = $rend;
                    }
                }
            }
        }
    }

    usort($ret, function($a, $b) {
        return ($a->bitrate < $b->bitrate);
    });

    return $ret;
}

function formatBytes($bytes, $precision = 2) {
    $units = array('b', 'kb', 'mb', 'gb', 'tb');

    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);

    return round($bytes, $precision) . $units[$pow];
}

function getEntryThumbnail($entry, $type) {
    $ret = "";

    if ($entry && $entry->content) {
        for ($i = 0; $i < sizeof($entry->content); $i++) { 
            if (isset($entry->content[$i]->assetTypes) &&
                    sizeof($entry->content[$i]->assetTypes)) {
                for ($j = 0; $j < sizeof($entry->content[$i]->assetTypes); $j++) {
                    if ($entry->content[$i]->assetTypes[$j] == $type) {
                        $ret = urldecode($entry->content[$i]->downloadUrl);
                        break;
                    }
                }
            }
            if ($ret)
                break;
        }
    }
    return $ret;
}

// returns if the object it's a movie, series or episode
function getEntryVodType($entry) {

    if (isset($entry->vod_category)) {
        for ($i = 0; $i < sizeof($entry->vod_category); $i++) {
            if ($entry->vod_category[$i] == "tvj_shows") {
                if (isset($entry->seasons)) {
                    return "tvj_shows";
                } else {
                    return "episode";
                }
            }
        }

        // movie is the default return type
        return "movie";
    } else {
        return "episode";
    }
}

function parseDate($entry) {
    $newDate = "";
    if ($entry != "") {
        $newDate = date("F d, Y", (intval($entry)));
    }
    return $newDate;
}

function pdk_get_entry_download_url($entry, $rendition, $width) {
    $ret = "";
    if ($entry && $entry->content) {
        for ($i = 0; $i < sizeof($entry->content); $i++) {
            if (isset($entry->content[$i]->assetTypes) &&
                    sizeof($entry->content[$i]->assetTypes)) {
                for ($j = 0; $j < sizeof($entry->content[$i]->assetTypes); $j++) {
                    if ($entry->content[$i]->assetTypes[$j] == $rendition &&
                            $entry->content[$i]->width == $width) {
                        $ret = $entry->content[$i]->downloadUrl;
                        break;
                    }
                }
            }
            if ($ret)
                break;
        }
    }
    return $ret;
}

function pdk_get_entry_mobile_streaming_url($entry) {

    $url = null;

    $url = pdk_get_entry_download_url($entry, "Video", 854);
    if (!$url)
        $url = pdk_get_entry_download_url($entry, "Video", 600);
    if (!$url)
        $url = pdk_get_entry_download_url($entry, "Video", 400);
    if (!$url)
        $url = pdk_get_entry_download_url($entry, "Video", 320);

    return $url;
}

?>