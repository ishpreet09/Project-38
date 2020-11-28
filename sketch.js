var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  //gameOverImg = loadImage("gameOver.png");
  //restartImg = loadImage("restart.png");

  backgroundImg=loadImage("BackgroundImg.png");

  trophie2=loadImage("Trophie.jpg");
  back2=loadImage("white.png");

  score2=loadImage("GOOD.jpg");
  button=loadImage("cross.png");
}

function setup() {
  createCanvas(600, 200);
  
  score = 0;
  
  back=createSprite(180,100,20,200);
  back.addImage(backgroundImg);
  back.scale=5;
  back.x = back.width/2;
  back.velocityX = -(6 + 3*score/100);

  trex = createSprite(50,200,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  //ground.visible=false;
  ground.x = ground.width/2;
  ground.velocityX = -(6 + 3*score/100);


 // gameOver = createSprite(300,100);
//  gameOver.addImage(gameOverImg);
  
 // restart = createSprite(300,140);
  //restart.addImage(restartImg);

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  white=createSprite(300,100);
  white.addImage(back2);
  white.scale=0.5;

  trophie=createSprite(300,70);
  trophie.addImage(trophie2);
  trophie.scale=0.1;
  
  count=createSprite(300,140);
  count.addImage(score2);

  cross=createSprite(370,30);
  cross.addImage(button);

  count.scale = 0.15;
  cross.scale = 0.025;

  white.visible=false;
  trophie.visible=false;
  count.visible=false;
  cross.visible = false;
 // restart.visible = false;
  
  invisibleGround = createSprite(200,200,400,10);
  invisibleGround.visible = false;
  
  
}

function draw() {
  //trex.debug = true;
  //background(255);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    back.velocityX = -(6 + 3*score/100);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
      back.x=back.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    cross.visible = true;
    trophie.visible=true;
    //restart.visible = true;
    white.visible = true;
    count.visible=true;
    text(count+score,320,170);

    //set velcity of each game object to 0
    back.velocityX = 0;
     ground.velocityX=0;   
     trex.velocityY=0;
     trex.visible=false;
     obstaclesGroup.setVisibleEach(false);
     cloudsGroup.setVisibleEach(false);
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
   obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(cross)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
    if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
   
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  
    if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,170,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  white.visible = false;
  trophie.visible = false;
  count.visible=false;
  cross.visible=false;
  trex.visible=true;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  

  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}