/**
 * Objeto descriptor de las direcciones
 * de movimiento
 * 
 * @type Object
 */
const Movement = {
	NONE : 0,
	LEFT : 1,
	RIGHT : 2,
	UP : 4,
	DOWN : 8
};

/**
 * Función constructora de la nave espacial
 * 
 * @param int x      Posición de la nave en el eje x
 * @param int y      Posición de la nave en el eje y
 * @param int width  Tamaño de la nave en el eje x
 * @param int height Tamaño de la nave en el eje y
 */
function Vaus(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

/**
 * Función constructora del proyectil
 * 
 * @param int x      Posición del proyectil en el eje x
 * @param int y      Posición del proyectil en el eje y
 * @param int radius Radio del proyectil
 * @param int dir    Dirección de movimiento del proyectil
 */
function Bullet(x, y, radius, dir) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.dir = Movement.NONE;
	this.speed = 6;
}

/**
 * Función constructora del juego
 * 
 * @param Canvas canvas  Canvas donde se dibujará el juego
 */
function Arkanoid(canvas) {
	const VAUS_WIDTH = 300;
	const VAUS_HEIGHT = 50;
	const BULLET_SIZE = 30;
	const BULLET_MAX_SPEED = 20;
	const BRICK_WIDTH = 150;
	const BRICK_HEIGHT = 30;
	const BRICK_QUANTITY = 7;
	let Lives = 10;


	this.init = function() {
		if(!canvas.getContext)
		{
			console.warn('Tu navegador no soporta canvas');
			return;
		}

		this.context = canvas.getContext('2d');
		this.pause = false;
		this.gameOver = false;
		this.GameStarted  = false;
		

		this.createElements();

		setInterval(() => {
			this.update();
			
			this.fullDraw();
		}, 20);
	}

	this.createElements = function() {
		
		this.bricks = [];
		for (let i = 0; i < BRICK_QUANTITY; i++) {
			this.bricks[i] = new Vaus( (i+1) * 200, 100, BRICK_WIDTH, BRICK_HEIGHT);
		}
		this.vaus = new Vaus(canvas.width / 2 - VAUS_WIDTH / 2, canvas.height - 150, VAUS_WIDTH, VAUS_HEIGHT);
		this.bullet = new Bullet(canvas.width / 2, canvas.height / 2, BULLET_SIZE, Movement.NONE);
	}

	this.drawBullet = function() {
		this.context.beginPath();
		this.context.arc(this.bullet.x, this.bullet.y + this.bullet.radius, this.bullet.radius, 0, 2 * Math.PI, false);
		this.context.fillStyle = 'yellow';
		this.context.fill();
	}

	this.drawBricks = function() {
		for (let i = 0; i < BRICK_QUANTITY; i++) {
			this.context.fillStyle = 'rgb(0,155,0)';
			this.context.fillRect(this.bricks[i].x, this.bricks[i].y, this.bricks[i].width, this.bricks[i].height);
		}
	}

	this.drawVaus = function() {
		this.context.fillStyle = 'rgb(155,110,5)';
		this.context.fillRect(this.vaus.x, this.vaus.y, this.vaus.width, this.vaus.height);
	}

	this.printLives = function (Lives) {
		this.context.fillStyle = 'rgb(0,255,255)';
		this.context.font = 'bold 20px Arial';
		this.context.fillText('Lives: '+Lives, canvas.width - 100, 50 );
	}

	this.fullDraw = function() {
		this.context.clearRect(0, 0, canvas.width, canvas.height);
		canvas.style.cursor = "none";
		this.context.fillStyle = 'rgb(0,10,0)';
		this.context.fillRect(0, 0, canvas.width, canvas.height);
		this.drawBricks();
		this.drawBullet();
		this.drawVaus();
		this.printLives(Lives);
		if(this.gameOver){
			this.writeText('Game Over');
		}
		if (this.pause) {
			this.printLives(Lives);
			
		}
	
	}

	this.update = function() {
		
		if (this.gameOver) {
			return;
		}

		if (this.pause) {
			this.pause = false;
			this.createElements();
			this.update();
			return;
		}
			
		this.moveBullet();
		this.vausCollision();
		this.edgeCollisions();	
		this.bricksCollision();	
	}
	//bullet movement
	this.moveBullet = function () {
		
		if (this.bullet.dir & Movement.RIGHT) 
			this.bullet.x += this.bullet.speed;
		else if (this.bullet.dir & Movement.LEFT) 
			this.bullet.x -= this.bullet.speed;

		if (this.bullet.dir & Movement.UP)
			this.bullet.y -= this.bullet.speed;
		else if (this.bullet.dir & Movement.DOWN) 
			this.bullet.y += this.bullet.speed;
	}

	this.vausCollision = function () {
		//Vaus collision
		if ((this.bullet.x + this.bullet.radius > this.vaus.x && this.bullet.x - this.bullet.radius < this.vaus.x + this.vaus.width) &&
			(this.bullet.y + (this.bullet.radius*2) > this.vaus.y)) {
			if (this.bullet.speed < BULLET_MAX_SPEED)
				this.bullet.speed += 0.5;
			if (this.bullet.dir & Movement.DOWN) {
				this.bullet.dir = this.bullet.dir - Movement.DOWN + Movement.UP;
			} else if (this.bullet.dir & Movement.UP) {
			 	this.bullet.dir = this.bullet.dir - Movement.UP + Movement.DOWN;
			}
		}
				
	}
	this.bricksCollision = function () {
		//bricks collision
		
		for (let i = 0; i < BRICK_QUANTITY; i++) {
			if ((this.bullet.x + this.bullet.radius > this.bricks[i].x && this.bullet.x - this.bullet.radius < this.bricks[i].x + this.bricks[i].width) &&
				(this.bullet.y + this.bullet.radius - (BRICK_HEIGHT*2) < this.bricks[i].y )) {
				console.log("Has Touched: brick "+i);
				this.bricks[i] = [];
				if (this.bullet.speed < BULLET_MAX_SPEED)
					this.bullet.speed += 0.5;
				if (this.bullet.dir & Movement.DOWN) {
					this.bullet.dir = this.bullet.dir - Movement.DOWN + Movement.UP;
				} else if (this.bullet.dir & Movement.UP) {
					this.bullet.dir = this.bullet.dir - Movement.UP + Movement.DOWN;
				}
			}

		}			
	}
	this.edgeCollisions = function () {
		//Edge canvas collisions
		if (this.bullet.x - this.bullet.radius < 0) {
			//this.bullet.x = this.bullet.radius;
			this.bullet.dir = this.bullet.dir - Movement.LEFT + Movement.RIGHT;
		}
		if (this.bullet.x + this.bullet.radius > canvas.width) {
			//this.bullet.x = canvas.width - this.bullet.radius;
			this.bullet.dir = this.bullet.dir - Movement.RIGHT + Movement.LEFT;
		}
		if (this.bullet.y  < 0) {
			//this.bullet.y = this.bullet.radius;
			this.bullet.dir = this.bullet.dir - Movement.UP + Movement.DOWN;
		}

		if (this.bullet.y + this.bullet.radius > canvas.height) {

			this.bullet.speed = 5;
			this.pause = true;
			if (Lives === 0) {
				this.gameOver = true;	
			}else {
				Lives--;
			}	
			
		}

		if (this.bullet.dir == Movement.NONE) {
			this.bullet.x = this.vaus.x + this.vaus.width / 2;
			this.bullet.y = this.vaus.y - this.bullet.radius * 2;
		}
	}

	this.writeText = function(text) {
		this.context.fillStyle = 'rgb(255,255,0)';
		this.context.font = 'bold 20px Arial';
		this.context.fillText(text, canvas.width / 2 - 40, canvas.height / 2);
	}
	

	this.startGame = function() {
		this.GameStarted = true;
		if (this.bullet.dir == Movement.NONE) {
			this.bullet.dir = Movement.RIGHT + Movement.UP;
		}
	}
	this.restartGame = function() {
		if (this.bullet.dir == Movement.NONE) {
			this.bullet.dir = Movement.RIGHT + Movement.UP;
		}
	}

	this.setVausPosition = function(x) {
		if (this.gameOver) return;
		if(this.pause) {
			return;
		}
		if (x < 0) x = 0;
		if (x > canvas.width - this.vaus.width) x = canvas.width - this.vaus.width;
		this.vaus.x = x;
	}
	
	this.setBricksPosition = function() {
		
	}

	document.addEventListener('mousemove', (event) => {
		this.setVausPosition(event.pageX);
	});

	document.addEventListener('click', () => {
		if(!this.GameStarted){
			this.startGame();
		}else{
			this.restartGame();
		}
		
	});
};
