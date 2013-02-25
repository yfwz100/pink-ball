// JavaScript

(function () {
  "use strict"

  function onLoad() {
    document.addEventListener('click', function (event) {
      var elems = document.querySelectorAll('[data-selectable="true"]');
      for (var i=0; i<elems.length; i++) {
        elems[i].dataset.selected = false;
      }
      var target = event.target || {parent:null,dataset:{selectable:false}};
      do {
        if (target.dataset && target.dataset.selectable == "true") {
          target.dataset.selected = "true";
        }
      } while ((target=target.parentNode) != null);
    });
  };

  window.onload = window.onload ? (function (func) {
    return function () {
      func();
      onLoad();
    };
  })(window.onload) : onLoad;


}).call(this);
