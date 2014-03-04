<?php
require_once('./php_class/include.php');

if(!is_array($_POST['ids'])) die('IDs was empty');

$return = array();

foreach($_POST['ids'] as $service => $id){

	if(!$id) continue;

	$class = $service.'_api_wrapper';
	$api_wrapper = new $class($id);

	try{
		$events = $api_wrapper->get_events();
		$return[$service] = $events;

	}catch(Exception $e){
		$return[$service] = false;
	}
}

echo json_encode($return);
