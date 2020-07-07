<?php
$path = __DIR__;
$templatePrefix = 'template';
$optionsAvailable = [
    'username:',
    'password:',
    'data:'
];

$options = getopt(null, $optionsAvailable);
$json = file_get_contents($options['data']);
$customerData = json_decode($json);

//SCAPE DOTS 
$customerData->fb_url = str_replace('.', '\.', $customerData->fb_url );
$customerData->twitter_url = str_replace('.', '\.', $customerData->twitter_url );
$customerData->ig_url = str_replace('.', '\.', $customerData->ig_url );
$customerData->pixellot_sdk_url = str_replace('.', '\.', $customerData->pixellot_sdk_url );
//SCAPE DOTS
//SCAPE SLASH 
$customerData->fb_url = str_replace('/', '\/', $customerData->fb_url );
$customerData->twitter_url = str_replace('/', '\/', $customerData->twitter_url );
$customerData->ig_url = str_replace('/', '\/', $customerData->ig_url );
$customerData->pixellot_sdk_url = str_replace('/', '\/', $customerData->pixellot_sdk_url );
//SCAPE SLASH

$customerPrefix = $customerData->prefix;

//CREATE THEME FOLDER
`cp -R assets/theme/$templatePrefix assets/theme/$customerPrefix`;
`LC_CTYPE=C && LANG=C && find $path/assets/theme/$customerPrefix -type f | xargs sed -i '' 's/__{$templatePrefix}__/$customerPrefix/g'`;
//CREATE THEME FOLDER

//CREATE CONFIG
$templateConfig = "application/config/production/config_$templatePrefix.php";
$customerConfig = "application/config/production/config_$customerPrefix.php";


`cp $templateConfig $customerConfig`;
`LC_CTYPE=C && LANG=C && sed -i '' 's/__fb_url__/$customerData->fb_url/g' $customerConfig`;
`LC_CTYPE=C && LANG=C && sed -i '' 's/__twitter_url__/$customerData->twitter_url/g' $customerConfig`;
`LC_CTYPE=C && LANG=C && sed -i '' 's/__ig_url__/$customerData->ig_url/g' $customerConfig`;
`LC_CTYPE=C && LANG=C && sed -i '' 's/__pixellot_sdk_url__/$customerData->pixellot_sdk_url/g' $customerConfig`;
//CREATE CONFIG

//REPLACE COLORS
$lessFile = "assets/theme/$customerPrefix/css/main.less";
`LC_CTYPE=C && LANG=C && sed -i '' 's/__mainColor__/$customerData->main_color/g' $lessFile`;
`LC_CTYPE=C && LANG=C && sed -i '' 's/__secondaryColor__/$customerData->secondary_color/g' $lessFile`;
//REPLACE COLORS



