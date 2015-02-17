/*
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
		//console.log("x="+x+",,y="+y);
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
		this.i = Math.floor((x + 16) / 32); //32단위로 페이징처리 0~32=1, 32~64=2 ... 
		this.j = Math.ceil(this.level.getGridHeight() - 1 - y / 32); //32단위로 페이징처리 0~32=14, 32~64=13 ...
		
		if(this.j > this.level.getGridHeight())
			this.die();
	},
	getGridPosition: function(x, y) {
		return { i : this.i, j : this.j };
	},
	setVelocity: function(vx, vy) {
		this.vx = vx;
		this.vy = vy;
		//console.log("this.vx값="+this.vx);
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
	collides: function(is, ie, js, je, blocking) { ///충돌체크
		
		var isHero = this instanceof Hero;
		
		if(is < 0 || ie >= this.level.obstacles.length) //his.level.obstacles.length=레벨width값만큼의 장애물
			return true;
			
		if(js < 0 || je >= this.level.getGridHeight())
			return false;
		//width값보다 크면 실행하지 않음	
		console.log("is="+is+",,ie="+ie+",,js="+js+",,je="+je);	
		for(var i = is; i <= ie; i++) {
			for(var j = je; j >= js; j--) {
				var obj = this.level.obstacles[i][j];
				if(obj) {
					/*
					if(obj instanceof Item && isHero && (blocking === ground_blocking.bottom || obj.blocking === ground_blocking.none))
						obj.activate(this);
					*/
					if((obj.blocking & blocking) === blocking)
						return true;
						
				}
			}
		}
		
		return false;
	},
	move: function() {
		var vx = this.vx; //x방향 속도
		var vy = this.vy - constants.gravity; //y방향 속도
		
		var s = this.state; //
		
		var x = this.x; //x위치
		var y = this.y; //y위치
		
		/*
		math.sign = 부호조사
		math.ceil = 수직선상 바로 오른쪽 정수
		math.floor = 수직선상 바로 왼쪽정수
		*/
		var dx = Math.sign(vx); //방향확인 left=+값일때, right=-값일때
		var dy = Math.sign(vy); //방향확인 bottom=+값일때, top=-값일때
		
		var is = this.i; // x방향 그리드
		var ie = is;
		
		var js = Math.ceil(this.level.getGridHeight() - s - (y + 31) / 32); //y뱡향 그리드와 s변수에 따라 1차이 또는 2차이
		//s변수는 
		var je = this.j; // y방향 그리드
		
		var d = 0, b = ground_blocking.none;//b=블락, d=x그리드 위치와, 몹의 그리드위치의 차이
		var onground = false;
		var t = Math.floor((x + 16 + vx) / 32); //vx 속도만큼의 몹의 그리드 위치
	
		

		//-------------------------------------------- x방향으로 움직임
		if(dx > 0) {
			d = t - ie;
			t = ie;
			b = ground_blocking.left;
		} else if(dx < 0) {
			d = is - t;
			t = is;
			b = ground_blocking.right;
		
		}
		
		//mario는 초기값 vx=0이므로 움직이지 않음, vx(속도x)값으로 움직임 제어
		x += vx; //vx값만큼 x위치를 더해줌 . 318+(-2),316+(-2)
		
		for(var i = 0; i < d; i++) {
			if(this.collides(t + dx, t + dx, js, je, b)) {///모든 figure들의 충돌체크
				console.log('-충돌-');
				vx = 0;
				x = t * 32 + 15 * dx;
				break;
			}
			
			t += dx;
			is += dx;
			ie += dx;
			//console.log("t="+t+",,is="+is+",,ie="+ie);
		}

	
		//-------------------------------------------- y방향으로 움직임
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
				console.log('-충돌-');
				onground = dy < 0;
				vy = 0;
				y = this.level.height - (t + 1) * 32 - (dy > 0 ? (s - 1) * 32 : 0);
				console.log('this.level.height='+this.level.height);
				console.log('t='+t);
				console.log('s='+s);
				break;
			}
			
			t -= dy;
		}
		
						
		///// move 함수에서 사용하는 모든변수 확인
		console.log("vx="+vx+",,vy="+vy);
		console.log("dx="+dx+",,dy="+dy);
		console.log("x(위치값)="+x+",,y(위치값)="+y);
		/*
		console.log("is="+is+",,ie="+ie);
		console.log("js="+js+",,je="+je);
		console.log("d="+d+",,b="+b);
		*/
		console.log("t="+t+",,onground="+onground);
		console.log("-------------------");
	 
		//------------------------------------------
			
		console.log("-----")
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
		if(!this.invisible) {/// 살아있으면
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
		if(this.invisible) //죽었으면 hit 할필요 없음
			return;
		
		//console.log(opponent instanceof Mario);
		if(opponent instanceof Mario) { ///마리오와 같다면
			if(opponent.vy < 0 && opponent.y - opponent.vy >= this.y + this.state * 32) {
				opponent.setVelocity(opponent.vx, constants.bounce);
				this.hurt(opponent); ///enemy는 죽는다
			} else {
				opponent.hurt(this); //마리오는 죽는다.
			}
		}
		/*	*/
	},
});

