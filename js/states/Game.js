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
            
                this.add.tween(this.truck).to({rotation: -0.4}, 100, "Linear", true);
                let tween = this.add.tween(this.truck).to({x: this.truck.x + 300, y: this.truck.y - 100}, 1000, "Linear", true);//fix
                tween.onComplete.add(function()
                {
                    this.truck.body.gravity.y = 300;
                    this.truck.body.gravity.x = 1.5;
                    TruckDrop.GameState.rotate = false;
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

        this.hill = this.initMapLevel('hills', 'HillLayer', false);     
        this.object = this.initMapLevel('objects', 'ObjectLayer', false); 
        
        let coinMapArray = this.initMapLevel('coins', 'CoinLayer', true);
        this.coinMap = coinMapArray[1];    
        this.coin = coinMapArray[0];  

        
        this.truck = this.add.sprite(420, 5, 'truck');
        this.truck.animations.add('roll');
        this.truck.animations.play('roll', 5, true);
        this.truck.anchor.setTo(0.1, 0.1);
        
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
    initMapLevel: function(mapName, layerName, map)
    {
        map = this.add.tilemap (mapName);
        map.addTilesetImage('sandSprite', 'sandSprite');
        map.setCollision(1);
        map.setCollision(2);
        map.setCollision(3);
        map.setCollision(4);
        map.setCollision(5);
        map.setCollision(6);
        map.setCollision(7);
        map.setCollision(8);
        map.setCollision(9);
        map.setCollision(10);
        map.setCollision(11);
        map.setCollision(12);
        map.setCollision(13);
        map.setCollision(14);
        map.setCollision(15);
        map.setCollision(16);
        map.setCollision(17);
        map.setCollision(18);
        
        var layer = map.createLayer(layerName);
        layer.resizeWorld();
        
        this.game.slopes.convertTilemapLayer(layer, {
            2:  'FULL',
            4:  'HALF_BOTTOM_Left',
            9:  'HALF_BOTTOM',
            10:  'HALF_BOTTOM',
            11:  'HALF_BOTTOM'
        });
        
        if(map)
        {
            return [layer, map];
        }
        
        return layer;
    },
    ground: function(truck, object)
    {
        console.log('stop');
        if(truck.body.gravity.x !=0 && truck.body.gravity.y !=0)
        {
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
        }
        truck.body.gravity.x = 0;
        truck.body.gravity.y = 0;
        truck.body.velocity.x = 0;
        truck.body.velocity.y = 0;
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
    tip: function(truck, hill)
    {
        TruckDrop.GameState.truck.body.gravity.y = 100;
        TruckDrop.GameState.truck.body.gravity.x = 0.5;
        
        if(hill.index === 4)
        {
            console.log('hill');
            if(!TruckDrop.GameState.rotate)
            {
                TruckDrop.GameState.add.tween(TruckDrop.GameState.truck).to({rotation: 0.7}, 1000, "Linear", true);
                TruckDrop.GameState.rotate = true;
            }
        }
        else
        {
           if(TruckDrop.GameState.rotate)
            {
                TruckDrop.GameState.add.tween(TruckDrop.GameState.truck).to({rotation: 0}, 1, "Linear", true);
                TruckDrop.GameState.rotate = false;
            } 
        }
    },
    update: function ()
    {
        this.game.physics.arcade.collide(this.truck, this.hill, this.tip);
        this.game.physics.arcade.collide(this.truck, this.object, this.ground);
        this.game.physics.arcade.overlap(this.truck, this.coin, this.collect);    
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/