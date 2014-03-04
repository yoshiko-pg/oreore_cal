<?php

class event_api_manager{

	private $api_wrappers = array();

	public function add_api_wrapper(event_api_wrapper $wrapper){

		$this->api_wrappers[] = $wrapper;

	}

	public function get_events(){

		$events = array();

		foreach($this->api_wrappers as $wrapper){
			$events = array_merge($events, $wrapper->get_events());
		}

		return $events;
	}
	
}
