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
		this.frameTick = frames ? (1000 / fps / constants.interval) : 0; //프레임 속도
		this.frames = frames; //프레임 개수(이미주 개수)
		this.rewindFrames = rewind; //반복여부
		
		//console.log("fps, frames, rewind, id=="+fps+", "+frames+", "+rewind+", "+id);
		//console.log("frameTick, constants.interval, =="+this.frameTick+", "+constants.interval);
		/**/
		return false;
	},
	clearFrames: function() {
		
	},
	playFrame: function() {
		if(this.frameTick && this.view) { //프레임 속도 true, id값이 있으면, 존재여부 체크
			this.frameCount++;
			
			if(this.frameCount >= this.frameTick) {		//프레임 속도가 5이면, 1000/5초에 한번씩 실행함, 프레임속도가 클수록 더 빨리 플레이	
				this.frameCount = 0;
					
				if(this.currentFrame === this.frames)
					this.currentFrame = 0;
				
				// 이미지 x+이미지넓이*현재프레임 번호	
				var $el = this.view;
				/// this.rewindFrames 가 false 이면 0,-1,-2,-3,-4
				// true 0,1,2,3,4 제한은 
				this.rewindFrames = false;
				//console.log(this.frames+"-"+this.currentFrame);
				//console.log('-' + (this.image.x + this.width * ((this.rewindFrames ? this.frames - 1 : 0) - this.currentFrame)) + 'px -' + this.image.y + 'px');
				$el.css('background-position', '-' + (this.image.x + this.width * ((this.rewindFrames ? this.frames - 1 : 0) - this.currentFrame)) + 'px -' + this.image.y + 'px');
				this.currentFrame++;
			}
		}
	},
});

var Gauge = Base.extend({
	init: function(id, startImgX, startImgY, fps, frames, rewind) {
		//console.log("ctreate Guage");
		this._super(0, 0);
		this.view = $('#' + id);
		this.setSize(this.view.width(), this.view.height());
		this.setImage(this.view.css('background-image'), startImgX, startImgY);
		this.setupFrames(fps, frames, rewind);
	},
});


/*
 * -------------------------------------------
 * FIGURE CLASS
 * -------------------------------------------
 */
