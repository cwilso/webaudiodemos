function SoundEvent( e ) {
  this.pointerId = e.pointerId;
  this.x = e.clientX;
  this.y = e.clientY;
  this.initX = this.x;
  this.initY = this.y;
  this.playSound();
}

SoundEvent.prototype.setFilter = function() {
	var factor = 1.0 - ((this.y - this.initY) / (document.body.clientHeight - this.initY));

	if (factor < 0)
		factor = 0.0;
	if (factor > 1)
		factor = 1.0;
	var value = Math.pow(2, 13 * factor);
	this.filter.frequency.value = value;
	this.filter.Q.value = 40 * Math.min(1.0, Math.max(0.0, ((this.x - this.initX)/(document.body.clientWidth - this.initX))));
}

SoundEvent.prototype.playSound = function() {
	var sourceNode = audioContext.createBufferSource();
	sourceNode.buffer = technoBuffer;
	sourceNode.loop = true;
	this.filter = audioContext.createBiquadFilter();
	this.setFilter();

	sourceNode.connect( this.filter );
	this.filter.connect( audioContext.destination );
	sourceNode.start(0);
	this.sound = sourceNode;
}

SoundEvent.prototype.stopSound = function() {
	if (this.sound)
		this.sound.stop(0);
	this.sound = null;
}

function setupAudio() {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	audioContext = new AudioContext();

	var request = new XMLHttpRequest();
	request.open("GET", "sounds/techno.wav", true);
	request.responseType = "arraybuffer";
	request.onload = function() {
	  audioContext.decodeAudioData( request.response, function(buffer) { 
	    	technoBuffer = buffer;
	    	appendOutput( "Sound ready." );
		} );
	}
	request.send();
}