var player;

$(function() {
	$.rkslides({
			'afterSlideChange':funcAfterSlideChange,
		});
});

function funcAfterSlideChange () {
	$.rkslides.set_free();
	if ( !$.rkslides.is_paused() ) {
		$.rkslides.play();
	}
	if (!player) return;
    player.pauseVideo();
}

function onYouTubePlayerAPIReady() {
  // create the global player from the specific iframe (#video)
  player = new YT.Player('video', {
    events: {
      // call this function when player is ready to use
	  'onStateChange':onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
	console.log(event.data);
	if ( event.data != -1 ) {
		$.rkslides.set_busy();
		$.rkslides.pause();
	}
}

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "//www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/*
function funcAfterSlideChange () {
}

var params = { allowScriptAccess: "always" };
var atts = { id: "myytplayer" };
swfobject.embedSWF("http://www.youtube.com/v/lHbWRFpbma4?enablejsapi=1&playerapiid=ytplayer&version=3",
				   "ytapiplayer", "1000", "562.5", "8", null, null, params, atts);
function onYouTubePlayerReady(playerId) {
  ytplayer = document.getElementById("myytplayer");
  ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
  $("div").click(function(){
	  ytplayer.pauseVideo();
	  $.rkslides.set_free();
	$.rkslides.change_pause(false);
  });
}

function onytplayerStateChange(newState) {
	console.log('state '+newState);
	if ( newState != -1 ) {
		$.rkslides.pause();
		$.rkslides.set_busy();
	}
}
*/
