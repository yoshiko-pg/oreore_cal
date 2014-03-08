$(function(){

	var get_events_from_input = function(callback, ym){

		var ids = {};
		ym  = ym || [];

		$('#first .item :text').each(function() {
			var input_id = $(this).attr('id');
			ids[input_id] = $(this).val() || $.cookie(input_id);
		});

		// 帰ってきたデータをfullcalendar.jsが受け取れる形にフォーマット
		var format_events = function(events){
			var formatted = [];
			var events_length = events.length;
			for(var i = 0; i < events.length; i++){
				var e = events[i];
				formatted.push({
					title: e.title,
					start: e.started_at,
					end: e.ended_at,
					allDay: false,
					popup: '<div class="modal fade" id="event_popup" tabindex="-1" role="dialog" aria-hidden="true">' + 
							'<div class="modal-dialog">' + 
							'<div class="modal-content">' +
							'<div class="modal-header">' +
								'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
								'<h4 class="modal-title">'+e.title+'</h4>' +
							'</div>' +
							'<div class="modal-body">' + 
								'<p>開始：' + popup_date(e.started_at) + '</p>' + 
								'<p>終了：' + popup_date(e.ended_at) + '</p>' + 
								'<p>場所：<a href="https://maps.google.com/maps?q='+e.address+'" target="_blank">' + e.address + ' ' + e.place + ' <i class="fa fa-external-link"></i></a></p>' +
								'<p>' + e.catch + '</p>' + 
						   '</div>' +
						   '<div class="modal-footer">' + 
								'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button> ' +
								'<a href="'+e.event_url+'" target="_blank" class="btn btn-primary">Open event page <i class="fa fa-external-link"></i></button>' +
							'</div>' + 
							'</div>' + 
							'</div>' + 
						'</div>',
					className: e.service
				});
			}
			return formatted;
		}
		
		try{
			event_api_wrapper.get_events(ids, function(events){
				console.log(events); // TMP
				callback(format_events(events));
			}, ym);

		}catch(e){
			console.log('Error: '+e.message);
			$('#get_event_result').text('Sorry, fetch events error');
			$('#loading').hide();
		}	
	};

	var format_ym = function(start, end){
		var i = new Date(start.getFullYear(), start.getMonth(), 1, 0, 0, 0);
		var end_time = new Date(end.getFullYear(), end.getMonth(), 1, 0, 0, 0).getTime();
		var ym_format = function(d){ 
			return d.getFullYear()+((('0'+(d.getMonth()+1)).slice(-2)));
		};
		var ym_array = [];

		for(; i.getTime() <= end_time; i = new Date(i.getFullYear(), i.getMonth()+1, 1, 0, 0, 0)){ 
			ym_array.push(ym_format(i));
		}
		return ym_array;
	};

	var cal_option = {
		header: {
			left: 'month,agendaWeek,agendaDay',
			center: 'title',
			right: 'prev,next today'
		},
		titleFormat: {
			month: 'yyyy - MM',
			week: "[yyyy] M/d{ '-' [yyyy ]M/d}",
			day: 'yyyy M/d, dddd'
		},
		columnFormat: {
			month: 'ddd',
			week: 'M/d ddd',
			day: 'M/d dddd'
		},
		axisFormat: 'H:mm',
		timeFormat: {
			'': 'H:mm', // default
			agenda: 'H:mm{ - H:mm}'
		},	
		firstDay: 1,
		firstHour: 9,
		buttonText: {
			prev: "<i class='fa fa-chevron-left'></i>",
			next: "<i class='fa fa-chevron-right'></i>",
			prevYear: "<i class='fa fa-chevron-left'></i>",
			nextYear: "<i class='fa fa-chevron-right'></i>",
			today: 'today',
			month: 'month',
			week: 'week',
			day: 'day'
		},
		editable: false,
		events: function(start, end, callback) {
			get_events_from_input(function(events){
				callback(events);
			}, format_ym(start, end));
		},
		eventClick: function(calEvent, jsEvent) {

			if($('#event_popup').size()){
				$('#event_popup').remove();
			}
			$('body').prepend(calEvent.popup);
			$('#event_popup').modal('toggle');
		},
		loading: function(bool) {
			if (bool) $('#loading').show();
			else $('#loading').hide();
		},
		dayClick: function(date, allDay, jsEvent, view) {
			if (view.name !== 'agendaDay') {
				$('#calendar').fullCalendar('changeView', 'agendaDay').fullCalendar('gotoDate', date.getFullYear(), date.getMonth(), date.getDate());
			}
		}
	};

	// ID入力エリアの表示非表示
	$('#tab').on('click', function(){
		var header = $('#header');
		var margin = (header.css('margin-top') === '0px' ? 0-header.height()+5 : 0);
		header.animate({marginTop: margin}, 300);
	});

	// カレンダーの表示
	$('#calendar').fullCalendar(cal_option);

	// 見た目調整（集合ボタンをbtn-groupで囲いたい）
	$("#calendar .fc-header-left, #calendar .fc-header-right").each(function(){
		$(this).wrapInner('<div class="btn-group"></div>');
		var flag = false;
		$(this).find('.btn-group').children('span').each(function(){
			if(flag){
				$(this).parents('td').append($(this));
			}else{
				flag = $(this).hasClass('fc-corner-right') ? true : false;
			}
		});
	});

	// ID場所ヘルプの表示
	$('#where_id_link').on('click', function(){
		$('#where_id').toggle();
		return false;
	});

	// お気に入りに登録
	$('#bookmark').on('click', function(){
		var title = document.title;
		var url = location.href;
		if (window.sidebar) {
		    window.sidebar.addPanel(title, url,"");
		} else if( document.all ) {
		    window.external.AddFavorite( url, title);
		} else if( window.opera && window.print ) {
		    return true;
		}
	});

	// IDが入力されたらボタンを有効化/無効化
	var notEmpty = function(){ return this.value.length !== 0; };
	$('#first .item input:text').keyup(function(event) {
		// 入力があれば
		if($('#first .item :text').filter(notEmpty).length){
			$('#check').removeAttr('disabled');
		}else{
			$('#check').attr('disabled', 'disabled');
		}
	});

	// アカウントチェック
	$('#check').click(function(event) {
		$(this).after('<i class="fa fa-spinner fa-spin"></i>');
		var ids = {};
		$('#first .item :text').each(function() {
			ids[$(this).attr('id')] = $(this).val();
		});
		$.ajax({
			url: '/check_accounts.php',
			type: 'POST',
			dataType: 'json',
			data: {'ids':ids},
		})
		.done(function(res) {
			$('#check_result').text('checked!');
			for(key in res){
				if($('#first .item input#'+key).length){
					var icon = res[key] ? 'fa-check' : 'fa-times' ;
					$('#first .item input#'+key).next('i').addClass(icon);
				}
			}
			$('#view, #save').removeAttr('disabled');
		})
		.fail(function(res) {
			$('#check_result').text('sorry, check is failed...');
			$('#view, #save').attr('disabled','disabled');
		})
		.always(function(){
			$('#check').next('i').remove();
		});
	});

	// イベントを取得して表示
	$('#view').click(function(event) {
		$.ajax({
			url: '/get_events.php',
			type: 'POST',
			dataType: 'json',
			data: {param1: 'value1'},
		})
		.done(function(res) {
			alert(res.events);
		})
		.fail(function() {
			$('#tab').click();
		});
	});
	
	// IDの保存/削除
	$('#save').click(function(){
		$('#first .item :text').filter(notEmpty).each(function() {
			$.cookie($(this).attr('id'), $(this).val());
		});
		$(this).attr('id', 'unsave').removeClass('btn-success').addClass('btn-danger').text('delete ID setting');
	});
	$('#unsave').click(function(){
		$('#first .item :text').filter(notEmpty).each(function() {
			$.removeCookie($(this).attr('id'));
			$(this).val('');
		});
		$(this).attr('id', 'save').removeClass('btn-danger').addClass('btn-success').text('save ID setting');
	});

	// ID入力欄を回す
	// ・IDのCookieがあれば入力
	$('#first .item :text').each(function() {
		var id = $.cookie($(this).attr('id'));
		if(id) $(this).val(id);
	});
	$('#view').click();
	
});

var popup_date = function(date){
	if(typeof date !== 'Date') date = new Date(date);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var w = date.getDay();
	var h = date.getHours();
	var i = date.getMinutes();
	var week = ['日', '月', '火', '水', '木', '金', '土'];
	return y+'年'+m+'月'+d+'日（'+week[w]+'）'+h+':'+(('0'+i).slice(-2));
};
