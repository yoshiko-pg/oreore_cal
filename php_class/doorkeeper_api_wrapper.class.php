<?php

class doorkeeper_api_wrapper extends event_api_wrapper{

	protected $user_id_key = "user_id";

	protected $api_url = 'http://api.doorkeeper.jp/';


	public function format_events($events_data){

		$data = json_decode($events_data, true);

		if(!$data){
			throw new UnexpectedValueException('events not found');
		}

		return $data;

	}
	
}
