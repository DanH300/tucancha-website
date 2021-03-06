<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*-------------------------------------------------------------------------
   CONFIG FILE
--------------------------------------------------------------------------*/


//CDN
$config['fb_url'] = 'https://univcdn.streamgates.net/univ_delivery/';
$config['twitter_url'] = '';
$config['ig_url'] = 'https://www.instagram.com/Mysoccerplayer2019/';

$config['streams_md5_shared_secret'] = '900P@rkCenter456';

$config['pixellot_sdk_url'] = 'https://pixellot-web-sdk.pixellot.tv/5d935db32f478e001c99e88b/v1.2.0/pixellot-web-sdk.js';

$config['logo_file'] = 'tvj_logo.png';
$config['logo_width'] = '127px';
$config['logo_height'] = '96px';
$config['logo_top'] = '44px';

$config['menu_highlight_color'] = 'rgb(254,215,0)';

$config['cover_asset_type'] = 'Poster H';
$config['cover_width'] = '220px';
$config['cover_height'] = '124px';
$config['cover_h_width'] = '215px';
$config['cover_h_height'] = '34px';
$config['cover_info_width'] = '320px';
$config['cover_info_height'] = '180px';

$config['show_genre_filter'] = 'yes';
$config['show_aired_date_filter'] = 'yes';
$config['show_trailer_button'] = 'no';

$config['button_play_width'] = '320px';
$config['button_play_image'] = 'rjr-btn_play_bg.png';
$config['button_play_padding_left'] = '150px';

$config['category1'] = array('label'=>'New Releases','value'=>'new_releases');
$config['category2'] = array('label'=>'Recommended','value'=>'recommended');
$config['category3'] = array('label'=>'Coming Soon','value'=>'coming_soon');

$config['load_submenu'] = true;

$config['timezone'] = 'Africa/Johannesburg';

$config['subscriptions_ids'] = '19439888|19441019|19439889|19441020';
$config['trial_subscription_id'] = '20028852';

$config['available_subscription_labels'] = array(
	'19439888' => '1_MONTH_SUBSCRIPTION',
	'19439889' => '3_MONTH_SUBSCRIPTION',
	'19441019' => '6_MONTH_SUBSCRIPTION',
	'19441020' => '12_MONTH_SUBSCRIPTION'
);

$config['available_subscription_prices'] = array(
	'19439888' => '9.99',
	'19439889' => '24.98',
	'19441019' => '49.95',
	'19441020' => '99.9'
);
