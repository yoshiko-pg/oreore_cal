<?php
require_once('./php_class/include.php');

if(!is_array($_POST['ids'])) die('IDs was empty');

$event_api_manager = new event_api_manager();

foreach($_POST['ids'] as $service => $id){
	if(!$id) continue;
	$class = $service.'_api_wrapper';
	$event_api_manager->add_api_wrapper(new $class($id));
}

$events = $event_api_manager->get_events();

echo json_encode($events);


/*
	$year = '2014';
	$month = '03';

	echo json_encode(array(
	
		array(
			'id' => 111,
			'title' => "Event1",
			'start' => "$year-$month-10",
			'url' => "http://yahoo.com/"
		),
		
		array(
			'id' => 222,
			'title' => "Event2",
			'start' => "$year-$month-20",
			'end' => "$year-$month-22",
			'url' => "http://yahoo.com/"
		)
	
	));

*/
