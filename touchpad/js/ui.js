
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

var canvas,
  c, // c is the canvas' context 2D
  container;
var touches = [];

function resetCanvas (e) {
  // resize the canvas - but remember - this clears the canvas too.
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  //make sure we scroll to the top left.
  window.scrollTo(0,0); 
}

function draw() {
  c.clearRect(0,0,canvas.width, canvas.height); 
  for (var j=0; j<4; j++) {
    for (var i=0; i<4; i++) {
      c.fillStyle = "hsl( " + Math.round((360*(j*4+i))/16) + ", 100%, 50%)";
      c.fillRect( canvas.width * i / 4, canvas.height * j / 4, canvas.width/4, canvas.height/4 );
    }
  }
  for(var i=0; i<touches.length; i++)
  {
    var touch = touches[i]; 
    c.beginPath(); 
    c.fillStyle = "white";
    c.fillText( " id : "+touch.pointerId+" x:"+touch.x+" y:"+touch.y, touch.x+30, touch.y-30); 

    c.beginPath(); 
    c.strokeStyle = "cyan";
    c.lineWidth = "6";
    c.arc(touch.x, touch.y, 40, 0, Math.PI*2, true); 
    c.stroke();
  }
  //c.fillText("hello", 0,0); 

  requestAnimFrame(draw);
}

function onPointerDown(e) {
//  e.preventDefault();
  appendOutput(e.type + ' [' + e.pointerId + '] ' + e.clientX + ", " + e.clientY );

  for (var i=0; i<touches.length; i++) {
    if (touches[i].pointerId == e.pointerId) {
      touches[i].stopSound();
      touches.splice(i, 1);
    }
  }

  touches.push( new SoundEvent( e ) );

}

function onPointerMove(e) {
  // Prevent the browser from doing its default thing (scroll, zoom)
  e.preventDefault();

  for (var i=0; i<touches.length; i++) {
    if (touches[i].pointerId == e.pointerId) {
      appendOutput(e.type + ' [' + e.pointerId + '] ' + e.clientX + ", " + e.clientY );
      touches[i].x = e.clientX;
      touches[i].y = e.clientY;
      touches[i].setFilter();
      return;      
    }
  }
} 

function onPointerUp(e) { 
  // Prevent the browser from doing its default thing (scroll, zoom)
//  e.preventDefault();

  appendOutput(e.type + ' [' + e.pointerId + '] ' + e.clientX + ", " + e.clientY );

  for (var i=0; i<touches.length; i++) {
    if (touches[i].pointerId == e.pointerId) {
      touches[i].stopSound();
      touches.splice(i, 1);
      return;      
    }
  }
}


function setupCanvas() {

  canvas = document.createElement( 'canvas' );
  c = canvas.getContext( '2d' );
  container = document.createElement( 'div' );
  container.className = "container";

  canvas.width = window.innerWidth; 
  canvas.height = window.innerHeight; 
  document.body.appendChild( container );
  container.appendChild(canvas);	

  canvas.setAttribute("touch-action","none");
  c.strokeStyle = "#ffffff";
  c.lineWidth =2;
  canvas.addEventListener( 'down', onPointerDown, false );

  PolymerGestures.addEventListener(canvas, "track", onPointerMove);

  canvas.addEventListener( 'track', onPointerMove, false );
//  canvas.addEventListener( 'mousemove', onPointerMove, false );
  canvas.addEventListener( 'up', onPointerUp, false );
//  canvas.addEventListener( 'pointerleave', onPointerUp, false );

}

function init(){
  setupCanvas();
  setupAudio();

  window.onorientationchange = resetCanvas;
  window.onresize = resetCanvas;

  requestAnimFrame(draw);
}

window.addEventListener("load", init );
