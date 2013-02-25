// 
// Continuous Key Press
//

(function () {

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

}).call(this);

