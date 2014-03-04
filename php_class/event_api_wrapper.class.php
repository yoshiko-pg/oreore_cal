<?php

abstract class event_api_wrapper{

	protected $user_id;

	protected $user_id_key;

	protected $api_url;

	protected $other_param = array();


	public function __construct($user_id){

		$this->user_id = $user_id;

	}

	public function get_events(){

		$param = $this->other_param + array($this->user_id_key => $this->user_id);
		$url = $this->api_url.'?'.http_build_query($param, '', '&');
		$events_data = @file_get_contents($url);

		$events_data = $this->format_events($events_data);

		return $events_data;
		
	}

	abstract public function format_events($events_data);
	
 }
