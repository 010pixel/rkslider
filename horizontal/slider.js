(function ($) {
	
	var opts = {},
		docWidth,
		sliderWidth,
		elements,
		totalElements,
		currentElement,
		rotation,
		free = true,
		paused = false,
		index = 0,
		
		_set_config = function () {
			opts = $.extend($.fn.rkslides.defaults, opts);
		},
		
		_set_free = function () {free = true;},
		_set_busy = function () {free = false;},
		_is_busy = function () {return !free;},
		_get_id_class_name = function (x) {
			return x.replace(/\#/g, '').replace(/\./g, '');
		},

		_set_defaults = function () {
			docWidth = $(document).width();
			sliderWidth = $(opts.slider).width();
			// console.log('Doc width: ' + docWidth);
			// console.log('Slider width: ' + sliderWidth);
		},
		
		_init = function () {
				elements = $(opts.slideContainer).children();
				totalElements = elements.size();				
				if ( totalElements > 1 ) {
					if (opts.paging == true) { _paging(); }
					if (opts.auto == true) { _cycle_slides(); }
					if (opts.pause == true) { _hover_slides(); }
				}
			},
		
		/*
		_set_offset = function () {
				elements.each(function(){
					var leftOffset = $(this).offset().left;
					$(this).attr({'left-offset':leftOffset});
				});
			}
		*/
		
		_set_basic_events = function () {
				$(document).ready(function() {
					_set_defaults();
					// _set_offset();
					_goto_slide(0);
				});
				$(window).resize(function() {
					_set_defaults();
					// _set_offset();
				});
				// Go to slide when clicked an element
				elements.click(function(){
					_goto_slide($(this).index());
				});
				// Previous Next functions keyboard support
				if (opts.prevNext == true) {
					if (opts.keyboardSupport == true) {
						$('body').bind('keydown', function (e) {
							if (e.keyCode == 37) { // left
								$.rkslides.prev();
							} else if (e.keyCode == 39) { // right
								$.rkslides.next();
							}
						});
					}
					$(opts.controllers +' '+ opts.btnPrev).click(function(){
						$.rkslides.prev();
					});
					$(opts.controllers +' '+ opts.btnNext).click(function(){
						$.rkslides.next();
					});
				}
				// Play Pause Stop functions
				if (opts.pause == true) {
					$(opts.controllers +' '+ opts.btnPlay).click(function(){
						$.rkslides.play();
					});
					$(opts.controllers +' '+ opts.btnPause).click(function(){
						$.rkslides.pause();
					});
					$(opts.controllers +' '+ opts.btnStop).click(function(){
						$.rkslides.stop();
					});
				}
			},
		
		_get_current_element = function () {
			return currentElement;
		},
		
		_clear_interval = function () {
			clearInterval(rotation);
		},
		
		_cycle_slides = function () {
			rotation = setInterval(_run_slides, opts.timeout);
		},
		
		_run_slides = function () {
			if ( paused ) return false;
		
			elements.stop(true, true);
			
			var idx = index + 1 < totalElements ? index + 1 : 0;
			// console.log(idx);
			
			var thisSlide = elements.eq(idx);						
			_goto_slide(idx); 
		},
		
		_hover_slides = function () {
			$(opts.slideContainer).children().hover(function () {
				// if ( _is_busy() ) { return; }
				// console.log("enter");
				if ($(this).hasClass("active")) {
					_set_busy();
				}
			}, function () {
				// if ( _is_busy() ) { return; }
				// console.log("leave");
				if ($(this).hasClass("active")) {
					_set_free();
				}
			});
		},
		
		_play_slides = function () {
			// console.log("started");
			_change_pause(false);
			_cycle_slides();
		},
		
		_pause_slides = function () {
			// console.log("paused");
			_change_pause(true);
			_clear_interval();
		},
		
		_stop_slides = function () {
			// console.log("stopped");
			_change_pause(true);
			if ( index != 0 ) _goto_slide(0);
			_clear_interval();
		},
		
		_goto_slide = function (idx) {
				
				if ( _is_busy() ) { return; }
				_set_busy();
				
				var thisSlide = elements.eq(idx);						
				var sliderLeftOffset = (docWidth - sliderWidth)/2;
				var leftOffset = $(thisSlide).attr('left-offset');
				var appliedLeftOffset = parseInt(leftOffset) - parseInt(sliderLeftOffset);
				var appliedLeftOffset = idx * sliderWidth;
				
				// var currItemWidth = thisSlide.width();
				// console.log('Slider Left Offset: ' + sliderLeftOffset); console.log('Item width: ' + currItemWidth); console.log('Left Offset: ' + leftOffset); console.log('Applied Left Offset: ' + appliedLeftOffset);
				
				currentElement = thisSlide;
				
				elements.removeClass('active');
				$(thisSlide).addClass('active').parent().animate({'margin-left':'-'+ appliedLeftOffset +'px'}, opts.speed, function() {
					index = $(thisSlide).index();
					_set_free();
					// console.log(opts.timeout);
				});
				
				_run_function(opts.afterSlideChange);
			},
		
		_activate_slide = function (thisSlide) {
				if ( thisSlide == undefined ) {
					thisSlide = elements.eq(0);
				}
				elements.removeClass('active');
				$(thisSlide).addClass('active');
			},
		
		_prev_next = function (direction) {
				if (opts.prevNext == false) return false;
				var idx = 0;
				if ( direction == "prev" ) {
					idx = index - 1 >= 0 ? index - 1 : totalElements - 1;
				} else {
					idx = index + 1 < totalElements ? index + 1 : 0;
				}
				_clear_interval();
				_cycle_slides();
				_goto_slide(idx);
			},
		
		_run_function = function (func) {
				if ( func ) func();
			},
		
		_change_pause = function (status) {
				paused = status;
				// console.log(paused);
			}

		_paging = function () {
			
			var content = '';
			
			elements.each(function(index){
				var n = index + 1;
				content += '<li class="' + _get_id_class_name(opts.pagingPage) + '"><a href="#">' + n + '</a></li>';
			});
			
			var paging = $("<ul class='" + _get_id_class_name(opts.pagingList) + "' />");
			
			paging.append(content);
			
			if (opts.controllers) {
				$(opts.controllers).append(paging);
			} else {
				$(opts.slider).after(paging);
			}
			
			// $(opts.pagingList).find("li").css({'height':((containerHeight/totalElements)-2)+'px'});
			
			$(opts.pagingList).find("li").stop().bind('click',function(){
				var idx = $(this).index();
				// If clicked slide number is current slide then do not do anything
				if ( index == idx ) {return;}
				// additionalWaitTime = parseFloat(opts.userClickTimeout);
				_set_free();
				_clear_interval();
				_cycle_slides();
				_goto_slide(idx);
				// setTimeout(function(){_cycle_slides();},additionalWaitTime);
			});
		}
		;
	
	
	$.fn.rkslides = function (options) {
        opts = options;
        $.rkslides.init();
    };

    $.rkslides = function (options) {
			$.fn.rkslides(options);
		};
		
	$.rkslides.init = function () {
			_set_config();
			_init();
			_set_basic_events();
		};
		
	$.rkslides.prev = function () {
			_prev_next("prev");
			_run_function(opts.afterPrev);
		};
	
	$.rkslides.next = function () {
			_prev_next("next");
			_run_function(opts.afterNext);
		};
		
	$.rkslides.play = function () {
			if ( !paused ) return;
			_play_slides();
			_run_function(opts.afterPlay);
		};
	
	$.rkslides.pause = function () {
			if ( paused ) return;
 			_pause_slides();
			_run_function(opts.afterPause);
		};
	
	$.rkslides.stop = function () {
			_stop_slides();
			_run_function(opts.afterStop);
		};

	$.rkslides.is_paused = function () {
			return paused;
		};
	
	$.rkslides.change_pause = function (status) {
			_change_pause(status);
		};
	
	$.rkslides.set_busy = function () {
			_set_busy();
		};
	
	$.rkslides.set_free = function () {
			_set_free();
		};

	$.fn.rkslides.defaults = {
			slide:'.div',
			slider:'.myslider',
			slideContainer:'.container',
			controllers:'',
			visibleClass:"active",
			pagingList:'.thumbList',
			pagingPage:'.thumb',

			paging:true,
			pause:true,
			prevNext:true,
			keyboardSupport:false,
			btnPrev:'.btn-prev',
			btnNext:'.btn-next',
			btnPlay:'.btn-play',
			btnPause:'.btn-pause',
			btnStop:'.btn-stop',

			afterPrev:false,
			afterNext:false,
			afterPlay:false,
			afterPause:false,
			afterStop:false,
			afterSlideChange:false,

			auto:true,
			speed: 300,
			timeout: 2000,
			userClickTimeout: 10000,
			maxWidth:''
		};
})(jQuery);