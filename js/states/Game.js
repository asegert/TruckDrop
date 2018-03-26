var TruckDrop = TruckDrop || {};

TruckDrop.GameState = {
    create: function ()
    {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);
        //Number of bombs to be used to propel
        this.bombs = 1;
        //Score -> based off coins
        this.score = 0;
        //Current life in array
        this.currlife = 2;
        //Holds the life hearts
        this.lives = new Array();
        this.lives[0] = this.add.sprite(0, 20, 'fullHeart');
        this.lives[1] = this.add.sprite(60, 20, 'fullHeart');
        this.lives[2] = this.add.sprite(120, 20, 'fullHeart');
        //Fixes the lives to the camera
        this.lives[0].fixedToCamera = true;
        this.lives[1].fixedToCamera = true;
        this.lives[2].fixedToCamera = true;
        //Button to allow the truck to continue if the player has a bomb
        this.continue = this.add.button(0, 550, 'bomb', function()
        {
            if(this.bombs >0)
            {
                this.bombs--;
                this.continueText.setText(this.bombs);
            
                let tween = this.add.tween(this.truck).to({x: this.truck.x + 300, y: this.truck.y - 100}, 1000, "Linear", true);//fix
                tween.onComplete.add(function()
                {
                    this.truck.body.gravity.y = 100;
                    this.truck.body.gravity.x = 0.5;
                }, this);
            }
            else
            {
                console.log('GameOver');
            }
        }, this);
        
        this.continue.fixedToCamera = true;
        this.continueText = this.add.text(26, 575, this.bombs, {fill: "#FFFFFF", stroke: "#000000", strokeThickness: 5});
        this.continueText.fixedToCamera = true;
        this.scoreText = this.add.text(800, 5, `Score: ${this.score}`, {fill: "#FFFFFF", stroke: "#000000", strokeThickness: 5});
        this.scoreText.fixedToCamera = true;

        let map = this.add.tilemap('hills');                        //Maps to func pass var for this.coinMap
        map.addTilesetImage('sandSprite', 'sandSprite');
        map.setCollision(1);
        map.setCollision(2);
        map.setCollision(3);
        map.setCollision(4);
        this.hill = map.createLayer('HillLayer');   

        this.hill.resizeWorld();
        this.game.slopes.convertTilemapLayer(this.hill, {
            2:  'FULL',
            4:  'HALF_BOTTOM_Left'
        });
        
        let objectMap = this.add.tilemap('objects');    
        objectMap.addTilesetImage('sandSprite', 'sandSprite');
        objectMap.setCollision(5);
        objectMap.setCollision(6);
        objectMap.setCollision(7);
        objectMap.setCollision(8);
        objectMap.setCollision(9);
        objectMap.setCollision(10);
        objectMap.setCollision(11);
        objectMap.setCollision(12);
        objectMap.setCollision(13);
        objectMap.setCollision(14);
        objectMap.setCollision(15);
        objectMap.setCollision(16);
        objectMap.setCollision(17);
        this.object = objectMap.createLayer('ObjectLayer');  
        this.object.resizeWorld();
        this.game.slopes.convertTilemapLayer(this.object, {
            9:  'HALF_BOTTOM'
        });
        
        this.coinMap = this.add.tilemap('coins');    
        this.coinMap.addTilesetImage('sandSprite', 'sandSprite');
        this.coinMap.setCollision(5);
        this.coinMap.setCollision(6);
        this.coinMap.setCollision(7);
        this.coinMap.setCollision(8);
        this.coinMap.setCollision(9);
        this.coinMap.setCollision(10);
        this.coinMap.setCollision(11);
        this.coinMap.setCollision(12);
        this.coinMap.setCollision(13);
        this.coinMap.setCollision(14);
        this.coinMap.setCollision(15);
        this.coinMap.setCollision(16);
        this.coinMap.setCollision(17);
        this.coinMap.setCollision(18);
        this.coin = this.coinMap.createLayer('CoinLayer');  
        this.coin.resizeWorld();

        
        this.truck = this.add.sprite(350, 5, 'truck');
        this.truck.animations.add('roll');
        this.truck.animations.play('roll', 5, true);
        
        this.physics.enable(this.truck, Phaser.Physics.ARCADE);
        this.truck.body.gravity.y = 100;
        this.truck.body.gravity.x = 0.5;
 
        this.game.slopes.enable(this.truck);
        this.game.camera.follow(this.truck);
        this.world.bringToTop(this.continue);
        this.world.bringToTop(this.continueText);
        this.world.bringToTop(this.scoreText);
        this.world.bringToTop(this.lives[0]);
        this.world.bringToTop(this.lives[1]);
        this.world.bringToTop(this.lives[2]);
    },
    ground: function(truck, object)
    {
        console.log('stop');
        truck.body.gravity.x = 0;
        truck.body.gravity.y = 0;
        truck.body.velocity.x = 0;
        truck.body.velocity.y = 0;
        
        if(TruckDrop.GameState.lives[TruckDrop.GameState.currlife].key === "fullHeart")
        {
            TruckDrop.GameState.lives[TruckDrop.GameState.currlife].loadTexture("halfHeart");
        }
        else if(TruckDrop.GameState.lives[TruckDrop.GameState.currlife].key === "halfHeart")
        {
            TruckDrop.GameState.lives[TruckDrop.GameState.currlife].loadTexture("emptyHeart");
            
            TruckDrop.GameState.currlife--;
            
            if(TruckDrop.GameState.currlife<0)
            {
                console.log('GameOver');
            }
        }
    },
    collect: function(truck, coin)
    {
        if(coin.index===9)
        {
            console.log("silver");
            TruckDrop.GameState.score+=2;
            TruckDrop.GameState.scoreText.setText(`Score: ${TruckDrop.GameState.score}`);
        }
        else if(coin.index===7)
        {
            console.log("bronze");
            TruckDrop.GameState.score+=1;
            TruckDrop.GameState.scoreText.setText(`Score: ${TruckDrop.GameState.score}`);
        }
        else if(coin.index===18)
        {
            console.log("bomb");
            TruckDrop.GameState.bombs++;
            TruckDrop.GameState.continueText.setText(TruckDrop.GameState.bombs);
        }
        else if(coin.index===8)
        {
            console.log("gold");
            TruckDrop.GameState.score+=3;
            TruckDrop.GameState.scoreText.setText(`Score: ${TruckDrop.GameState.score}`);
        }
        else if(coin.index===17)
        {
            console.log("heart");
            
            if(TruckDrop.GameState.lives[TruckDrop.GameState.currlife].key === "fullHeart")
            {
                TruckDrop.GameState.currlife++;
                if(TruckDrop.GameState.currlife > 2)
                {
                    TruckDrop.GameState.currlife = 2;
                }
            }
                
            TruckDrop.GameState.lives[TruckDrop.GameState.currlife].loadTexture("fullHeart");
        }
        TruckDrop.GameState.coinMap.removeTile(coin.x, coin.y);
    },
    update: function ()
    {
        this.game.physics.arcade.collide(this.truck, this.hill);
        this.game.physics.arcade.collide(this.truck, this.object, this.ground);
        this.game.physics.arcade.overlap(this.truck, this.coin, this.collect);
        
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/