(function () {
  "use strict"

  var doc = document;

  function center(elem) {
    var currentStyle = doc.defaultView.getComputedStyle(elem, null);
    elem.style.marginLeft = elem.style.marginRight = 'auto';
    var w = parseInt(currentStyle.width), h = parseInt(currentStyle.height);
    if (h < window.innerHeight) {
      elem.style.top = window.innerHeight / 2 - h / 2 + 'px';
    } else {
      elem.style.top = '0px';
    }
    if (currentStyle.position == 'absolute') {
      if (w < window.innerWidth) {
        elem.style.left = window.innerWidth / 2 - w / 2 + 'px';
      } else {
        elem.style.left = '0px';
      }
    }
  }

  function onResize() {
    var elems = document.querySelectorAll('[data-center="true"]');
    for (var i=0; i<elems.length; i++) {
      center(elems[i]);
    }
  }

  function onLoad() {
    window.onresize = window.onresize ? (function (func) {
      return function () {
        func();
        onResize();
      };
    })(window.onresize) : onResize;
    onResize();
  }

  window.onload = window.onload ? (function (func) {
    return function () {
      func();
      onLoad();
    };
  })(window.onload) : onLoad;

  window.centerelement = center;
}).call(this);
