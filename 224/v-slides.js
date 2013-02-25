// JavaScript

(function(globals) {
  "use strict"

  var doc = document;

  function doSlidesElement(elem) {
    var container = document.createElement('div');
    container.style.marginTop = 0;
    container.className = 'slides_container';
    container.innerHTML = elem.innerHTML;
    elem.innerHTML = '';
    elem.appendChild(container);

    var currentStyle = document.defaultView.getComputedStyle(elem, null);
    var height = parseInt(currentStyle.height);

    var slides = [];
    for (var i=0; i<container.childNodes.length; i++) {
      var child = container.childNodes[i];
      if (child.className == 'slide') {
        slides.push(container.childNodes[i]);
        child.style.overflow = 'auto';
      }
    }

    var i = 0; // the current index of slide.

    elem.nextSlide = function () {
      if (i < (slides.length - 1)) {
        var old = parseInt(container.style.marginTop);
        container.style.marginTop = old - height + 'px';
        if (slides[i].onslideleave) {
          slides[i].onslideleave();
        }
        i ++;
        if (slides[i].onslide) {
          slides[i].onslide();
        }
      }
    };

    elem.prevSlide = function () {
      if (i > 0) {
        var old = parseInt(container.style.marginTop);
        container.style.marginTop = old + height + 'px';
        if (slides[i].onslideleave) {
          slides[i].onslideleave();
        }
        i --;
        if (slides[i].onslide) {
          slides[i].onslide();
        }
      }
    };

    if (elem.dataset.selectable) {
      window.addEventListener('keyup', function (event) {
        if (elem.dataset && 
            (elem.dataset.selected == "false" || !elem.dataset.selected)) {
          return;
        }
        var key = event.keyCode;
        switch (event.keyCode) {
          case 33:
            elem.prevSlide();
            break;
          case 34:
            elem.nextSlide();
            break;
        }
      });
    }

    elem.addEventListener('click', function (event) {
      switch (event.target.dataset['slide']) {
        case 'next':
          elem.nextSlide();
          break;
        case 'prev':
          elem.prevSlide();
          break;
      }
      event.preventDefault();
    });
  };

  function doSlides(sel) {
    if (typeof sel == 'string') {
      var containers = doc.querySelectorAll(sel);
      for(var i=0; i<containers.length; i++) {
        doSlidesElement(containers[i]);
      }
    } else {
      doSlidesElement(sel);
    }
  }

  globals.doSlides = doSlides;

  function onLoad() {
    doSlides('.slides');
  };

  window.onload = window.onload ? (function (func) {
    return function () {
      func();
      onLoad();
    };
  })(window.onload) : onLoad;

}).call(this, window);
