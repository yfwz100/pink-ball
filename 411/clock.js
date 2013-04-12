
(function () {
  "use strict"

  function makeClock(canvas) {
    if (!canvas || !canvas.getContext) return;

    var width = canvas.width, height = canvas.height;
    
    var ctx = canvas.getContext('2d');
    var now = new Date;

    ctx.clearRect(0, 0, width, height);

    var maxRadius = width < height ? width/2 : height/2;
    var margin = maxRadius > 60 ? 30 : width / 10;

    ctx.save();
    ctx.drawImage(canvas.bg, 0, 0);
    ctx.restore();

    ctx.save();
    
    ctx.strokeStyle = 'rgb(200,200,200)';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;
    ctx.translate(width/2, height/2);
    ctx.rotate(-Math.PI/2+Math.PI/6*(now.getHours()%12));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(maxRadius-margin, 0);
    ctx.stroke();

    ctx.restore();
    ctx.save();

    ctx.strokeStyle = 'rgb(200,200,200)';
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    ctx.translate(width/2, height/2);
    ctx.rotate(-Math.PI/2+Math.PI/30*now.getMinutes());
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(maxRadius-margin*0.66, 0);
    ctx.stroke();

    ctx.restore();
    ctx.save();

    ctx.strokeStyle = 'rgb(200,200,200)';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.translate(width/2, height/2);
    ctx.rotate(-Math.PI/2+Math.PI/30*now.getSeconds());
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(maxRadius-margin*0.33, 0);
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
      clocks[i].bg = document.createElement('canvas');
      var width = clocks[i].bg.width = clocks[i].width;
      var height = clocks[i].bg.height = clocks[i].height;
      var ctx = clocks[i].bg.getContext('2d');
      ctx.save();
      ctx.clearRect(0, 0, clocks[i].width, clocks[i].height);
      ctx.translate(width/2, height/2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0,200,255)';
      var grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, 'white');
      grd.addColorStop(1, '#efefef');
      ctx.fillStyle = grd;
      ctx.shadowBlur = 2;
      ctx.shadowColor = '#ccc';
      ctx.beginPath();
      ctx.arc(0, 0, (width>height?height/2:width/2)-2, 0, Math.PI*2);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
      makeClock(clocks[i]);
    }
  }

  window.addEventListener('load', onload);
})();
