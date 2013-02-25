// JavaScript

(function () {
  "use strict"

  function getTop(e) {
    var offset = e.offsetTop;
    if (e.offsetParent != null) offset += getTop(e.offsetParent);
    return offset;
  };

  function getLeft(e) {
    var offset = e.offsetLeft;
    if (e.offsetParent != null) offset += getLeft(e.offsetParent);
    return offset;
  };

  function makeSelectableImpl(elem) {
    document.addEventListener('click', function (event) {
      var dx = event.clientX - getLeft(elem);
      var dy = event.clientY - getTop(elem);
      if (dx > 0 && dx < elem.offsetWidth && dy > 0 && dy < elem.offsetHeight) {
        elem.dataset.selected = true;
      }
    });
  }

  function makeSelectable(e) {
    if (typeof e == 'string') {
      var elems = document.querySelectorAll(e);
      for (var i=0; i<elems.length; i++) {
        makeSelectableImpl(elems[i]);
      }
    } else {
      makeSelectableImpl(e);
    }
  }

  window.makeSelectable = makeSelectable;

  function onLoad() {
    makeSelectable('[data-selectable="true"]');
  };

  window.onload = window.onload ? (function (func) {
    return function () {
      func();
      onLoad();
    };
  })(window.onload) : onLoad;


}).call(this);
