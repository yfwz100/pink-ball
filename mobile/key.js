// 
// Continuous Key Press
//

(function () {
  "use strict"

  var doc = document;

  var keypress = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
  };

  window.key = keypress;

  function onLoad() {
    var keymap = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      32: 'space'
    };

    window.addEventListener('keydown', function (event) {
      keypress[keymap[event.keyCode]] = true;
    });
    window.addEventListener('keyup', function (event) {
      keypress[keymap[event.keyCode]] = false;
    });

  };

  window.onload = window.onload ? (function (func) {
    return function () {
      func();
      onLoad();
    };
  })(window.onload) : onLoad;

  function enableTouchPad(elem) {
    if (! elem.getContext) return;

    var touched = false;
    var startPos = {x: 0, y: 0};

    elem.draw = function (ctx) {
      if (touched) {
        ctx.save();
        ctx.fillStyle = 'rgba(200,200,200,0.6)';
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, 50, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    elem.addEventListener('touchstart', function (event) {
      var touches = event.touches;
      var tpos = touches.item(0);
      startPos.x = tpos.clientX;
      startPos.y = tpos.clientY;

      touched = true;
    });

    elem.addEventListener('touchmove', function (event) {
      var touches = event.changedTouches;
      var tpos = touches.item(0);
      var dx = tpos.clientX - startPos.x;
      var dy = tpos.clientY - startPos.y;

      var d = Math.sqrt(dx*dx, dy*dy);

      if (dx > 20) {
        keypress.right = true;
      } else if (dx < -20) {
        keypress.left = true;
      } else {
        keypress.left = keypress.right = false;
      }

      if (dy > 20) {
        keypress.down = true;
      } else if (dy < -20) {
        keypress.up = true;
      } else {
        keypress.up = keypress.down = false;
      }
    });

    elem.addEventListener('touchend', function (event) {
      keypress.up = keypress.down = keypress.left = keypress.right = 0;
      touched = false;
    });
  }

  window.enableTouchPad = enableTouchPad;

}).call(this);

