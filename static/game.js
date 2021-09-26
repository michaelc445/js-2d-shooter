let canvas;
let context;
let request_id;
let fpsInterval = 50;
let now;
let then = Date.now();
let start = Date.now();
let last_shot = Date.now();
let timer = 60;
let xhttp;


let items = {
    wooden_bow: {
        damage: 8,
        class: "weapon",
        crit_chance: .1,
        range: 100,
        //https://pixabay.com/vectors/arrow-bow-string-weapon-wood-153282/
        image: "static/images/wooden_bow.png",
        fire_rate: 2,
        rarity: -1,
        count: 1,
        ammo: 1000
        
    },
    crossbow: {
        damage: 12,
        class: "weapon",
        crit_chance: .1,
        range: 200,
        //https://pixabay.com/illustrations/crossbow-medieval-weapon-5912517/
        image: "static/images/crossbow.png",
        rarity: .7,
        fire_rate: 4,
        count: 1,
        ammo : 30
        
    },
    rifle: {
        damage: 15,
        class: "weapon",
        crit_chance: .2,
        range: 300,
        //https://www.clipartmax.com/download/m2H7K9K9m2i8b1b1_ak-47-clipart-png/
        image: "static/images/rifle.png",
        fire_rate: 7,
        rarity: .2,
        count: 1,
        ammo: 30
        
    }
}
let enemies_dict = {
    bat:{
        x: 0,
        y: 0,
        size : 1,
        width : 32,
        height: 48,
        frameX : 0,
        frameY : 0,
        xChange: 0,
        yChange :0,
        aggro : false,
        moveLeft : false,
        moveRight:false,
        moveUp : false,
        moveDown : false,
        score: 20,
        max_hp: 20,
        hp:20,
        image: "static/images/silverbat.png"
        
    },
    witch:{
        x: 0,
        y: 0,
        size : 1,
        width : 32,
        height: 48,
        frameX : 0,
        frameY : 0,
        xChange: 0,
        yChange :0,
        aggro : false,
        moveLeft : false,
        moveRight:false,
        moveUp : false,
        moveDown : false,
        score: 100,
        max_hp: 100,
        hp:100,
        image:"static/images/witch.png"
        
    }
}
let player = {
    x : 32,
    y : 433,
    hp : 100,
    frameX : 0,
    frameY : 0,
    size : 5,
    width : 32,
    height : 48,
    xChange : 0,
    yChange : 20,
    score: 0,
    last_hit: 0,
    inventory: {},
    hotbar: [],
    equipped: {weapon:items["wooden_bow"]}
    
}
player.inventory["wooden_bow"]=items["wooden_bow"];
let drops = [];
let bull_list = [];
let enemies = [];
let playerImage = new Image();
let ammo = player.inventory["wooden_bow"].ammo;
let backgroundImage = new Image();
let tilesPerRow = 8;
let tileSize = 32;
let background = [[[224,224,224,224,224,224,224,224,224,224,224,224,224,224,224,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,16,16,16,16,16,16,16,16,16,16,16,16,16,16,224],
    [224,224,224,224,224,224,224,224,224,224,224,224,224,224,224,224]],
    
    [[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,76,77,78,79,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,84,85,86,87,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,92,93,94,95,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,100,101,102,103,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]],
    [[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,85,86,87,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,93,94,95,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,101,102,103,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0],
    [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
    ]
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
var sound = new Audio("static/boomheadshot.mp3");
let ouch = new Audio("static/ouch.mp3");
document.addEventListener("DOMContentLoaded",init,false);

function init(){
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");
    load_images(["static/images/henryjones.png","static/images/JapaneseVillage.png"]);
    playerImage.src ="static/images/henryjones.png";
    backgroundImage.src="static/images/JapaneseVillage.png";
    window.addEventListener("keydown",activate,false);
    window.addEventListener("keyup",deactivate,false);
    draw();
}

function draw() {
    document.getElementById("hp").innerHTML = "Health points: "+String(player.hp);
    document.getElementById("score").innerHTML= "Score: "+String(Math.floor(player.score));
    document.getElementById("timer").innerHTML = "Timer: "+String(timer);
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now-then;
    if (elapsed <= fpsInterval){
        return;
    }
    
    then = now-(elapsed % fpsInterval);
    
    
    if(now-start >=1000){
        start = Date.now();
        timer -=1;
    }
    if(timer ===0){
        stop();
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //draw tiles
    for(let j =0; j < background.length-1; j++){
        for (let r = 0; r < 16; r += 1) {
            for (let c = 0; c < 16; c += 1) {
                let tile = background[j][r][c];
                if (tile >= 0) {
                    let tileRow = Math.floor(tile / tilesPerRow);
                    let tileCol = Math.floor(tile % tilesPerRow);
                    context.drawImage(backgroundImage,
                        tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                        c * tileSize, r * tileSize, tileSize, tileSize);
                }
            }
        }
    }
    //draw player
    context.drawImage(playerImage,player.width*player.frameX,player.height*player.frameY,player.width,player.height, player.x, player.y,player.width,player.height);
    
    if (moveLeft || moveRight || moveUp || moveDown){
        player.frameX +=1;
        player.frameX %=4;
    }
    context.font = "30px Ariel";
    context.strokeText(String(ammo),canvas.width-70,canvas.height-30);
    //create enemies
    
    if(enemies.length < 5){
        //choose random enemy to spawn
        let enemy_list = Object.keys(enemies_dict);
        let enemy_index = Math.floor(Math.random()*enemy_list.length);
        
        let enemy = {};
        //create new copy of enemy from dictionary
        //https://stackoverflow.com/questions/43963518/to-copy-the-values-from-one-dictionary-to-other-dictionary-in-javascript
        Object.assign(enemy,enemies_dict[enemy_list[enemy_index]]);
         
        enemy.x =randint(50,canvas.width-50);
        enemy.y =randint(50,canvas.width-50);
        let item_bool = true;
        let tile_x = Math.floor((enemy.x+enemy.width)/tileSize);
        let tile_y = Math.floor((enemy.y+enemy.height)/tileSize);
        for(let item of enemies){
            //using bullet_collides to check there isnt already an enemy in that position
            if(bullet_collides(enemy,item)){
                item_bool = false;
            }
            
        }
        if (item_bool && background[2][tile_y][tile_x]===-1){
            enemies.push(enemy);
        }
        
        
        
    }
    //player dies
    if (player.hp <= 0 ){
        stop();
        
    }
    //draw drops
    for(let d of drops){
        context.drawImage(d.image,d.x,d.y,30,30);
    }
    //draw hotbar
    let space = 0;
    let hotbar_x = 200;
    context.fillStyle= "white";
    for(let item of Object.keys(player.inventory)){
        if(player.equipped.weapon === items[item]){
            context.fillStyle = "yellow";
        }else{
            context.fillStyle = "white";
        }
        context.fillRect(hotbar_x,482,30,30);
        let hotbar_image = new Image(30,30);
        hotbar_image.src= items[item].image;
        context.drawImage(hotbar_image,hotbar_x,482,30,30);
        hotbar_x +=35;
    }
    //draw bullets
    for (let b of bull_list){
        context.fillStyle="red";
        context.fillRect(b.x,b.y,b.size,b.size);
        b.x = b.x + b.xChange*2;
        b.y = b.y + b.yChange*2;
        if(Math.abs(b.x - b.initial_x) >= player.equipped.weapon.range ||Math.abs(b.y - b.initial_y) >= player.equipped.weapon.range){
            let bullet_index = bull_list.indexOf(b);
            bull_list.splice(bullet_index,1);
        }
        //bullet collision
        for (let e of enemies){
            if (bullet_collides(b,e)){
                //random crit based on weapon
                let crit = false;
                let crit_rng = Math.random();
                if (crit_rng < player.equipped.weapon.crit_chance){
                    crit = true;
                    sound.play();
                }
                
                
                //remove bullet from list after it hits
                let enemy_index = enemies.indexOf(e);
                let bullet_index = bull_list.indexOf(b);
                bull_list.splice(bullet_index,1);

                let damage = player.equipped.weapon.damage;
                if (crit){
                    damage *=10;
                }

                enemies[enemy_index].hp -= damage
                if(e.hp <= 0){
                    timer +=2;
                    enemies.splice(enemy_index,1);
                    if(player.hp <90 && player.hp > 0){
                        player.hp += 10;
                    }else if (player.hp >= 90){
                        player.hp = 100;
                    }
                    player.score += e.score;
                    
                    for(let i of Object.keys(items)){
                        let rng = Math.random();
                        if(items[i].rarity*.95 <= rng && items[i].rarity*1.05 >= rng){
                            let new_item_image = new Image(30, 30);
                            new_item_image.src = items[i].image;
                            let new_item ={
                                item: i,
                                image: new_item_image,
                                x: e.x,
                                y: e.y,
                                ammo: 30
                            }
                            drops.push(new_item);
                        }
                    }

                }
                
                

            }
        }
    }
    //draw enemies/check distance from player
    for (let e of enemies){
        let distance = Math.sqrt(Math.pow((player.x-e.x),2)+Math.pow((player.y-e.y),2));
        
        if (distance < 200 ) {
            e.aggro = true;
        }
        else{
            e.aggro =false;
        }
        //monsters attacking
        if (distance < 10){
            if(now-player.last_hit >= 1000){
                player.hp -=10;
                ouch.play();
                player.last_hit = Date.now();
            }
            
        }
        //make aggro monsters chase player
        if(e.aggro){
            //control enemies frameY
            let rise = e.y-player.y;
            let run = e.x-player.x;
            if(Math.abs(rise)>= Math.abs(run)){
                if(rise > 0){
                    //frame up
                    e.frameY = 3;
                }else{
                    //frame down
                    e.frameY = 0;
                }
            }else{
                if(run > 0){
                    //frame left
                    e.frameY = 1;
                }else{
                    //frame right
                    e.frameY = 2;
                }
            }
            //deciding enemies xChange
            if (e.x< player.x){
                e.xChange = e.size;
                
            }else if (e.x> player.x){
                e.xChange = -e.size;
                
            }else{
                e.xChange = 0;
            }
            //deciding enemies yChange
            if(e.y < player.y){
                e.yChange = e.size;
                
            }else if ((e.y > player.y)){
                e.yChange = -e.size;
                
            }else{
                e.yChange = 0;
            }

            e.frameX = (e.frameX +1)%4;

            //checks if enemies next position is allowed 
            if( tile_collision(e)){
                
                e.y += e.yChange;
                e.x += e.xChange;
            }else{
                //if the future position is blocked, trying to find new path
                
                let current_x = Math.floor(e.x+e.width/tileSize);
                let current_y = Math.floor(e.y+e.height/tileSize);
                let left = Math.floor(((e.x+e.width)-e.size)/tileSize);
                let right = Math.floor(((e.x+e.width)+e.size)/tileSize);
                let up = Math.floor(((e.y+e.height)-e.size)/tileSize);
                let down = Math.floor(((e.y+e.height)+e.size)/tileSize);
                let future_x = Math.floor(((e.x+e.width)+e.xChange)/tileSize);
                let future_y = Math.floor(((e.y+e.height)+e.yChange)/tileSize);
                //if up or down is blocked
                if(background[2][up][current_x]!=-1 ||background[2][down][current_x]!=-1){

                    if(background[2][up][future_x]===-1 || background[2][down][future_x]===-1){
                        e.x += e.xChange;
                    }else{
                        e.x -= e.xChange;
                    }

                //if left or right are blocked    
                }else if(background[2][current_y][left]!=-1 ||background[2][current_y][right]!=-1){
                    
                    if(background[2][future_y][left]===-1 || background[2][future_y][right]===-1){
                        e.y += e.yChange;
                    }else{
                        e.y -= e.yChange;
                    }
                }
            }
            
        }
        
        
        let enemy_image = new Image(e.size,e.size);
        enemy_image.src=e.image;
        context.fillstyle = "red";
        let hp_width  = Math.floor((e.hp/e.max_hp)*e.width);
        //hp bars
        context.fillStyle="red";
        context.fillRect(e.x,e.y-10,hp_width,5);
        context.drawImage(enemy_image,e.width*e.frameX,e.height*e.frameY,e.width,e.height, e.x, e.y,e.width,e.height);
    
    }
    
    
    if(moveRight) {
        
        if(tile_collision(player)){
            player.x = player.x +player.xChange;
        }
        player.frameY = 2;
        
    }
    if (moveLeft) {
        if(tile_collision(player)){
            if (player.x + player.xChange>=32){
                player.x = player.x + player.xChange;
            }
        }
        player.frameY = 1;
    }
    if (moveUp) { 
        if(tile_collision(player)){
            player.y = player.y + player.yChange;
            
        }
        player.frameY = 3;
    
    }
    if (moveDown) {
        if(tile_collision(player)){
            player.y = player.y + player.yChange;
            
        }
        player.frameY = 0;
    }
}

function randint(min,max) {
    return Math.round(Math.random()*(max-min))+min;
}

function activate(event) {
    let key = event.key;
    let keyCode = event.keyCode;
    if( key === "ArrowLeft") {
        moveLeft = true;
        moveUp = false;
        moveDown = false;
        moveRight=false;
        player.xChange = -player.size;
        player.yChange = 0;
        
        
    } else if ( key === "ArrowRight"){
        moveRight=true;
        moveUp = false;
        moveDown = false;
        moveLeft = false;
        player.xChange = player.size;
        player.yChange = 0;
    } else if ( key === "ArrowUp"){
        moveUp = true;
        moveDown = false;
        moveRight=false;
        moveLeft = false;
        player.xChange = 0;
        player.yChange = -player.size;
    } else if ( key === "ArrowDown"){
        moveDown = true;
        moveUp = false;
        moveRight=false;
        moveLeft = false;
        player.xChange = 0;
        player.yChange = player.size;
    } else if (keyCode ===32){
        //todo add shooting
        let bullets = {
            initial_x : player.x,
            initial_y : player.y,
            x: player.x,
            y: player.y,
            size: 10,
            xChange: player.xChange,
            yChange: player.yChange
        }
        
        
        if(Date.now()-last_shot >= 1000/player.equipped.weapon.fire_rate && player.equipped.weapon.ammo >0){
            
            player.equipped.weapon.ammo -=1;
            ammo = player.equipped.weapon.ammo;
            last_shot = Date.now();

            bull_list.push(bullets);
        }
        
    } else if (keyCode ===13){
        for (let i of drops){
            if (player.x >= (i.x-50) && player.x <= (i.x+50) && player.y >= (i.y-50) && player.y <= (i.y+50)){
                if(player.inventory[i.item]){
                    player.inventory[i.item].count +=1;
                    player.inventory[i.item].ammo += 30;
                    if(player.equipped.weapon === i){
                        ammo += 30;
                    }
                    
                    
                }else{
                    player.inventory[i.item]= items[i.item];
                    
                }
                timer +=2;
                player.score += (1/items[i.item].rarity);
                drops.splice(drops.indexOf(i),1);
                
            }
        }
    }else if (keyCode ===49){
        let current_inv = Object.keys(player.inventory)
        player.equipped.weapon = items[current_inv[0]];
        ammo = player.inventory[current_inv[0]].ammo;
        
        
        
    }else if (keyCode ===50){
        let current_inv = Object.keys(player.inventory);
        if (current_inv.length >=2 && items[current_inv[1]].class ==="weapon"){
            player.equipped.weapon = items[current_inv[1]];
            ammo = player.inventory[current_inv[1]].ammo;
            
        }
        
    }else if (keyCode ===51){
        let current_inv = Object.keys(player.inventory);
        if (current_inv.length >=3 && items[current_inv[2]].class ==="weapon"){
            player.equipped.weapon = items[current_inv[2]];
            ammo = player.inventory[current_inv[2]].ammo;
            
        }

    }
}

function deactivate(event) {
    let key = event.key;
    let keyCode = event.keyCode;
    if( key === "ArrowLeft") {
        moveLeft = false;
        
    } else if ( key === "ArrowRight"){
        moveRight =false;
        
    } else if ( key === "ArrowUp"){
        moveUp = false;
        
    } else if ( key === "ArrowDown"){
        moveDown = false;
        
    }
}
function player_collides(a){
    if(player.x +player.size < a.x ||
        a.x + a.size < player.x ||
        player.y > a.y +a.size ||
        a.y > player.y + player.size) {
        return false;
    } else {
        return true;
    }
}
function bullet_collides(b,a){
    if (b.x+b.size < a.x || 
        a.x + a.width < b.x ||
        b.y > a.y +a.height ||
        a.y > b.y +b.size){
            return false;
        }else {
            return true;
        }
}
function tile_collision(p){
    
    let future_x = p.x+p.xChange;
    let future_y = p.y+p.yChange;
    let future_tile_x = Math.floor((future_x+p.width)/tileSize);
    let future_tile_y = Math.floor((future_y+p.height)/tileSize);
    if((0 <= future_tile_x <= 15) && (0 <= future_tile_y<= 15)){
        if(background[2][future_tile_y][future_tile_x]===-1){
            return true;
        }
        
    }return false;
}
function stop() {
    window.removeEventListener("keydown",activate,false);
    window.removeEventListener("keyup",deactivate,false);
    window.cancelAnimationFrame(request_id);
    let username = document.getElementById("username").innerHTML;
    let score_int = Math.floor(player.score)
    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange",leaderboard,false);
    xhttp.open("POST","https://cs1.ucc.ie/~mc68/cgi-bin/ca2/run.py/post_score",true);
    let data = JSON.stringify({username:username,
                                score: score_int});
    
    xhttp.send(data);


}
function leaderboard(){
    if(xhttp.readyState ===4){
        if(xhttp.status === 200){
            if(xhttp.responseText ==="success"){
                window.location.href  = "https://cs1.ucc.ie/~mc68/cgi-bin/ca2/run.py/leaderboard";
            }
            else{
                console.log("unsuccessful");
            }
            
            
        }
    }
    
}

async function load_images(urls) {
    let promises = [];
    for (let url of urls) {
        promises.push(new Promise(resolve => {
            let img = new Image();
            img.onload = resolve;
            img.src = url;
        }));
    }
    await Promise.all(promises); 
}
