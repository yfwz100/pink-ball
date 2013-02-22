(function () {
  var messagebox = document.createElement('div');
  messagebox.id = 'message-box';

  messagebox.style.position = 'absolute';
  messagebox.style.top = '-300px';
  messagebox.style.left = window.innerWidth / 2 - 200 + 'px';
  messagebox.style.width = '400px';
  messagebox.style.height = '200px';
  messagebox.style.overflow = 'auto';
  messagebox.style.zIndex = 642;

  var title = document.createElement('div');
  title.className = 'title';
  messagebox.appendChild(title);

  var body = document.createElement('div');
  body.className = 'body';
  messagebox.appendChild(body);

  var actbar = document.createElement('div');
  actbar.className = 'act-bar';
  var ybtn = document.createElement('a');
  ybtn.className = 'y-btn';
  actbar.appendChild(ybtn);
  var nbtn = document.createElement('a');
  nbtn.className = 'n-btn';
  actbar.appendChild(nbtn);
  messagebox.appendChild(actbar);

  function onLoad() {
    document.body.appendChild(messagebox);
  }

  window.onload = window.onload ? (function (func) {
    return function () {
      onLoad();
      func();
    };
  })(window.onload) : onLoad;
  
  window.message = {
    text: function (t, b) {
      if (! b) {
        b = t
      }
      title.innerHTML = t;
      body.innerHTML = b;
      return this;
    },
    yes: function (text, func) {
      ybtn.innerHTML = text;
      ybtn.onclick = func;
      return this;
    },
    no: function (text, func) {
      nbtn.innerHTML = text;
      nbtn.onclick = func;
      return this;
    },
    show: function (sec) {
      if (sec) {
        var m = this;
        setTimeout(function () {
          m.hide();
        }, sec);
      }
      messagebox.dataset['center'] = true;
      centerelement(messagebox);
      return this;
    },
    hide: function () {
      messagebox.style.top = '-300px';
      messagebox.style.left = window.innerWidth / 2 - 200 + 'px';
      messagebox.dataset['center'] = false;
      this.yes('').no('');
      return this;
    }
  };
}).call(this);
