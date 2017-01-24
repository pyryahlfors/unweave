fpAudio = {
	support: false,
	soundBanks : {},

	init: {},
	
	loadAudio: function(soundBank, sound, url, vol){
		var audio = new Audio();
		audio.src = url;
		audio.preload = "auto";
		audio.volume = vol;

		if(!fpAudio.soundBanks[soundBank]) {fpAudio.soundBanks[soundBank] = {};};
		fpAudio.soundBanks[soundBank][sound] = audio;

		audio.addEventListener("loadeddata", function(){
			fpAudio.soundBanks[soundBank][sound] = audio;
			fpAudio.soundBanks[soundBank][sound].channel = 0;
			fpAudio.soundBanks[soundBank][sound].channels = [];
			for( var i = 0; i <8; i++ ) {
				fpAudio.soundBanks[soundBank][sound].channels.push(audio.cloneNode(true) );
				};
			}, false);
		},
		
	playAudio: function(audioDetails){
		var soundBank = audioDetails.soundbank,
			sound = audioDetails.fx;
		if(!fpAudio.soundBanks[audioDetails.soundbank]) return;

		var channel = fpAudio.soundBanks[soundBank][sound].channel;
		channel+=1;
		if(channel >= 7) {channel = 0};
		fpAudio.soundBanks[soundBank][sound].channel = channel;
		fpAudio.soundBanks[soundBank][sound].channels[channel].pause();
		fpAudio.soundBanks[soundBank][sound].channels[channel].currentTime = 0;
		fpAudio.soundBanks[soundBank][sound].channels[channel].play();
		}
	};


(function(){
	var myAudio = document.createElement('audio'); 
    if (myAudio.canPlayType) {
		this.support = (function(){
			if(!!myAudio.canPlayType && "" != myAudio.canPlayType('audio/mpeg')){
				return 'mp3';
			}
			if(!!myAudio.canPlayType && "" != myAudio.canPlayType('audio/ogg; codecs="vorbis"')){
				return 'ogg';
				}
		})();
		}
	}).call(fpAudio);

document.addEventListener('playsound', function(e){
	fpAudio.playAudio(e.detail);
	}, false);
	
