var audioContext = null;
var myBuffer = null;

var osc = null;
function setDutyCycle(amt) {
	this.delay.delayTime.value = amt/this.frequency;	
	this.dcGain.gain.value = 1.7*(0.5-amt);
}
function start(time) {
	this.osc1.start(time);
	this.osc2.start(time);
	this.dcOffset.start(time);
}
function stop(time) {
	this.osc1.stop(time);
	this.osc2.stop(time);
	this.dcOffset.stop(time);
}

function createDCOffset() {
	var buffer=audioContext.createBuffer(1,1,audioContext.sampleRate);
	var data = buffer.getChannelData(0);
	for (var i=0; i<1; i++)
		data[i]=1;
	var bufferSource=audioContext.createBufferSource();
	bufferSource.buffer=buffer;
	bufferSource.loop=true;
	return bufferSource;
}

function createPWMOsc(freq, dutyCycle) {
	var pwm = new Object();
	var osc1 = audioContext.createOscillator();
	var osc2 = audioContext.createOscillator();
	var inverter = audioContext.createGain();
	var output = audioContext.createGain();
	var delay = audioContext.createDelay();
	inverter.gain.value=-1;
	osc1.type="sawtooth";
	osc2.type="sawtooth";
	osc1.frequency.value=freq;
	osc1.frequency.value=freq;
	osc1.connect(output);
	osc2.connect(inverter);
	inverter.connect(delay);
	delay.connect(output);
	var dcOffset = createDCOffset();
	var dcGain = audioContext.createGain();
	dcOffset.connect(dcGain);
	dcGain.connect(output);

	output.gain.value = 0.5;  // purely for debugging.

	pwm.osc1=osc1;
	pwm.osc2=osc2;
	pwm.output=output;
	pwm.delay=delay;
	pwm.frequency = freq;
	pwm.dcGain=dcGain;
	pwm.dcOffset=dcOffset;
	pwm.setDutyCycle = setDutyCycle;
	pwm.start=start;
	pwm.stop=stop;

	pwm.setDutyCycle(dutyCycle);
	return pwm;
}

var pwmOsc;

function setupAudio( obj ) {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	audioContext = new AudioContext();

	obj.analyser = audioContext.createAnalyser();
	obj.analyser.fftSize = 2048;

	myOscilloscope = new Oscilloscope(obj.analyser, 512, 256);

/*
	osc = audioContext.createOscillator();
	osc.type = "sawtooth";
	*/

	pwmOsc=createPWMOsc(440,.5);

	pwmOsc.output.connect(audioContext.destination);
	pwmOsc.output.connect(obj.analyser);
	pwmOsc.start(audioContext.currentTime+0.05);

/*
	var request = new XMLHttpRequest();
	request.open("GET", "sounds/techno.wav", true);
	request.responseType = "arraybuffer";
	request.onload = function() {
	  audioContext.decodeAudioData( request.response, function(buffer) { 
	    	myBuffer = buffer;
	    	appendOutput( "Sound ready." );
		} );
	}
	request.send();
*/

}