/*
 * -------------------------------------------
 * GUMPA CLASS
 * -------------------------------------------
 */
var Gumpa = Enemy.extend({
	init: function(x, y, level) {
		console.log("gumpa");
		
		this._super(x, y, level);
		this.setSize(34, 32);
		this.setSpeed(constants.ballmonster_v);
		this.death_mode = death_modes.normal;
		this.deathCount = 0;
	
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
 * HERO CLASS
 * -------------------------------------------
 */
var Hero = Figure.extend({
	init: function(x, y, level) {
		this._super(x, y, level);
	},
});

/*
 * -------------------------------------------
 * MARIO CLASS
 * -------------------------------------------
 */
var Mario = Hero.extend({
	init: function(x, y, level) {
		this.standSprites = [
			[[{ x : 0, y : 81},{ x: 481, y : 83}],[{ x : 81, y : 0},{ x: 561, y : 83}]],
			[[{ x : 0, y : 162},{ x: 481, y : 247}],[{ x : 81, y : 243},{ x: 561, y : 247}]]
		];
		this.crouchSprites = [
			[{ x : 241, y : 0},{ x: 161, y : 0}],
			[{ x : 241, y : 162},{ x: 241, y : 243}]
		];
		this.deadly = 0;
		this.invulnerable = 0;
		this.width = 80;
		this._super(x, y, level);
		this.blinking = 0;
		this.setOffset(-24, 0);
		this.setSize(80, 80);
		this.cooldown = 0;
		this.setMarioState(mario_states.normal);
		this.setLifes(constants.start_lives);
		this.setCoins(0);
		this.deathBeginWait = Math.floor(700 / constants.interval);
		this.deathEndWait = 0;
		this.deathFrames = Math.floor(600 / constants.interval);
		this.deathStepUp = Math.ceil(200 / this.deathFrames);
		this.deathDir = 1;
		this.deathCount = 0;
		this.direction = directions.right;
		this.setImage(images.sprites, 81, 0);
		this.crouching = false;
		this.fast = false;
	},
	setMarioState: function(state) {
		this.marioState = state;
	},
	setState: function(state) {
		if(state !== this.state) {
			this.setMarioState(mario_states.normal);
			this._super(state);
		}
	},
	setPosition: function(x, y) {
		
		this._super(x, y);
		var r = this.level.width - 640;
		var w = (this.x <= 210) ? 0 : ((this.x >= this.level.width - 230) ? r : r / (this.level.width - 440) * (this.x - 210));		
		this.level.setParallax(w);

		if(this.onground && this.x >= this.level.width - 128)
			this.victory();
		/**/	
	},
	input: function(keys) {
		this.fast = keys.accelerate;
		this.crouching = keys.down;
		
		/// key.down이 false 일때만 모든동작을 동시에 작동할수 있음
		// 마리오가 앉아 있을때는 현재 행동만 할수 있음. 다른 행동은 동시에 못함
		if(!this.crouching) { // keys.down가 false 일때
			
			if(this.onground && keys.up)
				this.jump();
				
			if(keys.accelerate && this.marioState === mario_states.fire)
				this.shoot();
				
			if(keys.right || keys.left)
				this.walk(keys.left, keys.accelerate);
			else
				this.vx = 0;
		}
	},
	victory: function() {
		this.level.playMusic('success');
		this.clearFrames();
		this.view.show();
		this.setImage(images.sprites, this.state === size_states.small ? 241 : 161, 81);
		this.level.next();
	},
	shoot: function() {
		if(!this.cooldown) {
			this.cooldown = constants.cooldown;
			this.level.playSound('shoot');
			new Bullet(this);
		}
	},
	setVelocity: function(vx, vy) {
		if(this.crouching) {
			vx = 0;
			this.crouch();
		} else {
			if(this.onground && vx > 0)
				this.walkRight();
			else if(this.onground && vx < 0)
				this.walkLeft();
			else{
				this.stand();
				console.log('mario stand');
			}	
		}
	
		this._super(vx, vy);
	},
	blink: function(times) {
		this.blinking = Math.max(2 * times * constants.blinkfactor, this.blinking || 0);
	},
	invincible: function() {
		this.level.playMusic('invincibility');
		this.deadly = Math.floor(constants.invincible / constants.interval);
		this.invulnerable = this.deadly;
		this.blink(Math.ceil(this.deadly / (2 * constants.blinkfactor)));
	},
	grow: function() {
		if(this.state === size_states.small) {
			this.level.playSound('grow');
			this.setState(size_states.big);
			this.blink(3);
		}
	},
	shooter: function() {
		if(this.state === size_states.small)
			this.grow();
		else
			this.level.playSound('grow');
			
		this.setMarioState(mario_states.fire);
	},
	walk: function(reverse, fast) {
		this.vx = constants.walking_v * (fast ? 2 : 1) * (reverse ? - 1 : 1);
	},
	walkRight: function() {
		if(this.state === size_states.small) {
			if(!this.setupFrames(8, 2, true, 'WalkRightSmall'))
				this.setImage(images.sprites, 0, 0);
		} else {
			if(!this.setupFrames(9, 2, true, 'WalkRightBig'))
				this.setImage(images.sprites, 0, 243);
		}
	},
	walkLeft: function() {
		if(this.state === size_states.small) {
			if(!this.setupFrames(8, 2, false, 'WalkLeftSmall'))
				this.setImage(images.sprites, 80, 81);
		} else {
			if(!this.setupFrames(9, 2, false, 'WalkLeftBig'))
				this.setImage(images.sprites, 81, 162);
		}
	},
	stand: function() {
		var coords = this.standSprites[this.state - 1][this.direction === directions.left ? 0 : 1][this.onground ? 0 : 1];
		//console.log("coords.x, coords.y==",+coords.x+", "+coords.y);
		this.setImage(images.sprites, coords.x, coords.y);
		this.clearFrames();
	},
	crouch: function() {
		var coords = this.crouchSprites[this.state - 1][this.direction === directions.left ? 0 : 1];
		this.setImage(images.sprites, coords.x, coords.y);
		this.clearFrames();
	},
	jump: function() {
		this.level.playSound('jump');
		this.vy = constants.jumping_v;
	},
	move: function() {
		//console.log('mario move --------');
		this.input(keys);
		this._super();
	},
	addCoin: function() {
		this.setCoins(this.coins + 1);
	},
	playFrame: function() {		
		if(this.blinking) {
			if(this.blinking % constants.blinkfactor === 0)
				this.view.toggle();
				
			this.blinking--;
		}
		
		if(this.cooldown)
			this.cooldown--;
		
		if(this.deadly)
			this.deadly--;
		
		if(this.invulnerable)
			this.invulnerable--;
		
		this._super();
	},
	setCoins: function(coins) {
		this.coins = coins;
		
		if(this.coins >= constants.max_coins) {
			this.addLife()
			this.coins -= constants.max_coins;
		}
				
		this.level.world.parent().children('#coinNumber').text(this.coins);
	},
	addLife: function() {
		this.level.playSound('liveupgrade');
		this.setLifes(this.lifes + 1);
	},
	setLifes : function(lifes) {
		this.lifes = lifes;
		this.level.world.parent().children('#liveNumber').text(this.lifes);
	},
	death: function() {
		if(this.deathBeginWait) {
			this.deathBeginWait--;
			return true;
		}
		
		if(this.deathEndWait)
			return --this.deathEndWait;
		
		this.view.css({ 'bottom' : (this.deathDir > 0 ? '+' : '-') + '=' + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + 'px' });
		this.deathCount += this.deathDir;
		
		if(this.deathCount === this.deathFrames)
			this.deathDir = -1;
		else if(this.deathCount === 0)
			this.deathEndWait = Math.floor(1800 / constants.interval);
			
		return true;
	},
	die: function() {
		this.setMarioState(mario_states.normal);
		this.deathStepDown = Math.ceil(240 / this.deathFrames);
		this.setupFrames(9, 2, false);
		this.setImage(images.sprites, 81, 324);
		this.level.playMusic('die');
		this._super();
	},
	hurt: function(from) {
		if(this.deadly)
			from.die();
		else if(this.invulnerable)
			return;
		else if(this.state === size_states.small) {
			this.die();
		} else {
			this.invulnerable = Math.floor(constants.invulnerable / constants.interval);
			this.blink(Math.ceil(this.invulnerable / (2 * constants.blinkfactor)));
			this.setState(size_states.small);
			this.level.playSound('hurt');			
		}
	},
}, 'mario');


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
		this.setSize(level.width * 32, level.height * 32);
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
					//console.log(reflection[col[j]]+"--x="+i * 32+"y="+(height - j - 1) * 32);
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
			if(figure instanceof Mario) { ///마리오와 같다면
				//console.log("figure"+i+"=Mario");
			}
			if(figure instanceof Gumpa){
				//console.log("figure"+i+"=Gumpa");
			}	
			
			if(figure.dead) {
				if(!figure.death()) {
					if(figure instanceof Mario)
						return this.reload();
						
					figure.view.remove();
					this.figures.splice(i, 1);
				} else
					figure.playFrame();
			} else {
					
				if(i) { //2개 이상일때부터 확인
								//1개는 부딪힐일이 없음.
					for(j = i; j--; ) {
						//console.log("j="+j);
						
						if(figure.dead)
							break;
						//figure=2일때 opponent=1,0	
						opponent = this.figures[j];
			
						if(!opponent.dead && q2q(figure, opponent)) {
							console.log("충돌함");
						//q2q는 figure x,y 위치값이 opponent 위치값과 비교
						//opponent가 살아있고, figure-opponent 가 겹치는 시점에 서로 부딪힌다			
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
			//console.log("----------------figure loop exit----------------");
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
		var j=30;
		for(j = 2; j--; ) {
			me.tick.apply(me);
			console.log("----------------["+j+"]tick exit----------------");
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
	setParallax: function(x) {
		this.setPosition(x, this.y);
		this.world.parent().css('background-position', '-' + Math.floor(x / 3) + 'px -380px');
	},
	setSounds: function(manager) {
		this.sounds = manager;
	},
	playSound: function(label) {
		if(this.sounds)
			this.sounds.play(label);
	},
	playMusic: function(label) {
		if(this.sounds)
			this.sounds.sideMusic(label);
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
	keys.bind();
});