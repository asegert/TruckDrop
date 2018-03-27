var TruckDrop = TruckDrop || {};

TruckDrop.GameState = {
    create: function ()
    {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);
        //JSON Data
        this.truckData = JSON.parse(this.game.cache.getText('truckDropData'));
        //Level tracker
        this.currLevel=0;
        //Initialize the level
        this.initLevel();
    },
    initLevel: function()
    {
        //Level Data
        this.currLevelData = this.truckData.Levels[this.currLevel];
        //Number of bombs to be used to propel
        this.bombs = this.currLevelData.bombs;
        //Score -> based off coins
        this.score = 0;
        //Current life in array
        this.currlife = this.currLevelData.lives-1;
        //Holds the life hearts
        this.lives = new Array();
        for(let i=0, len=this.currLevelData.lives; i<len; i++)
        {
            this.lives[i] = this.add.sprite(60*i, 20, 'fullHeart');
            //Fixes the lives to the camera
            this.lives[i].fixedToCamera = true;
        }
        //Button to allow the truck to continue if the player has a bomb
        this.continue = this.add.button(0, 550, 'bomb', function()
        {
            //If there are bombs to use
            if(this.bombs >0)
            {
                //Use a bomb
                this.bombs--;
                this.continueText.setText(this.bombs);
                //'Boost' over the object
                this.add.tween(this.truck).to({rotation: -0.4}, 100, "Linear", true);
                let tween = this.add.tween(this.truck).to({x: this.truck.x + 300, y: this.truck.y - 100}, 1000, "Linear", true);//fix
                tween.onComplete.add(function()
                {
                    //High fall speed
                    this.truck.body.gravity.y = this.currLevelData.truckGravityY * 3;
                    this.truck.body.gravity.x = this.currLevelData.truckGravityX * 3;
                    //Reset rotate
                    TruckDrop.GameState.rotate = false;
                }, this);
            }
            else
            {
                console.log('GameOver');
                TruckDrop.GameState.checkOver();
            }
        }, this);
        //Create text to indicate factors and fix them to camera
        this.continue.fixedToCamera = true;
        this.continueText = this.add.text(26, 575, this.bombs, {fill: "#FFFFFF", stroke: "#000000", strokeThickness: 5});
        this.continueText.fixedToCamera = true;
        this.scoreText = this.add.text(800, 5, `Score: ${this.score}`, {fill: "#FFFFFF", stroke: "#000000", strokeThickness: 5});
        this.scoreText.fixedToCamera = true;
        //Create map levels
        this.hill = this.initMapLevel(this.currLevelData.hill, 'HillLayer', false);     
        this.object = this.initMapLevel(this.currLevelData.object, 'ObjectLayer', false); 
        
        let coinMapArray = this.initMapLevel(this.currLevelData.coin, 'CoinLayer', true);
        this.coinMap = coinMapArray[1];    
        this.coin = coinMapArray[0];  

        //Create the truck (player)
        this.truck = this.add.sprite(100, 5, 'truck');
        this.truck.animations.add('roll');
        this.truck.animations.play('roll', 5, true);
        this.truck.anchor.setTo(0.1, 0.1);
        //Make the truck a button when at the start
        this.truck.inputEnabled=true;
        this.truck.events.onInputDown.add(function()
        {
            this.truck.body.velocity.x+=this.currLevelData.truckVelocity;
        }, this);
        //Enable physics
        this.physics.enable(this.truck, Phaser.Physics.ARCADE);
        this.truck.body.gravity.y = this.currLevelData.truckGravityY;
        this.truck.body.gravity.x = this.currLevelData.truckGravityX;
        //Enable slopes and camera falling
        this.game.slopes.enable(this.truck);
        this.game.camera.follow(this.truck);
        //Bring text and buttons to the top
        this.world.bringToTop(this.continue);
        this.world.bringToTop(this.continueText);
        this.world.bringToTop(this.scoreText);
        for(let i=0, len=this.currLevelData.lives; i<len; i++)
        {
            this.world.bringToTop(this.lives[i]);
        }
    },
    initMapLevel: function(mapName, layerName, map)
    {
        //Create the map
        map = this.add.tilemap (mapName);
        map.addTilesetImage(this.currLevelData.tileset, this.currLevelData.tileset);
        //Set the collisions
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
        //Create the layer
        var layer = map.createLayer(layerName);
        layer.resizeWorld();
        //Add slope options see ninja tiles for specific slopes
        this.game.slopes.convertTilemapLayer(layer, {
            2:  'FULL',
            4:  'HALF_BOTTOM_Left',
            9:  'HALF_BOTTOM',
            10:  'HALF_BOTTOM',
            11:  'HALF_BOTTOM'
        });
        //If the map should also be returned return an array containing both the layer and map
        if(map)
        {
            return [layer, map];
        }
        //Return the layer
        return layer;
    },
    hit: function(truck, object)
    {
        console.log('stop');
        if(TruckDrop.GameState.bombs < 1)
        {
            console.log('GameOver');
            TruckDrop.GameState.checkOver();
        }
        else
        {
            //If the truck has no gravity it has just hit and the lives need to be affected
            if(truck.body.gravity.x !=0 && truck.body.gravity.y !=0)
            {
                //Reduce by half a heart and check that the truck is not out of lives
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
                        TruckDrop.GameState.checkOver();
                    }
                }
            }
            //Turn off the truck's movement
            truck.body.gravity.x = 0;
            truck.body.gravity.y = 0;
            truck.body.velocity.x = 0;
            truck.body.velocity.y = 0;
        }
    },
    collect: function(truck, coin)
    {
        for(let i=0, len=TruckDrop.GameState.currLevelData.collectItems.length; i<len; i++)
        {
            //Note the indexes are related to the position in the spritesheet
            if(coin.index === TruckDrop.GameState.currLevelData.collectItems[i][0])
            {
                if(TruckDrop.GameState.currLevelData.collectItems[i][1] === "heart")
                {
                    console.log("heart");
            
                    if(TruckDrop.GameState.lives[TruckDrop.GameState.currlife].key === "fullHeart")
                    {
                        TruckDrop.GameState.currlife++;
                        if(TruckDrop.GameState.currlife > TruckDrop.GameState.currLevelData.lives-1)
                        {
                            TruckDrop.GameState.currlife = TruckDrop.GameState.currLevelData.lives-1;
                        }
                    }
                
                    TruckDrop.GameState.lives[TruckDrop.GameState.currlife].loadTexture("fullHeart");
                }
                else if(TruckDrop.GameState.currLevelData.collectItems[i][1] === "bomb")
                {
                    console.log("bomb");
                    TruckDrop.GameState.bombs++;
                    TruckDrop.GameState.continueText.setText(TruckDrop.GameState.bombs);
                }
                else
                {
                    TruckDrop.GameState.score+=TruckDrop.GameState.currLevelData.collectItems[i][1];
                    TruckDrop.GameState.scoreText.setText(`Score: ${TruckDrop.GameState.score}`);
                }
            }
        }
        //Remove the collected item
        TruckDrop.GameState.coinMap.removeTile(coin.x, coin.y);
    },
    tip: function(truck, hill)
    {
        //Reset the gravity, if the truck just passed an obstacle the gravity will be 3 times what it should be
        TruckDrop.GameState.truck.body.gravity.y = TruckDrop.GameState.currLevelData.truckGravityY;
        TruckDrop.GameState.truck.body.gravity.x = TruckDrop.GameState.currLevelData.truckGravityX;
        //If the hill is the incline rotate the truck to match the incline and set the rotate to true
        if(hill.index === TruckDrop.GameState.currLevelData.rotation[0])
        {
            console.log('hill');
            if(!TruckDrop.GameState.rotate)
            {
                TruckDrop.GameState.add.tween(TruckDrop.GameState.truck).to({rotation: TruckDrop.GameState.currLevelData.rotation[1]}, 750, "Linear", true);
                TruckDrop.GameState.rotate = true;
            }
        }
        //For any other piece of hill rotate back to 0 and switch rotate to false
        else
        {
           if(TruckDrop.GameState.rotate)
            {
                TruckDrop.GameState.add.tween(TruckDrop.GameState.truck).to({rotation: 0}, 1, "Linear", true);
                TruckDrop.GameState.rotate = false;
            } 
        }
    },
    checkOver: function()
    {
        if(this.currLevel === this.truckData.Levels.length-1)
        {
            console.log('GO');
            this.state.start('End');
        }
        else
        {
            for(let i=0, len=this.currLevelData.lives; i<len; i++)
            {
                this.lives[i].destroy();;
            }
            this.continue.destroy();
            this.continueText.destroy();
            this.scoreText.destroy(); 
            this.coin.destroy();
            this.truck.destroy();
    
            this.currLevel++;
            this.initLevel();
        }
    },
    update: function ()
    {
        //Collisions
        this.game.physics.arcade.collide(this.truck, this.hill, this.tip);
        this.game.physics.arcade.collide(this.truck, this.object, this.hit);
        this.game.physics.arcade.overlap(this.truck, this.coin, this.collect);    
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/