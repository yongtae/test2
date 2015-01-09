﻿/*
 * *****
 * WRITTEN BY FLORIAN RAPPL, 2012.
 * florian-rappl.de
 * mail@florian-rappl.de
 * *****
 */

/*
 * -------------------------------------------
 * BASE CLASS
 * -------------------------------------------
 */
var Base = Class.extend({
	init: function(x, y) {
		this.setPosition(x || 0, y || 0);
		this.clearFrames();
		this.frameCount = 0;
	},
	setPosition: function(x, y) {
		this.x = x;
		this.y = y;
	},
	getPosition: function() {
		return { x : this.x, y : this.y };
	},
	setImage: function(img, x, y) {
		this.image = {
			path : img,
			x : x,
			y : y
		};
	},
	setSize: function(width, height) {
		this.width = width;
		this.height = height;
	},
	getSize: function() {
		return { width: this.width, height: this.height };
	},
	setupFrames: function(fps, frames, rewind, id) {
		if(id) {
			if(this.frameID === id)
				return true;
			
			this.frameID = id;
		}
		
		this.currentFrame = 0;
		this.frameTick = frames ? (1000 / fps / constants.interval) : 0;
		this.frames = frames;
		this.rewindFrames = rewind;
		/*
		console.log(this.currentFrame);
		console.log(this.frameTick);
		console.log(this.frames);
		console.log(this.rewindFrames);
		*/
		return false;
	},
	clearFrames: function() {
		this.frameID = undefined;
		this.frames = 0;
		this.currentFrame = 0;
		this.frameTick = 0;
	},
	playFrame: function() {
		if(this.frameTick && this.view) {
			this.frameCount++;
			
			if(this.frameCount >= this.frameTick) {			
				this.frameCount = 0;
				
				if(this.currentFrame === this.frames)
					this.currentFrame = 0;
					
				var $el = this.view;
				$el.css('background-position', '-' + (this.image.x + this.width * ((this.rewindFrames ? this.frames - 1 : 0) - this.currentFrame)) + 'px -' + this.image.y + 'px');
				this.currentFrame++;
			}
		}
	},
});

/*
 * -------------------------------------------
 * GAUGE CLASS
 * -------------------------------------------
 */
var Gauge = Base.extend({
	init: function(id, startImgX, startImgY, fps, frames, rewind) {
		this._super(0, 0);
		this.view = $('#' + id);
		this.setSize(this.view.width(), this.view.height());
		this.setImage(this.view.css('background-image'), startImgX, startImgY);
		this.setupFrames(fps, frames, rewind);
	},
});


/*
 * -------------------------------------------
 * MATTER CLASS
 * -------------------------------------------
 */
var Matter = Base.extend({
	init: function(x, y, blocking, level) {
		this.blocking = blocking;
		this.view = $(DIV).addClass(CLS_MATTER).appendTo(level.world);
		this.level = level;
		this._super(x, y);
		this.setSize(32, 32);
		this.addToGrid(level);
	},
	addToGrid: function(level) {
		level.obstacles[this.x / 32][this.level.getGridHeight() - 1 - this.y / 32] = this;
	},
	setImage: function(img, x, y) {
		this.view.css({
			backgroundImage : img ? c2u(img) : 'none',
			backgroundPosition : '-' + (x || 0) + 'px -' + (y || 0) + 'px',
		});
		this._super(img, x, y);
	},
	setPosition: function(x, y) {
		this.view.css({
			left: x,
			bottom: y
		});
		this._super(x, y);
	},
	
});

/*
 * -------------------------------------------
 * GROUND CLASS
 * -------------------------------------------
 */
var Ground = Matter.extend({
	init: function(x, y, blocking, level) {
		console.log(level+"--"+blocking);
		this._super(x, y, blocking, level);
	},
});

/*
 * -------------------------------------------
 * GRASS CLASSES
 * -------------------------------------------
 */
/*
 * -------------------------------------------
 * GRASS CLASSES
 * -------------------------------------------
 */
var TopGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.top;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 888, 404);
	},
}, 'grass_top');
var TopRightGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.top + ground_blocking.right;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 922, 404);
	},
}, 'grass_top_right');
var TopLeftGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.left + ground_blocking.top;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 854, 404);
	},
}, 'grass_top_left');
var RightGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.right;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 922, 438);
	},
}, 'grass_right');
var LeftGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.left;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 854, 438);
	},
}, 'grass_left');
var TopRightRoundedGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.top;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 922, 506);
	},
}, 'grass_top_right_rounded');
var TopLeftRoundedGrass = Ground.extend({
	init: function(x, y, level) {
		var blocking = ground_blocking.top;
		this._super(x, y, blocking, level);
		this.setImage(images.objects, 854, 506);
	},
}, 'grass_top_left_rounded');