var Figure = Base.extend({
	init: function(x, y, level) {
		//console.log(DIV+'--'+CLS_FIGURE);
		//console.log(this);
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
		level.figures.push(this); //figure 객체를 level 변수에 넣어준다.
	},
	setState: function(state){//인형 상태,큰이미지,작은이미지
		this.state = state;
	},
	setVelocity: function(vx, vy){//인형 속도
		this.vx = vx; //x방향
		this.vy = vy; //y방향
		if(vx > 0)
			this.direction = directions.right;
		else if(vx < 0)
			this.direction = directions.left;
	},
	setSize: function(width, height) {// 인형 크기
		this.view.css({
			width: width,
			height: height
		});
		this._super(width, height);
	},
	setImage: function(img, x, y) {// 인형 이미지 셋팅
		this.view.css({
			backgroundImage : img ? c2u(img) : 'none',
			backgroundPosition : '-' + (x || 0) + 'px -' + (y || 0) + 'px',
		});
		this._super(img, x, y);
	},
	setOffset: function(dx, dy) {// 인형 속도,인형위치
		this.dx = dx;
		this.dy = dy;
		this.setPosition(this.x, this.y);
	},
	setPosition: function(x, y) { // 인형 위치
		//console.log("x,y,marginLeft,marginBottom--"+x+","+y+","+this.dx+","+this.dy);
		this.view.css({
			left: x,
			bottom: y,
			marginLeft: this.dx,
			marginBottom: this.dy,
		});
		this._super(x, y);
		this.setGridPosition(x, y);
	},
	setGridPosition: function(x, y) { // 인형 grid 위치
		this.i = Math.floor((x + 16) / 32); //32단위로 페이징처리 0~32=1, 32~64=2 ... 
		this.j = Math.ceil(this.level.getGridHeight() - 1 - y / 32); //32단위로 페이징처리 0~32=14, 32~64=13 ...
		
		if(this.j > this.level.getGridHeight())
			this.die();
	},
	collides: function(is, ie, js, je, blocking) { ///충돌체크
		
		var isHero = this instanceof Hero;
		
		if(is < 0 || ie >= this.level.obstacles.length) //his.level.obstacles.length=레벨width값만큼의 장애물
			return true;
			
		if(js < 0 || je >= this.level.getGridHeight())
			return false;
		//width값보다 크면 실행하지 않음	
		//console.log("is="+is+",,ie="+ie+",,js="+js+",,je="+je);	
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
				break;
			}
			
			t -= dy;
		}
		
						
		///// move 함수에서 사용하는 모든변수 확인
		/*
		console.log("vx="+vx+",,vy="+vy);
		console.log("dx="+dx+",,dy="+dy);
		console.log("x(위치값)="+x+",,y(위치값)="+y);
		
		console.log("is="+is+",,ie="+ie);
		console.log("js="+js+",,je="+je);
		console.log("d="+d+",,b="+b);
		
		console.log("t="+t+",,onground="+onground);
		console.log("-------------------");
	
		//------------------------------------------
			
		console.log("-----")
		 */
		onground = true; //강제 지정 
		this.onground = onground;
		this.setVelocity(vx, vy);
		//this.setPosition(x, y);
	},
});

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
		//console.log("deathBeginWait,deathFrames,deathStepUp--"+this.deathBeginWait+","+this.deathFrames+","+this.deathStepUp);
		//console.log("x,y--"+x+","+y);
	},
	setCoins: function(coins){ // 코인
		this.coins = coins;
		
		if(this.coins >= constants.max_coins) {
			this.addLife()
			this.coins -= constants.max_coins;
		}
				
		this.level.world.parent().children('#coinNumber').text(this.coins);
	},
	setMarioState: function(state) {//마리오 상태
		this.marioState = state;
	},
	setLifes:  function(lifes) { // 마리오 생명수
		this.lifes = lifes;
		this.level.world.parent().children('#liveNumber').text(this.lifes);
	},
	/////////////////////////////////////////////
	input: function(keys) { // 마리오 키방향으로 움직임 메소드
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
	move: function() {
		//console.log('mario move --------');
		this.input(keys);
		this._super();
	},
	walk: function(reverse, fast) {
		this.vx = constants.walking_v * (fast ? 2 : 1) * (reverse ? - 1 : 1); //방향 및 속도
		console.log(this.vx);
	},
	walkRight: function() {
		if(this.state === size_states.small) {
			if(!this.setupFrames(8, 2, true, 'WalkRightSmall'))
				this.setImage(images.sprites, 0, 0);
		} else {
			
			if(!this.setupFrames(9, 2, true, 'WalkRightBig'))
				this.setImage(images.sprites, 0, 243);
		}
		console.log("walkRight");
	},
	walkLeft: function() {
		if(this.state === size_states.small) {
			if(!this.setupFrames(8, 2, false, 'WalkLeftSmall'))
				this.setImage(images.sprites, 80, 81);
		} else {
			if(!this.setupFrames(9, 2, false, 'WalkLeftBig'))
				this.setImage(images.sprites, 81, 162);
		}
		console.log("walkLeft");
	},
	setVelocity: function(vx, vy) {
		//console.log(this.onground); 
		if(this.crouching) {
			vx = 0;
			this.crouch();
		} else {
			if(this.onground && vx > 0) //땅위에 있고, 속도가 + 값일때
				this.walkRight();
			else if(this.onground && vx < 0) //땅위에 있고, 속도가 -값일때
				this.walkLeft();
			else{
				this.stand();
				//console.log('mario stand');
			}	
		}
	
		this._super(vx, vy);
	},
	stand: function() {
		var coords = this.standSprites[this.state - 1][this.direction === directions.left ? 0 : 1][this.onground ? 0 : 1];
		this.setImage(images.sprites, coords.x, coords.y);
		this.clearFrames();
	}
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
		//this.coinGauge = new Gauge('coin', 0, 0, 10, 4, true);
		//this.liveGauge = new Gauge('live', 0, 430, 6, 6, true);
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
			
			this.obstacles.push(t);//만약 width=100,height=10 이라면 obstacles[장애물]변수는 obstacles[100][10] 2차원 배열을 가짐
		}
		
		for(var i = 0, width = data.length; i < width; i++) {
			var col = data[i];
			
			for(var j = 0, height = col.length; j < height; j++) {
				////Class 객체상속시 객체이름=ref_name 값을 넘겨주면 reflection 변수에 Class가 reference됨
				// Mario 변수는 Base 객체를 호출하므로 Class도 호출하게 된다
				if(reflection[col[j]]){ console.log("col[j]--"+col[j]);
					//left->right,top->bottom 형태로 위치값 생성
					new (reflection[col[j]])(i * 32, (height - j - 1) * 32, this); //ref_name과 위치 값을 가진 인스턴스생성
				}	
				
			}
		}
		/**/
	},
	
	tick: function() {
		
		var i = 0, j = 0, figure, opponent;

		for(i = this.figures.length; i--; ) {// 인형(움직이는것)만 호출한다,
			figure = this.figures[i];							
			
			if(!figure.dead) {
				figure.move();
				//figure.playFrame();
			  //console.log("----------------figure loop exit----------------");
			}
			//console.log("----------------figure loop exit----------------");
		}
		
		//this.coinGauge.playFrame(); //코인 프레임
	},
	start: function() {
		var me = this;
		/**/
		me.loop = setInterval(function() {
			me.tick.apply(me);
		}, constants.interval);
		
		
		var j=30;
		for(j = 2; j--; ) {
			me.tick.apply(me);
			console.log("----------------["+j+"]tick exit----------------");
		}
		/**/
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