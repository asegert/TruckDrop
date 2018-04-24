var TruckDrop = TruckDrop || {};

TruckDrop.GameState = {
    create: function ()//Try test cliff jump
    {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);
        //JSON Data
        this.truckData = JSON.parse(this.game.cache.getText('truckDropData'));
        //Level tracker
        this.currLevel=TruckDrop.currLevel;
        //Initialize the level
        this.initLevel();
        //Stores the object the truck is current;y coliding with
        this.currObject = null;
        //Stores the running velocity prior to colliding with the check
        this.runningVelocity = 0;
    },
    initLevel: function()
    {
        //Level Data
        this.currLevelData = this.truckData.Levels[this.currLevel];
        //Number of bombs to be used to propel
        this.bombs = this.currLevelData.bombs;
        //Score -> based off coins
        this.score = 0;
        //Indicates if truck is jumping over an obstacle
        this.jumping = false;
        //Indicates that the truck is falling off a 'cliff'
        this.falling = false;
        //Indicateds if a life adjustment has been made
        this.livAdjust = false;
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
                //Can require a hit again
                this.livAdjust=false;
                console.log("liv");
                this.jumping=true;
                //Use a bomb
                this.bombs--;
                this.continueText.setText(this.bombs);
                let bombThrow = this.add.sprite(TruckDrop.GameState.truck.x + 60, TruckDrop.GameState.truck.y - 20, 'bomb');
                bombThrow.scale.setTo(0.2, 0.2);
                let throwTween = this.add.tween(bombThrow).to({x: TruckDrop.GameState.currObject.worldX + 20, y: TruckDrop.GameState.currObject.worldY + 20}, 500, "Linear", true);
                throwTween.onComplete.add(function()
                {
                    bombThrow.destroy();
                    let emitter = TruckDrop.GameState.add.emitter(TruckDrop.GameState.currObject.worldX + 20, TruckDrop.GameState.currObject.worldY + 20, 100);
                    emitter.makeParticles('bomb');
                    emitter.maxParticleScale = 0.2;
                    emitter.minParticleScale = 0.2;
                    emitter.start(true, 2000, null, 10);

                    TruckDrop.GameState.objectMap.removeTile(TruckDrop.GameState.currObject.x, TruckDrop.GameState.currObject.y);
                    TruckDrop.GameState.currObject = null;
                    
                    this.time.events.add(Phaser.Timer.SECOND * 2, function()
                    {
                        TruckDrop.GameState.truck.body.velocity.x = 300;
                        TruckDrop.GameState.truck.body.gravity.y = TruckDrop.GameState.currLevelData.truckGravityY;
                        TruckDrop.GameState.truck.body.gravity.x = TruckDrop.GameState.currLevelData.truckGravityX;
                        //Reset rotate
                        TruckDrop.GameState.rotate = false;
                        TruckDrop.GameState.jumping = false;
                    }, this);
                }, this);
            }
            else if(this.jumping)
            {
                
            }
            else
            {
                console.log('GameOver no bombs button');
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
        this.hill = this.initMapLevel("hillTest", "TestHill", false);//this.currLevelData.hill[0], this.currLevelData.hill[1], false);     
        
        /*let objectMapArray = this.initMapLevel("coinTest", "NewTestCoin", true);//this.currLevelData.object[0], this.currLevelData.object[1], true);
        this.objectMap = objectMapArray[1];    
        this.object = objectMapArray[0];*/
        
        let coinMapArray = this.initMapLevel("coinTest", "TestCoin", true);//this.currLevelData.coin[0], this.currLevelData.coin[1], true);
        this.coinMap = coinMapArray[1];    
        this.coin = coinMapArray[0];  

        //Create the truck (player)
        this.truck = this.add.sprite(100, 5, 'truck');
        this.truck.animations.add('roll');
        this.truck.animations.play('roll', 5, true);
        this.truck.anchor.setTo(0.1, 0.1);
        //Enable physics
        this.physics.enable(this.truck, Phaser.Physics.ARCADE);
        this.truck.body.gravity.y = this.currLevelData.truckGravityY;
        this.truck.body.gravity.x = this.currLevelData.truckGravityX;
        this.truck.body.collideWorldBounds=true;
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
       for(let k=0, lngth = (TruckDrop.game.cache.getImage(this.currLevelData.tileset).width/TruckDrop.game.cache.getFrameCount(this.currLevelData.tileset)); k<lngth; k++)
        {
            //Set the collisions
            map.setCollision(k);
        }
        //Create the layer
        var layer = map.createLayer(layerName);
        layer.resizeWorld();
        //Add slope options see ninja tiles for specific slopes
        this.game.slopes.convertTilemapLayer(layer, {
            4:  'HALF_BOTTOM_Left',
            6:  'HALF_BOTTOM',
            9:  'HALF_BOTTOM',
            10:  'HALF_BOTTOM',
            11:  'HALF_BOTTOM',
            12:  'HALF_BOTTOM',
            15:  'HALF_BOTTOM',
            22:  'HALF_BOTTOM_Left',
            23:  'HALF_BOTTOM',
            24:  'HALF_BOTTOM',
            25:  'HALF_BOTTOM',
            26:  'HALF_BOTTOM',
            31:  'HALF_BOTTOM_Left',
            32:  'HALF_BOTTOM',
            33:  'HALF_BOTTOM',
            35:  'HALF_BOTTOM',
            40:  'HALF_BOTTOM_Left',
            41:  'HALF_BOTTOM',
            42:  'HALF_BOTTOM',
            43:  'HALF_BOTTOM',
            44:  'HALF_BOTTOM'
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
        TruckDrop.GameState.currObject=object;
        if(object.index === 6 && TruckDrop.GameState.truck.rotation === 0)
        {
            TruckDrop.GameState.falling = true;
            //console.log(TruckDrop.GameState.truck.body.velocity.x);
            TruckDrop.GameState.truck.body.velocity.x = TruckDrop.GameState.runningVelocity;
            TruckDrop.GameState.truck.rotation = 0;
            let fall = TruckDrop.GameState.add.tween(TruckDrop.GameState.truck).to({rotation: TruckDrop.GameState.currLevelData.rotation[1]}, (150000/TruckDrop.GameState.runningVelocity), "Linear", true);
            fall.onComplete.add(function()
            {
                TruckDrop.GameState.falling = false;
            }, this);
            //TruckDrop.GameState.rotate = true;
            TruckDrop.GameState.objectMap.removeTile(object.x, object.y);
            TruckDrop.GameState.currObject = null;
            console.log(TruckDrop.GameState.currObject);
        }
        else if(object.index === 6)
        {
            TruckDrop.GameState.objectMap.removeTile(object.x, object.y);
            TruckDrop.GameState.currObject = null;
            TruckDrop.GameState.truck.body.velocity.x = TruckDrop.GameState.runningVelocity;
        }
        else
        {
            if(TruckDrop.GameState.bombs < 1 && !TruckDrop.GameState.jumping)
            {
                truck.rotation=0;
                console.log('GameOver hit and no bolmbs');
                TruckDrop.GameState.checkOver();
            }
            else if(!TruckDrop.GameState.jumping)
            {
                truck.rotation=0;
                console.log(TruckDrop.GameState.livAdjust);
                //If the truck has no gravity it has just hit and the lives need to be affected
                if(truck.body.gravity.x !=0 && truck.body.gravity.y !=0 && !TruckDrop.GameState.livAdjust)
                {
                    console.log('lives');
                    TruckDrop.GameState.livAdjust = true
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
                            console.log('GameOver no lives');
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
                else if(TruckDrop.GameState.currLevelData.collectItems[i][1] === "end")
                {
                    console.log('GameOver hit end');
                    TruckDrop.GameState.checkOver();
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
        if(!TruckDrop.GameState.jumping)
        {
            //Reset the gravity, if the truck just passed an obstacle the gravity will be 3 times what it should be
            TruckDrop.GameState.truck.body.gravity.y = TruckDrop.GameState.currLevelData.truckGravityY;
            TruckDrop.GameState.truck.body.gravity.x = TruckDrop.GameState.currLevelData.truckGravityX;
            //If the hill is the incline rotate the truck to match the incline and set the rotate to true
            if(hill.index === TruckDrop.GameState.currLevelData.rotation[0])
            {
                console.log('hill');
                if(!TruckDrop.GameState.rotate && !TruckDrop.GameState.jumping)
                {
                    if(TruckDrop.GameState.truck.rotation === 0)
                    {
                        TruckDrop.GameState.add.tween(TruckDrop.GameState.truck).to({rotation: TruckDrop.GameState.currLevelData.rotation[1]}, 750, "Linear", true);
                        TruckDrop.GameState.rotate = true;
                    }
                }
            }
            //For any other piece of hill rotate back to 0 and switch rotate to false
            else if(!TruckDrop.GameState.falling)
            {
                console.log(hill.index);
                TruckDrop.GameState.add.tween(TruckDrop.GameState.truck).to({rotation: 0}, 1, "Linear", true);
                TruckDrop.GameState.rotate = false;
            }
        }
    },
    checkOver: function()
    {
        if(TruckDrop.GameState.currLevel === this.truckData.Levels.length-1)
        {
            console.log('GO');
            this.state.start('End');
        }
        else
        {
            TruckDrop.currLevel++;
            this.state.start('Game');
        }
    },
    update: function ()
    {
        //Collisions
        this.game.physics.arcade.collide(this.truck, this.hill, this.tip);
        this.game.physics.arcade.collide(this.truck, this.object, this.hit);
        this.game.physics.arcade.overlap(this.truck, this.coin, this.collect);   
        
        if(this.game.input.x>=480)
        {
            this.truck.x+=5;
            console.log('right');
        }
        else
        {
            this.truck.x-=5;
            console.log('left');
        }
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/