/*
 * -------------------------------------------
 * DECORATION CLASS
 * -------------------------------------------
 */
var Decoration = Matter.extend({
	init: function(x, y, level) {
		this._super(x, y, ground_blocking.none, level);
		level.decorations.push(this);
	},
	setImage: function(img, x, y) {
		this.view.css({
			backgroundImage : img ? c2u(img) : 'none',
			backgroundPosition : '-' + (x || 0) + 'px -' + (y || 0) + 'px',
		});
		this._super(img, x, y);
	},
	setPosition: function(x, y) {
		this.view.css({
			left: x,
			bottom: y
		});
		this._super(x, y);
	},
});



/*
 * -------------------------------------------
 * SOIL CLASSES
 * -------------------------------------------
 */
var Soil = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 888, 438);
	},
}, 'soil');
var RightSoil = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 922, 540);
	},
}, 'soil_right');
var LeftSoil = Decoration.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setImage(images.objects, 854,540);
	},
}, 'soil_left');



/*
 * -------------------------------------------
 * FIGURE CLASS
 * -------------------------------------------
 */
var Figure = Base.extend({
	init: function(x, y, level) {
		this.view = $(DIV).addClass(CLS_FIGURE).appendTo(level.world);
		this.dx = 0;
		this.dy = 0;
		this.dead = false;
		this.onground = true;
		this.setState(size_states.small);
		this.setVelocity(0, 0);
		this.direction = directions.none;
		this.level = level;
		this._super(x, y);
		level.figures.push(this);
		console.log("Figure");
	},
	setState: function(state) {
		this.state = state;
	},
	setImage: function(img, x, y) {
		this.view.css({
			backgroundImage : img ? c2u(img) : 'none',
			backgroundPosition : '-' + (x || 0) + 'px -' + (y || 0) + 'px',
		});
		this._super(img, x, y);
	},
	setOffset: function(dx, dy) {
		this.dx = dx;
		this.dy = dy;
		this.setPosition(this.x, this.y);
	},
	setPosition: function(x, y) {
		this.view.css({
			left: x,
			bottom: y,
			marginLeft: this.dx,
			marginBottom: this.dy,
		});
		this._super(x, y);
		this.setGridPosition(x, y);
	},
	setSize: function(width, height) {
		this.view.css({
			width: width,
			height: height
		});
		this._super(width, height);
	},
	setGridPosition: function(x, y) {
		this.i = Math.floor((x + 16) / 32);
		this.j = Math.ceil(this.level.getGridHeight() - 1 - y / 32);
		
		if(this.j > this.level.getGridHeight())
			this.die();
	},
	getGridPosition: function(x, y) {
		return { i : this.i, j : this.j };
	},
	setVelocity: function(vx, vy) {
		this.vx = vx;
		this.vy = vy;
		
		if(vx > 0)
			this.direction = directions.right;
		else if(vx < 0)
			this.direction = directions.left;
	},
	getVelocity: function() {
		return { vx : this.vx, vy : this.vy };
	},
	hit: function(opponent) {
		
	},
	collides: function(is, ie, js, je, blocking) {
		/*
		var isHero = this instanceof Hero;
		
		if(is < 0 || ie >= this.level.obstacles.length)
			return true;
			
		if(js < 0 || je >= this.level.getGridHeight())
			return false;
			
		for(var i = is; i <= ie; i++) {
			for(var j = je; j >= js; j--) {
				var obj = this.level.obstacles[i][j];
				
				if(obj) {
					if(obj instanceof Item && isHero && (blocking === ground_blocking.bottom || obj.blocking === ground_blocking.none))
						obj.activate(this);
					
					if((obj.blocking & blocking) === blocking)
						return true;
				}
			}
		}
		*/
		return false;
	},
	move: function() {
		var vx = this.vx;
		var vy = this.vy - constants.gravity;
		
		var s = this.state;
		
		var x = this.x;
		var y = this.y;
		
		var dx = Math.sign(vx);
		var dy = Math.sign(vy);
		
		var is = this.i;
		var ie = is;
		
		var js = Math.ceil(this.level.getGridHeight() - s - (y + 31) / 32);
		var je = this.j;
		
		var d = 0, b = ground_blocking.none;
		var onground = false;
		var t = Math.floor((x + 16 + vx) / 32);
		
		if(dx > 0) {
			d = t - ie;
			t = ie;
			b = ground_blocking.left;
		} else if(dx < 0) {
			d = is - t;
			t = is;
			b = ground_blocking.right;
		}
		
		x += vx;
		
		for(var i = 0; i < d; i++) {
			if(this.collides(t + dx, t + dx, js, je, b)) {
				vx = 0;
				x = t * 32 + 15 * dx;
				break;
			}
			
			t += dx;
			is += dx;
			ie += dx;
		}
		
		if(dy > 0) {
			t = Math.ceil(this.level.getGridHeight() - s - (y + 31 + vy) / 32);
			d = js - t;
			t = js;
			b = ground_blocking.bottom;
		} else if(dy < 0) {
			t = Math.ceil(this.level.getGridHeight() - 1 - (y + vy) / 32);
			d = t - je;
			t = je;
			b = ground_blocking.top;
		} else
			d = 0;
		
		y += vy;
		
		for(var i = 0; i < d; i++) {
			if(this.collides(is, ie, t - dy, t - dy, b)) {
				onground = dy < 0;
				vy = 0;
				y = this.level.height - (t + 1) * 32 - (dy > 0 ? (s - 1) * 32 : 0);
				break;
			}
			
			t -= dy;
		}
		
		this.onground = onground;
		this.setVelocity(vx, vy);
		this.setPosition(x, y);
	},
	death: function() {
		return false;
	},
	die: function() {
		this.dead = true;
	},
});


