
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

function pushme() {
  pwmOsc.stop(0);
  //window.cancelAnimationFrame(rafID);
}
var rafID;

function draw() {
  var ctx = this.myContext;
  var data = new Uint8Array(512);
  this.analyser.getByteTimeDomainData(data);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;

  ctx.clearRect(0,0,512,256); 
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(512,0);
  ctx.stroke();
  ctx.moveTo(0,256);
  ctx.lineTo(512,256);
  ctx.stroke();
  ctx.save();
  ctx.strokeStyle = "#006644";
  ctx.beginPath();
  ctx.setLineDash([5]);
  ctx.moveTo(0,64);
  ctx.lineTo(512,64);
  ctx.stroke();
  ctx.moveTo(0,192);
  ctx.lineTo(512,192);
  ctx.stroke();

  ctx.restore();
  ctx.beginPath();
  ctx.strokeStyle = "blue";
  ctx.moveTo(0,128);
  ctx.lineTo(512,128);
  ctx.stroke();

  ctx.strokeStyle = "white";

  ctx.beginPath();
  ctx.moveTo(0,256-data[0]);

  var zeroCross = findFirstPositiveZeroCrossing(data, 512);
  if (zeroCross==0)
    zeroCross=1;
 
  for (var i=zeroCross, j=0; j<(512-zeroCross); i++, j++)
    ctx.lineTo(j,256-data[i]);

  ctx.stroke();
  rafID = requestAnimFrame( draw.bind(this) );
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

var MINVAL = 134;  // 128 == zero.  MINVAL is the "minimum detected signal" level.

function findFirstPositiveZeroCrossing(buf, buflen) {
  var i = 0;
  var last_zero = -1;
  var t;

  // advance until we're zero or negative
  while (i<buflen && (buf[i] > 128 ) )
    i++;

  if (i>=buflen)
    return 0;

  // advance until we're above MINVAL, keeping track of last zero.
  while (i<buflen && ((t=buf[i]) < MINVAL )) {
    if (t >= 128) {
      if (last_zero == -1)
        last_zero = i;
    } else
      last_zero = -1;
    i++;
  }

  // we may have jumped over MINVAL in one sample.
  if (last_zero == -1)
    last_zero = i;

  if (i==buflen)  // We didn't find any positive zero crossings
    return 0;

  // The first sample might be a zero.  If so, return it.
  if (last_zero == 0)
    return 0;

  return last_zero;
}

function dutycyclechange() {
  pwmOsc.setDutyCycle(parseFloat(document.getElementById("dutycycle").value));
}
