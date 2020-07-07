<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*!
* HybridAuth
* http://hybridauth.sourceforge.net | http://github.com/hybridauth/hybridauth
* (c) 2009-2012, HybridAuth authors | http://hybridauth.sourceforge.net/licenses.html
*/

// ----------------------------------------------------------------------------------------
//	HybridAuth Config file: http://hybridauth.sourceforge.net/userguide/Configuration.html
// ----------------------------------------------------------------------------------------

$config =
	array(
		// set on "base_url" the relative url that point to HybridAuth Endpoint
		'base_url' => 'index.php/hauth/endpoint/',

		"providers" => array (
			// openid providers
			/*"OpenID" => array (
				"enabled" => true
			),

			"Yahoo" => array (
				"enabled" => true,
				"keys"    => array ( "id" => "", "secret" => "" ),
			),

			"AOL"  => array (
				"enabled" => true
			),*/

			"Google" => array (
				"enabled" => true,
				"keys"    => array (
								"id" => getenv("google_stage_id"), "secret" => getenv("google_stage_secret")),
				"scope"	  => 	"https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
			),

			"Facebook" => array (
				"enabled" => true,
				"keys"    => array ( "id" => getenv("FACEBOOK_APP_ID"), "secret" => getenv("FACEBOOK_APP_SECRET") ),
				"scope"   => "email, public_profile, user_about_me, user_birthday, user_hometown, publish_actions, user_friends", // optional
				"display" => "popup",
				"trustForwarded" => true
			),

			"Twitter" => array (
				"enabled" => true,
				"keys"    => array ( "key" => getenv("twitter_stage_id"), "secret" => getenv("twitter_stage_secret") ),
				"includeEmail" => true,
				"display" => "popup"
			),

			"Instagram" => array (
					"enabled" => true,
					"keys"    => array ( "id" => getenv("insta_id"), "secret" => getenv("insta_secret")),
					//"keys"    => array ( "id" => "e591d939f2a04a04ac8c4139b2b38ffc", "secret" => "d54935fe5a574df48022d601fdb7105c" ),
			),

			// windows live
			"Live" => array (
				"enabled" => true,
				"keys"    => array ( "id" => "", "secret" => "" )
			),
			"Vkontakte" => array (
				"enabled" => true,
				"keys"    => array ( "id" => getenv("vk_app_id"), "secret" => getenv("vk_app_secret") )
			),

			/*
			"MySpace" => array (
				"enabled" => true,
				"keys"    => array ( "key" => "", "secret" => "" )
			),*/

			"LinkedIn" => array (
				"enabled" => true,
				"keys"    => array ( "key" => "77sqm96fybf4ip", "secret" => "szE2Yu4vuXMHHngO"),
				"scope" => 'r_basicprofile, r_emailaddress, w_share'
			),
			/*
			"Foursquare" => array (
				"enabled" => true,
				"keys"    => array ( "id" => "", "secret" => "" )
			),*/
		),

		// if you want to enable logging, set 'debug_mode' to true  then provide a writable file by the web server on "debug_file"
		"debug_mode" => false,

		"debug_file" => APPPATH.'/logs/hybridauth.log',
	);


/* End of file hybridauthlib.php */
/* Location: ./application/config/hybridauthlib.php */
