
// shim layer with setTimeout fallback
window.requestAnimationFrame = window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame;

function pushme() {
  pwmOsc.stop(0);
  //window.cancelAnimationFrame(rafID);
}
var rafID;
var myOscilloscope = null;
var scopeCanvas = null;
var freqCanvas = null;

function drawFreqBars(analyser,context){
  var SPACING = 3;
  var BAR_WIDTH = 1;
  var canvasWidth = 1024;
  var canvasHeight = 256;
  var numBars = Math.round(canvasWidth / SPACING);
  var freqByteData = new Uint8Array(analyser.frequencyBinCount);

  analyser.getByteFrequencyData(freqByteData); 

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.lineCap = 'round';
  var multiplier = analyser.frequencyBinCount / numBars;

  // Draw rectangle for each frequency bin.
  for (var i = 0; i < numBars; ++i) {
    var magnitude = 0;
    var offset = Math.floor( i * multiplier );
    // gotta sum/average the block, or we miss narrow-bandwidth spikes
    for (var j = 0; j< multiplier; j++)
      magnitude += freqByteData[offset + j];
    magnitude = magnitude / multiplier;
    var magnitude2 = freqByteData[i * multiplier];
    context.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
    context.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
  }
}

function draw() {  
  if (myOscilloscope) {
    myOscilloscope.draw(scopeCanvas.myContext);
    if (freqCanvas)
      drawFreqBars(myOscilloscope.analyser,freqCanvas.context);
  }

  rafID = requestAnimationFrame( draw );
}

function setupCanvases( container ) {
  scopeCanvas = document.createElement( 'canvas' );
  scopeCanvas.width = 512; 
  scopeCanvas.height = 256; 
  scopeCanvas.id = "scope";
  scopeCanvas.myContext = scopeCanvas.getContext( '2d' );

  if (container)
    container.appendChild( scopeCanvas );
  else
    document.body.appendChild( scopeCanvas );

  freqCanvas = document.createElement( 'canvas' );
  freqCanvas.width = 1024; 
  freqCanvas.height = 256; 
  freqCanvas.id = "freqbars";
  freqCanvas.context = freqCanvas.getContext( '2d' );

  if (container)
    container.appendChild( freqCanvas );
  else
    document.body.appendChild( freqCanvas );
}

function init(){
  setupCanvases();
  setupAudio( scopeCanvas );

  draw();
}

window.addEventListener("load", init );

function dutycyclechange() {
  pwmOsc.setDutyCycle(1-parseFloat(document.getElementById("dutycycle").value));
}