/*
 * -------------------------------------------
 * ENEMY CLASS
 * -------------------------------------------
 */
var Enemy = Figure.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.speed = 0;
		console.log("enemy");
	},
	hide: function() {
		this.invisible = true;
		this.view.hide();
	},
	show: function() {	
		this.invisible = false;
		this.view.show();
	},
	move: function() {
		if(!this.invisible) {
			this._super();
		
			if(this.vx === 0) {
				var s = this.speed * Math.sign(this.speed);
				this.setVelocity(this.direction === directions.right ? -s : s, this.vy);
			}
		}
	},
	collides: function(is, ie, js, je, blocking) {
		if(this.j + 1 < this.level.getGridHeight()) {
			for(var i = is; i <= ie; i++) {
				if(i < 0 || i >= this.level.getGridWidth())
					return true;
					
				var obj = this.level.obstacles[i][this.j + 1];
				
				if(!obj || (obj.blocking & ground_blocking.top) !== ground_blocking.top)
					return true;
			}
		}
		
		return this._super(is, ie, js, je, blocking);
	},
	setSpeed: function(v) {
		this.speed = v;
		this.setVelocity(-v, 0);
	},
	hurt: function(from) {
		this.die();
	},
	hit: function(opponent) {
		if(this.invisible)
			return;
		/*	
		if(opponent instanceof Mario) {
			if(opponent.vy < 0 && opponent.y - opponent.vy >= this.y + this.state * 32) {
				opponent.setVelocity(opponent.vx, constants.bounce);
				this.hurt(opponent);
			} else {
				opponent.hurt(this);
			}
		}
		*/
	},
});

/*
 * -------------------------------------------
 * GUMPA CLASS
 * -------------------------------------------
 */
var Gumpa = Enemy.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
		this.setSize(34, 32);
		this.setSpeed(constants.ballmonster_v);
		this.death_mode = death_modes.normal;
		this.deathCount = 0;
		console.log("gumpa");
	},
	setVelocity: function(vx, vy) {
		this._super(vx, vy);
		
		if(this.direction === directions.left) {
			if(!this.setupFrames(6, 2, false, 'LeftWalk'))
				this.setImage(images.enemies, 34, 188);
		} else {
			if(!this.setupFrames(6, 2, true, 'RightWalk'))
				this.setImage(images.enemies, 0, 228);
		}
	},
	death: function() {
		if(this.death_mode === death_modes.normal)
			return --this.deathCount;
		
		this.view.css({ 'bottom' : (this.deathDir > 0 ? '+' : '-') + '=' + this.deathStep + 'px' });
		this.deathCount += this.deathDir;
		
		if(this.deathCount === this.deathFrames)
			this.deathDir = -1;
		else if(this.deathCount === 0)
			return false;
			
		return true;
	},
	die: function() {
		this.clearFrames();
		
		if(this.death_mode === death_modes.normal) {
			this.level.playSound('enemy_die');
			this.setImage(images.enemies, 102, 228);
			this.deathCount = Math.ceil(600 / constants.interval);
		} else if(this.death_mode === death_modes.shell) {
			this.level.playSound('shell');
			this.setImage(images.enemies, 68, this.direction === directions.right ? 228 : 188);
			this.deathFrames = Math.floor(250 / constants.interval);
			this.deathDir = 1;
			this.deathStep = Math.ceil(150 / this.deathFrames);
		}
		
		this._super();
	},
}, 'ballmonster');


