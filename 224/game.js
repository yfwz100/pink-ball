
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

  function BlkMap(w, h, cols, rows, bits) {
    this.w = w;
    this.h = h;
    this.cols = cols;
    this.rows = rows;
    this._sx = w / cols;
    this._sy = h / rows;
    this._map = new Array(w*h);
    for (var i=0; i<this._map.length; i++) {
      this._map[i] = false;
    }
    this.map(bits);
  };

  BlkMap.prototype = {
    get width() { return this.w },
    get height() { return this.h },
    test: function (obj) {
      var x, y, w, h;
      if(obj.r) {
        x = obj.x-obj.r; y = obj.y-obj.r; w = obj.r*2; h = obj.r*2;
      } else {
        x = obj.x; y = obj.y; w = obj.w; h = obj.h;
      }
      var val;
      for (var i=0; i<=w; i+=this._sx) {
        for (var j=0; j<=h; j+=this._sy) {
          if (val=this.block(x+i, y+j)) {
            return val;
          }
        }
      }
      return false;
    },
    lineTest: function (x, y, tx, ty) {
      var dx = tx - x;
      var dy = ty - y;
      var ux, uy;
      if (Math.abs(dx) > Math.abs(dy)) {
        ux = dx > 0 ? this._sx : - this._sx;
        uy = dy / dx * ux;
      } else if (dx !=dy) {
        uy = dy > 0 ? this._sy : - this._sy;
        ux = dx / dy * uy;
      } else {
        ux = dx > 0 ? this._sx : - this._sx;
        uy = dy > 0 ? this._sy : - this._sy;
      }
      var absux = Math.abs(ux), absuy = Math.abs(uy);
      var ret;
      for (var i=x, j=y; 
          Math.abs(tx-i) > absux || Math.abs(ty-j) > absuy; 
          i+=ux, j+=uy) {
        if (ret=this.block(i, j)) {
          return {x: i, y: j};
        }
      }
      return {x: tx, y: ty};
    },
    block: function(x, y, bit) {
      if (x< 0 || x >= this.width || y < 0 || y >= this.height) return true;
      x = parseInt(x / this._sx);
      y = parseInt(y / this._sy);
      if (typeof bit != 'undefined') {
        return this._map[this.cols*y+x] = bit;
      } else {
        return this._map[this.cols*y+x];
      }
    },
    map: function (bits) {
      if (bits instanceof Array) {
        for (var i=0; i<bits.length; i++) {
          this._map[i] = bits[i];
        }
      } else if (typeof bits == 'object') {
        for(var attr in bits) {
          var pos = null;
          if (pos = /^b\(([0-9]+)\s*,\s*([0-9]+)\)$/.exec(attr)) {
            this.block(parseInt(pos[1]), parseInt(pos[2]), bits[attr]);
          } else if (pos = /^r\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/.exec(attr)) {
            var sx = parseInt(pos[1]), sy = parseInt(pos[2]);
            var val = bits[attr];
            for (var i=0; i<parseInt(pos[3]); i+=this._sx) {
              for (var j=0; j<parseInt(pos[4]); j+=this._sy) {
                this.block(sx+i, sy+j, val);
              }
            }
          }
        }
      }
    },
    draw: function (ctx) {
      ctx.save();
      ctx.fillStyle = 'rgb(200, 200, 200)';
      for (var i=0; i<this.cols; i++) {
        for (var j=0; j<this.rows; j++) {
          if (this._map[this.cols*j+i])
            ctx.fillRect(i*this._sx, j*this._sy, this._sx, this._sy);
        }
      }
      ctx.restore();
    }
  };

  var DIST = 100, DDIST = DIST*DIST;
  var deg = Math.PI/180;

  function Role(x, y) {
    this._x = this._oldx = x;
    this._y = this._oldy = y;
    this.r = 10;
    this._v = 2;
    this.color = 'rgb(0,200,255)';
  };

  Role.prototype = {
    get x() {
      return this._x;
    },
    set x(x) {
      this._oldx = this._x;
      this._x = x;
    },
    get y() {
      return this._y;
    }, 
    set y(y) {
      this._oldy = this._y;
      this._y = y;
    },
    get v() {
      return this._v;
    },
    set v(v) {
      this._v = v;
    },
    get w() { return 20; },
    get h() { return 20; },
    move: function (x, y) {
      if (typeof x == 'object') {
        y = x.y;
        x = x.x;
      }
      var d = Math.sqrt(x*x+y*y);
      if (d > 0) {
        this.x += x / d * this.v;
        this.y += y / d * this.v;
      }
    },
    update: function (game) {
      var map = game.map;
      var blk = map.test(this);
      if (blk) {
        this._x = this._oldx;
        this._y = this._oldy;
      }
    },
    draw: function (ctx) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this._x, this._y, this.r, 0, Math.PI*2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  };

  function Follower(x, y) {
    Role.call(this, x, y);
    this._angle = 0;
    this._step = 0;
    this._xstep = this._ystep = 0;
    this._rstep = 1;
    this.color = 'rgb(212, 212, 212)';
    this._g = {
      dx1: 0, dy1: 0, dx2: 0, dy2: 0
    };
    this._v = 1.5;

    (function (f) {
      (function randomMove() {
        f._rstep = parseInt((Math.random() - 0.5) * 5);
        f._xstep = (Math.random() - 0.5) / 0.5;
        f._ystep = (Math.random() - 0.5) / 0.5;
        setTimeout(randomMove, Math.random() * 4000);
      })();
    })(this);
  }
  Follower.prototype = Object.create(Role.prototype, {
    angle: {
      set: function (angle) {
        angle %= 360;
        if (angle < 0) {
          angle = (angle+360) % 360;
        }
        this._angle = angle;
      },
      get: function () {
        return this._angle;
      }
    },
    update: {
      value: function (game) {
        Role.prototype.update.call(this, game);
        var hero = game.hero;
        var dx = hero.x - this.x;
        var dy = hero.y - this.y;
        var d = dx*dx+dy*dy;
        var angle = (Math.atan2(dy,dx)/deg+360)%360;
        if (d < 400) {
          return ':-(';
        } else if (Math.abs(angle-this.angle) < 15 && d < DDIST) {
          var pos = {};
          pos.x = dx ? (dx>0?1:-1) : 0;
          pos.y = dy ? (dy>0?1:-1) : 0;
          this.move(pos);
          this.angle = angle; 
        } else {
          this.angle = this.angle + this._rstep;

          this.x += this._xstep;
          this.y += this._ystep;
        }

        var target = game.target;
        var d = Math.pow(target.x-this.x, 2)+Math.pow(target.y-this.y, 2);
        if (d < 400) {
          return ':-(';
        }

        var map = game.map;

        var dx1 = DIST*Math.cos((this.angle-15)*deg);
        var dy1 = DIST*Math.sin((this.angle-15)*deg);
        var dx2 = DIST*Math.cos((this.angle+15)*deg);
        var dy2 = DIST*Math.sin((this.angle+15)*deg);
        var dx3 = 0, dy3 = 0;

        var pos1 = map.lineTest(this.x,this.y,this.x+dx1,this.y+dy1);
        var pos2 = map.lineTest(this.x,this.y,this.x+dx2,this.y+dy2);

        if (pos1.x != this.x+dx1 && pos1.y != this.y+dy1 && pos2.x != this.x+dx2 && pos2.y != this.y+dy2) {
          dx3 = Math.abs(pos1.x-this.x) > Math.abs(pos2.x-this.x) ? pos1.x : pos2.x;
          dy3 = Math.abs(pos1.y-this.y) > Math.abs(pos2.y-this.y) ? pos1.y : pos2.y;
        } else {
          if (pos1.x != this.x+dx1) {
            var pos3 = map.lineTest(pos2.x, pos2.y, this.x+dx1, this.y+dy1);
            dx3 = pos3.x;
            dy3 = pos3.y;
          } else if (pos2.x != this.x+dx2) {
            var pos3 = map.lineTest(pos1.x, pos1.y, this.x+dx2, this.y+dy2);
            dx3 = pos3.x;
            dy3 = pos3.y;
          } else {
            dx3 = this.x+dx1;
            dy3 = this.y+dy1;
          }
        }

        this._g = {
          dx1: pos1.x, dy1: pos1.y, 
          dx2: pos2.x, dy2: pos2.y, 
          dx3: dx3, dy3: dy3
        };

        return false;
      }
    },
    draw: {
      value: function (ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(212,212,212,0.3)';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this._g.dx1, this._g.dy1);
        //ctx.arc(0, 0, DIST, (this.angle-15)*deg, (this.angle+15)*deg, false);
        ctx.lineTo(this._g.dx3, this._g.dy3);
        ctx.lineTo(this._g.dx2, this._g.dy2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        Role.prototype.draw.call(this, ctx);
      }
    }
  });

  function doGaming(canvas, callback) {
    if (! canvas) {
      if (console.error) console.error('Canvas has not been defined yet.');
      return;
    }

    var width = canvas.width, height = canvas.height;

    var buffer = doc.createElement('canvas');
    buffer.width = width;
    buffer.height = height*3;
    var ctx = buffer.getContext('2d');
    
    // game definition
    var hero = new Role(20, 20);
    var target = new Role(500, 1000);
    target.color = 'rgb(200,0,153)';
    target.update = function (game) {
      Role.prototype.update.call(this, game);
      var dx = hero.x - this.x;
      var dy = hero.y - this.y;
      var d = dx*dx+dy*dy;
      if (d < DDIST) {
        this.x += dx ? (dx>0?-1:1) : 0;
        this.y += dy ? (dy>0?-1:1) : 0;
      }
      return d < 400 ? ':-)' : false;
    };
    var map = new BlkMap(buffer.width, buffer.height, buffer.width/10, buffer.height/10, {
      'r(180,180,10,280)': true,
      'r(180,280,300,10)': true,
      'r(0,120,300,10)':   true,
      'r(280,180,10,100)': true,
      'r(350,120,300,10)': true,

      'r(100,450,400,10)': true,
      'r(100,450,10,200)': true,
      'r(500,450,10,200)': true,
      'r(200,550,10,300)': true,
      'r(400,550,10,300)': true,
      'r(0,700,200,10)':   true,
      'r(400,700,200,10)': true,

      // yuan
      'r(20,1050,180,10)': true,
      'r(10,1100,200,10)': true,
      'r(80,1100,10,60)':  true,
      'b(70,1160)': true,
      'b(60,1170)': true,
      'r(30,1180,30,10)': true,
      'r(110,1100,10,80)': true,
      'r(110,1180,100,10)': true,
      // xiao
      'b(320,1050)': true,
      'r(250,1060,160,10)': true,
      'b(250,1070)': true,
      'b(400,1070)': true,
      'b(290,1080)': true,
      'b(320,1080)': true,
      'b(360,1080)': true,
      'r(280,1100,10,90)': true,
      'r(370,1100,10,90)': true,
      'r(280,1090,100,10)': true,
      'r(280,1120,100,10)': true,
      'r(280,1150,100,10)': true
    });
    var followers = [];
    followers.push(new Follower(100, 100));
    followers.push(new Follower(200, 100));
    followers.push(new Follower(300, 300));
    followers.push(new Follower(300, 100));
    followers.push(new Follower(100, 300));
    followers.push(new Follower(400, 300));
    followers.push(new Follower(400, 200));
    followers.push(new Follower(500, 300));
    followers.push(new Follower(200, 200));
    followers.push(new Follower(230, 700));
    followers.push(new Follower(360, 700));
    followers.push(new Follower(300, 600));
    followers.push(new Follower(530, 500));
    followers.push(new Follower(100, 900));
    followers.push(new Follower(500, 900));
    followers.push(new Follower(300, 900));
    followers.push(new Follower(520, 800));
    followers.push(target);

    // game context.
    var game = {
      hero: hero,
      map: map,
      target: target,
      followers: followers,
      viewport: {x: 0, y:0}
    };
    var gameover = false;

    clearTimeout(canvas.loop);
    (function loop() {
      // event ---------------------------------------
      var dir = {x:0, y:0};
      if (keypress.left) {
        dir.x = -1;
      }
      if (keypress.right) {
        dir.x = 1;
      }
      if (keypress.up) {
        dir.y = -1;
      }
      if (keypress.down) {
        dir.y = 1;
      }
      hero.move(dir);

      // update --------------------------------------
      hero.update(game);
      var t;
      for (var i=0; i<followers.length; i++) {
        if (t=followers[i].update(game)) {
          ctx.save();
          ctx.font = "30px Comic Sans MS";
          ctx.fillStyle = "rgb(22,22,22)";
          ctx.translate(200, 200);
          ctx.rotate(Math.PI/2);
          ctx.fillText(t, 0, 0);
          ctx.restore();
          switch (t) {
            case ':-(':
              callback('failure');
              break;
            case ':-)':
              callback('success');
              break;
          }
          clearTimeout(canvas.loop);
          canvas.getContext('2d').drawImage(buffer, game.viewport.x, game.viewport.y);
          return;
        }
      }

      // draw ----------------------------------------
      ctx.save();

      ctx.fillStyle = '#222222';
      ctx.fillRect(0, 0, buffer.width, buffer.height);

      hero.draw(ctx);
      for (var i=0; i<followers.length; i++) {
        followers[i].draw(ctx);
      }
      map.draw(ctx);

      ctx.restore();

      var viewport = game.viewport;
      if (hero.x + viewport.x > width-20) {
        viewport.x -= 2;
      } else if (hero.x + viewport.x < 20) {
        viewport.x += 2;
      }
      if (hero.y + viewport.y > height-20) {
        viewport.y -= 2;
      } else if (hero.y + viewport.y < 20) {
        viewport.y += 2;
      }

      var context = canvas.getContext('2d');
      context.clearRect(0, 0, width, height);
      context.drawImage(buffer, game.viewport.x, game.viewport.y);

      // loop ----------------------------------------
      canvas.loop = setTimeout(loop, 1000/30);
    })();
  }

  function onLoad() {
    var slides = doc.getElementById('gift');
    var canvasSlide = doc.getElementById('canvas-slide');
    var canvas = canvasSlide.getElementsByTagName('canvas')[0];
    canvasSlide.onslide = function () {
      doGaming(canvas, function (result) {
        var m = null;
        if (result == 'failure') {
          m = 'Next step?';
        } else {
          m = 'Congratulation!';
        }
        window.message.text('Information', m)
              .yes('Replay', function () {
                slides.prevSlide();
                window.message.hide();
              })
              .no('Next...', function () {
                slides.nextSlide();
                window.message.hide();
              }).show();
      });
    };
    canvasSlide.onslideleave = function () {
      clearTimeout(canvas.loop);
      window.message.hide();
    };

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

