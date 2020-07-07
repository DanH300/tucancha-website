<?php

function apiCall($method, $parameters=null, $debug=false) {

	$ci=& get_instance();

	$url_params = "";

	if ($parameters) {
		$url_params = str_replace("=", "/", http_build_query($parameters, "", "="));
		$url_params = str_replace('+', '%20', $url_params);
	}
       
	$url = $ci->config->item('api_endpoint') . $method . "/" . $url_params;
 
	$curl_handle = curl_init();  
	curl_setopt($curl_handle, CURLOPT_URL, $url);  
	curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);  
	curl_setopt($curl_handle, CURLOPT_USERPWD, $ci->config->item('api_user') . ':' . $ci->config->item('api_password'));  

	$buffer = curl_exec($curl_handle);  
// error_log('--------- buffer: method: '.$url.' return: '.$buffer);
	curl_close($curl_handle);  
	
	if ($debug) return $url;

	return json_decode($buffer);
}

function apiPost($method, $parameters=null) {

	$ci=& get_instance();

	$url = $ci->config->item('api_endpoint') . $method;

	$parameters_str = json_encode($parameters);

	$curl_handle = curl_init();  		
	curl_setopt($curl_handle, CURLOPT_URL, $url);  
	curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);  
	curl_setopt($curl_handle, CURLOPT_USERPWD, $ci->config->item('api_user') . ':' . $ci->config->item('api_password'));
	curl_setopt($curl_handle, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Content-Length: ' . strlen($parameters_str)));		
	curl_setopt($curl_handle, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $parameters_str);

	$buffer = curl_exec($curl_handle);  
	curl_close($curl_handle);
// error_log('--------- buffer: method: '.$url.' return: '.$buffer);
	// checks if API has a PHP error
	if (strpos($buffer, "<div")) {
		throw new Exception("API RETURN ERROR: " . $buffer);
	}

	return json_decode($buffer);
}

?>