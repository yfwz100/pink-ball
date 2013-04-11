
(function () {
  "use strict"

  function makeClock(canvas) {
    if (!canvas || !canvas.getContext) return;
    if (!canvas.dataset.sec) canvas.dataset.sec = (new Date).getSeconds();
    if (canvas.dataset.sec>=60) canvas.dataset.sec = 1;

    var width = canvas.width, height = canvas.height;
    
    var ctx = canvas.getContext('2d');

    ctx.save();

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgb(200,200,200)';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;
    ctx.translate(width/2, height/2);
    ctx.rotate(Math.PI/2+Math.PI/30*canvas.dataset.sec++);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo((width>height?height/2:width/2)-10, 0);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(0,200,255)';
    ctx.beginPath();
    ctx.arc(0, 0, (width>height?height/2:width/2)-2, 0, Math.PI*2);
    ctx.stroke();

    ctx.fillStyle = 'rgb(140,140,140)';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();

    setTimeout(function () {
      makeClock(canvas);
    }, 1000);
  }

  function onload() {
    var clocks = document.querySelectorAll('[data-clock="yfwz100"]');
    for (var i=0; i<clocks.length; i++) {
      makeClock(clocks[i]);
    }
  }

  window.addEventListener('load', onload);
})();
