/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var make3Packets = function() {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var button = document.getElementById('play3packs');
  var pack = [{}, {}, {}];
  var playing = false;

  // Mono
  var channels = 1;
  // Create a two second buffer at the
  // sample rate of the AudioContext
  var duration = 2;
  var frameCount = audioCtx.sampleRate * duration;
  var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);

  var allBlocks = document.getElementsByClassName("allBlocks")[0];

  var playPacks = function() {
    if (playing) return;
    playing = true;
    // Fill the buffer with values between -1.0 and 1.0
    for (var channel = 0; channel < channels; channel++) {
      // This gives us the actual ArrayBuffer that contains the data
      var nowBuffering = myArrayBuffer.getChannelData(channel);
      pack[0].freq = 2 * Math.PI / audioCtx.sampleRate * (1200 + 5200 * Math.random());
      pack[0].shift = audioCtx.sampleRate * .5;
      pack[0].span = 1/audioCtx.sampleRate * Math.random();

      pack[1].freq = 2 * Math.PI / audioCtx.sampleRate * (200 + 15200 * Math.random());
      pack[1].shift = audioCtx.sampleRate * (1.2 + 0.6 * Math.random());
      pack[1].span = 1/audioCtx.sampleRate * Math.random();

      pack[2].freq = pack[0].freq;
      pack[2].shift = audioCtx.sampleRate * 1.5;
      pack[2].span = pack[0].span;

      for (var i = 0; i < frameCount; i++) {
        var sample = 0;
        for (var j = 0; j < pack.length; j++) {
          sample += Math.sin(pack[j].freq * i) * Math.exp(-pack[j].span * Math.pow(i - pack[j].shift, 2))/2
        }
        nowBuffering[i] = sample;
      }
    }

    var source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.start();
    source.onended = function() {
      playing = false;
    }
  }
  button.onclick = playPacks;
  allBlocks.addEventListener('click', playPacks, false); 
}
 
var drawPacket = function () {
  //Writes a wave packet

  //if (typeof(WavePacket) == 'undefined') window.WavePacket = {};
  if (typeof(WavePacket) == 'undefined') WavePacket = {};
  WavePacket.Trig = {};
  WavePacket.Trig.init = init;

  var unit = 100,
      canvas, context, canvas2, context2,
      height, width, xAxis, yAxis,
      draw;

  /**
   * Init function.
   * 
   * Initialize variables and begin the animation.
   */
  function init() {

      canvas = document.getElementById("sineCanvas");

      canvas.width = 800;
      canvas.height = 300;

      context = canvas.getContext("2d");
      context.font = '18px sans-serif';
      context.strokeStyle = '#00f';
      context.lineJoin = 'round';

      height = canvas.height;
      width = canvas.width;

      xAxis = Math.floor(height/2);
      yAxis = Math.floor(width/4);

      context.save();
      draw();
  }

  /**
   * Draw animation function.
   * 
   * This function draws one frame of the animation, waits 20ms, and then calls
   * itself again.
   */
  draw = function () {

      // Clear the canvas
      context.clearRect(0, 0, width, height);

      context.beginPath();
      context.stroke();

      // Set styles for animated graphics
      context.save();
      context.strokeStyle = '#fff';
      context.fillStyle = '#fff';
      context.lineWidth = 2;

      // Draw the sine curve at time draw.t, as well as the circle.
      context.beginPath();
      drawSine(draw.t);
      context.stroke();

      // Restore original styles
      context.restore();

  };
  draw.t = 0;


  /**
   * Function to draw sine
   * 
   * The sine curve is drawn in 10px segments starting at the origin. 
   */
  function drawSine(t) {

      // Set the initial x and y, starting at 0,0 and translating to the origin on
      // the canvas.
      var x = t;
      var y = Math.sin(x);
      context.moveTo(yAxis, unit*y+xAxis);

      // Loop to draw segments
      for (i = yAxis; i <= width; i += 1) {
          x = t+(-yAxis+i)/unit;
          y = Math.sin(15*x)*Math.exp(-Math.pow(x-Math.PI,2));
          context.lineTo(i, unit*y+xAxis);
      }
  }
  WavePacket.Trig.init()    
};

