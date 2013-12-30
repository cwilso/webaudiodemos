
// shim layer with setTimeout fallback
window.requestAnimationFrame = window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame;

function pushme() {
  pwmOsc.stop(0);
  //window.cancelAnimationFrame(rafID);
}
var rafID;
var myOscilloscope = null;

function draw() {  
  if (myOscilloscope)
    myOscilloscope.draw(myCanvas.myContext);

  rafID = requestAnimationFrame( draw );
}

function setupCanvas( container ) {
  var canvas = document.createElement( 'canvas' );
  canvas.width = 512; 
  canvas.height = 256; 
  canvas.myContext = canvas.getContext( '2d' );

  if (container)
    container.appendChild( canvas );
  else
    document.body.appendChild( canvas );
  return canvas;
}

function init(){
  myCanvas = setupCanvas();
  setupAudio( myCanvas );

  draw.bind(myCanvas)();
}

window.addEventListener("load", init );

function dutycyclechange() {
  pwmOsc.setDutyCycle(1-parseFloat(document.getElementById("dutycycle").value));
}
