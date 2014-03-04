var event_api_wrapper = {

	common_param: {
		count: 100
	},

	service_setting: {

		atnd: {
			id_key: 'user_id',
			url: 'http://api.atnd.org/events/',
			other_param: {
				format: 'jsonp'
			}
		},

		connpass: {
			id_key: 'nickname',
			url: 'http://connpass.com/api/v1/event/',
			other_param: {
				format: 'json'
			}
		},

		zusaar: {
			id_key: 'user_id',
			url: 'http://www.zusaar.com/api/event/',
			other_param: {
				format: 'jsonp'
			}
		},
	},

	/**
	 * サービス名がキー、IDが値の配列を引数で渡すと
	 * イベントをまとめてjson形式で取得し、events配列をcallbackに渡します。
	 * ymを配列（[yyyymm, yyyymm, yyyymm...]）で渡すと、
	 * その年月のイベントだけに絞り込みます。
	 */
	get_events: function(ids, callback, ym){

		ids = ids || {};
		if(ym.length) this.common_param.ym = ym.join(',');

		var ajaxlist = [];

		for(service in ids){
			if(ids[service] && this.service_setting[service]){
				var data = $.extend({}, this.common_param);
				if(this.service_setting[service].other_param){
					data = $.extend(data, this.service_setting[service].other_param);
				}
				data[this.service_setting[service].id_key] = ids[service];
				ajaxlist.push($.ajax({
					url: this.service_setting[service].url,
					data: decodeURIComponent($.param(data)),
					type: 'GET',
					dataType: 'jsonp'
				}));
			}
		}

		$.when.apply($, ajaxlist)
		.done(function () {

			var events = [];

			for (var i = 0; i < arguments.length; i++) {
				events = events.concat( 
					arguments[i][0].events || 
					arguments[i][0].event
				);
			}

			callback(events);

		}).fail(function(){

			var error = new Error();
			error.message = "Sorry, fetch events error";
			throw error;
		});
	}

};
