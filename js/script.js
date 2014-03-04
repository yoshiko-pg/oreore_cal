$(function(){

	var get_ids = function(){
		var ids = {};
		$('#first .item :text').each(function() {
			ids[$(this).attr('id')] = $(this).val();
		});
		return ids;		
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
		viewDisplay: function(view) {
			var ids = get_ids();
			$.ajax({
				url: "get_events.php",
				dataType: 'json',
				type: "post",
				data: {
					"start": view.start.toString(),
					"end": view.end.toString(),
					"ids": ids
				},
				success: function(EventSource) {
					$('#calendar').fullCalendar('removeEvents');
					$('#calendar').fullCalendar('addEventSource', EventSource);
				}
			});
		},
		loading: function(bool) {
			if (bool) $('#loading').show();
			else $('#loading').hide();
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
