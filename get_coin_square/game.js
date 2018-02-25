var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    KEY_RIGHT = 39,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_DOWN = 40,
    rightPressed = false,
    leftPressed = false,
    upPressed = false,
    downPressed = false,
    player = null,
    color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    objectsMaps = new Map(),
    endGame = false,
    points=0;

function Square(x,y,size) {
    this.x = x;
    this.y = y;
    this.size = size
    this.color = color;
}
function Player(x,y,size,vel){
    Square.call(this,x,y,size,vel);
    this.vel = vel;
}
Player.prototype.draw = function(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y, this.size, this.size);
    ctx.fill();
}
Player.prototype.move = function(){
    if(rightPressed && this.x < canvas.width - this.size - 3 ) {
		this.x += this.vel;
	}
    if(leftPressed && this.x > 3) {
		this.x -= this.vel;
	}
    if(upPressed && this.y > 3){
        this.y -= this.vel;
    }
    if(downPressed && this.y < canvas.height - this.size - 3){
        this.y += this.vel;
    }
}
function Obstacle(x,y,size,velX,velY){
    Square.call(this,x,y,size);
    this.velX = velX;
    this.velY = velY;
}
Obstacle.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);        
    ctx.fillStyle = 'rgba(36,36,36,0.8)';
    ctx.fillRect(this.x + 10, this.y + 10, this.size - 20, this.size - 20);
    ctx.fill();
}
Obstacle.prototype.move = function() {
    if (this.x >= canvas.width - this.size) {
        this.velX = -(this.velX);
    }
    if(this.x <= 0) {
        this.velX = -(this.velX);
    }
    if(this.y >= canvas.height - this.size){
        this.velY = -(this.velY);
    }
    if(this.y <= 0){
        this.velY = -(this.velY);
    }

  this.x += this.velX;
  this.y += this.velY;
}
Obstacle.prototype.colision = function(){
    if (this.x < player.x + player.size && this.x + this.size > player.x && this.y < player.y + player.size && this.size + this.y > player.y) {
        endGame = true;
    }
}
Coin.prototype.colision = function(){
    if (this.x < player.x + player.size && this.x + this.size > player.x && this.y < player.y + player.size && this.size + this.y > player.y) {
        points += 100;
        //create a new coin
        coin = new Coin(random(50,750),random(50,550),16,random(0.1,0.5),random(0.1,0.5),0);
        objectsMaps.set('coin', coin); 
        //increase difficulty
        objectsMaps.forEach(function(value, key) {        
            if(key != 'coin'){
                value.size += random(1,3);
                value.velX += 0.3
                value.velY += 0.3
            }      
        });
    }
}
function Coin(x,y,size,velX,velY,timer){
    Square.call(this,x,y,size);
    this.velX = velX;
    this.velY = velY;
    this.timer = timer;
}   
Coin.prototype.draw = function() {
    ctx.fillStyle = 'rgba(255,255,0,1)';
    ctx.fillRect(this.x, this.y, this.size, this.size); 
    ctx.strokeStyle  = 'rgba(255,255,0,1)'; 
    ctx.strokeRect(this.x - 10, this.y - 10, this.size + 20, this.size + 20);
    ctx.fillStyle = 'rgba(255,255,0,0.3)';
    ctx.fillRect(this.x - 10, this.y - 10, this.size + 20, this.size + 20);
    ctx.fill();
}
Coin.prototype.move = function() {
    if (this.x >= canvas.width - this.size) {
        this.velX = -(this.velX);
    }
    if(this.x <= 0) {
        this.velX = -(this.velX);
    }
    if(this.y >= canvas.height - this.size){
        this.velY = -(this.velY);
    }
    if(this.y <= 0){
        this.velY = -(this.velY);
    }

  this.x += this.velX;
  this.y += this.velY;
}
function random(min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
	if(e.keyCode == KEY_RIGHT) {
		rightPressed = true;
	}
    if(e.keyCode == KEY_LEFT) {
		leftPressed = true;
	}
    if(e.keyCode == KEY_UP){
        upPressed = true;
    }
    if(e.keyCode == KEY_DOWN){
        downPressed = true;
    }
}

function keyUpHandler(e) {
	if(e.keyCode == KEY_RIGHT) {
		rightPressed = false;
	}
    if(e.keyCode == KEY_LEFT) {
		leftPressed = false;
	}
    if(e.keyCode == KEY_UP){
        upPressed = false;
    }
    if(e.keyCode == KEY_DOWN){
        downPressed = false;
    }
}

function init(){    
    player = new Player(canvas.width/2, canvas.height/2,32,6);
    for(var i=0;i < 4;i++){
        objectsMaps.set('obstacle'+i ,new Obstacle(random(0,300),random(0,500),random(42,76),random(1,3),random(1,3)));
    }
    coin = new Coin(random(50,750),random(50,550),16,random(0.1,0.5),random(0.1,0.5),0);
    objectsMaps.set('coin', coin);    
}

function gameLoop(){
   
    ctx.fillStyle = 'rgba(36,36,36,0.5)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = color;
    ctx.font = '28px serif';
    ctx.fillText('Points: '+points, 20, 30);

    player.draw();
    player.move();
    objectsMaps.forEach(function(value, key) {        
        value.draw();
        value.move();
        value.colision();      
    });
    if(!endGame){
        requestAnimationFrame(gameLoop);
    }
}
init();
gameLoop();