/*
 * -------------------------------------------
 * LEVEL CLASS
 * -------------------------------------------
 */
var Level = Base.extend({
	init: function(id) {
		this.world = $('#' + id);
		this.nextCycles = 0;
		this._super(0, 0);
		this.active = false;
		this.figures = [];
		this.obstacles = [];
		this.decorations = [];
		this.items = [];
		this.coinGauge = new Gauge('coin', 0, 0, 10, 4, true);
		this.liveGauge = new Gauge('live', 0, 430, 6, 6, true);
	},
	load: function(level) {
		if(this.active) {
			if(this.loop)
				this.pause();

			this.reset();
		}
			
		this.setPosition(0, 0);
		//this.setSize(level.width * 32, level.height * 32);
		//this.setImage(level.background);
		this.raw = level;
		this.id = level.id;
		this.active = true;
		var data = level.data;
		
		for(var i = 0; i < level.width; i++) {
			var t = [];
			
			for(var j = 0; j < level.height; j++) {
				t.push('');
			}
			
			this.obstacles.push(t);
			
			//만약 width=100,height=10 이라면 obstacles변수는 obstacles[200][10] 2차원 배열을 가짐
		}
		
		for(var i = 0, width = data.length; i < width; i++) {
			var col = data[i];
			
			for(var j = 0, height = col.length; j < height; j++) {
				
				////150 line 에 grass_top 객체 생성
				if(reflection[col[j]]){
					//console.log("x="+i * 32+"y="+(height - j - 1) * 32);
					new (reflection[col[j]])(i * 32, (height - j - 1) * 32, this);
				}	
				
			}
		}
		/**/
	},
	
	tick: function() {
		if(this.nextCycles) {
			this.nextCycles--;
			this.nextLoad();			
			return;
		}
		
		var i = 0, j = 0, figure, opponent;

		for(i = this.figures.length; i--; ) {
			//console.log("i="+i);
			figure = this.figures[i];
			if(figure.dead) {
				if(!figure.death()) {
					if(figure instanceof Mario)
						return this.reload();
						
					figure.view.remove();
					this.figures.splice(i, 1);
				} else
					figure.playFrame();
			} else {
				if(i) { //2개 이상일때부터 확인, 현재는 mario 객체는 i=0임
					for(j = i; j--; ) {
						console.log("j="+j);
						if(figure.dead)
							break;
						//figure=2일때 opponent=1,0	
						opponent = this.figures[j];
						if(!opponent.dead && q2q(figure, opponent)) {
						//q2q는 figure x,y 위치값이 opponent 위치값과 비교해서
						//절반값 이상 겹치면 false를 내보냄
						
						//opponent가 살아있고, figure-opponent 가 겹치지 않으면
						// 실행한다
						
							figure.hit(opponent);
							opponent.hit(figure);
						}
					}
				}
			}
			
			if(!figure.dead) {
				figure.move();
				figure.playFrame();
			}
		}
		/**/
		for(i = this.items.length; i--; )
			this.items[i].playFrame();
		
		this.coinGauge.playFrame();
		this.liveGauge.playFrame();
	},
	start: function() {
		var me = this;
		/*
		me.loop = setInterval(function() {
			me.tick.apply(me);
		}, constants.interval);
		*/
		for(j = 25; j--; ) {
			me.tick.apply(me);
		}
	},
	setPosition: function(x, y) {
		this._super(x, y);
		this.world.css('left', -x);
	},
	setImage: function(index) {
		var img = BASEPATH + 'backgrounds/' + ((index < 10 ? '0' : '') + index) + '.png';
		this.world.parent().css({
			backgroundImage : c2u(img),
			backgroundPosition : '0 -380px'
		});
		this._super(img, 0, 0);
	},
	setSize: function(width, height) {
		this._super(width, height);
	},
	getGridWidth: function() {
		return this.raw.width;
	},
	getGridHeight: function() {
		return this.raw.height;
	},
});

/*
 * -------------------------------------------
 * DOCUMENT READY STARTUP METHOD
 * -------------------------------------------
 */
$(document).ready(function() {
	var level = new Level('world');
	level.load(definedLevels[0]);
	level.start();
});