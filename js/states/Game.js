var TruckDrop = TruckDrop || {};

TruckDrop.GameState = {
    create: function ()
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
        //Max Levels stored for calculation later
        TruckDrop.maxLevels = this.truckData.Levels.length;
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
                let bombThrow = this.add.sprite(-100, -100, 'bomb');
                bombThrow.alpha=0;
                this.truck.addChild(bombThrow);
                bombThrow.scale.setTo(0.2, 0.2);
                
                    let emitter = TruckDrop.GameState.add.emitter(bombThrow.x - 10, bombThrow.y - 10, 100);
                    emitter.makeParticles('bomb');
                    emitter.maxParticleScale = 0.2;
                    emitter.minParticleScale = 0.2;
                    emitter.start(true, 2000, null, 10);
                this.truck.addChild(emitter);
                this.truck.rotation = -1.6;
                this.parachute.alpha=0;
                //Make the truck jump
                let raiseTween = this.add.tween(this.truck).to({y: this.truck.y - 500}, 1000, "Linear", true);
                raiseTween.onComplete.add(function()
                {
                    this.truck.rotation = 0;
                    this.parachute.alpha = 1;
                    bombThrow.destroy();
                }, this);
            }
            //If there are no more bombs end the game
            else
            {
                TruckDrop.GameState.checkOver();
            }
        }, this);
        //Create text to indicate factors and fix them to camera
        this.continue.fixedToCamera = true;
        this.continueText = this.add.text(26, 575, this.bombs, {fill: "#FFFFFF", stroke: "#000000", strokeThickness: 5});
        this.continueText.fixedToCamera = true;
        this.scoreText = this.add.text(800, 5, `Score: ${this.score}`, {fill: "#FFFFFF", stroke: "#000000", strokeThickness: 5});
        this.scoreText.fixedToCamera = true;
        
        this.background = this.initMapLevel("BGTest", "TestBG", false);
        //Create map levels
        this.hill = this.initMapLevel(this.currLevelData.hill[0], this.currLevelData.hill[1], false);     
        
        let objectMapArray = this.initMapLevel(this.currLevelData.object[0], this.currLevelData.object[1], true);
        this.objectMap = objectMapArray[1];    
        this.object = objectMapArray[0];
        
        let coinMapArray = this.initMapLevel(this.currLevelData.coin[0], this.currLevelData.coin[1], true);
        this.coinMap = coinMapArray[1];    
        this.coin = coinMapArray[0];  

        //Create the truck (player)
        this.truck = this.add.sprite(300, 300, 'truck');
        this.truck.animations.add('roll');
        this.truck.animations.play('roll', 5, true);
        this.truck.anchor.setTo(0.9, 0.9);
        //Enable physics
        this.physics.enable(this.truck, Phaser.Physics.ARCADE);
        this.truck.body.gravity.y = this.currLevelData.truckGravityY;
        this.truck.body.gravity.x = this.currLevelData.truckGravityX;
        this.truck.body.collideWorldBounds=true;
        //Enable slopes and camera falling
        this.game.slopes.enable(this.truck);
        this.game.camera.follow(this.truck);
        
        this.parachute = this.add.sprite(-170, -235, 'parachute');
        this.truck.addChild(this.parachute);
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
        if(TruckDrop.GameState.currObject===null || object.index!=TruckDrop.GameState.currObject.index)
        {
            TruckDrop.GameState.currObject=object;
            //These are the object indices for the objects that will be collided with
            let three = [1, 2, 3, 4, 5, 6];
            let two = [19, 20, 21, 22, 24, 25, 26, 27];
            let one = [13, 14];
            //Stores the objects right most top corner for the object at each indices
            let indices = [1, 1, 1, 1, 1, 1, null, null, null, null, null, null, 14, 14, null, null, null, null, 19, 19, 19, 19, null, 24, 24, 24, 24];
            //Depending on the amount to be removed remove the current tile and other object tiles
            if(three.includes(object.index))
            {
                let startX = object.x + (indices[object.index] - object.index);
                let startY = object.index==indices[object.index]?object.y:object.index<indices[object.index]+3?object.y:object.y-1;
            
                TruckDrop.GameState.objectMap.removeTile(startX, startY);
                TruckDrop.GameState.objectMap.removeTile(startX + 1, startY);
                TruckDrop.GameState.objectMap.removeTile(startX + 2, startY);
                TruckDrop.GameState.objectMap.removeTile(startX, startY + 1);
                TruckDrop.GameState.objectMap.removeTile(startX + 1, startY + 1);
                TruckDrop.GameState.objectMap.removeTile(startX + 2, startY + 1);
                TruckDrop.GameState.currObject.index = -1;
            }
            else if(two.includes(object.index))
            {
                let startX = object.x + (indices[object.index] - object.index);
                let startY = object.index<indices[object.index]+2?object.y:object.y+1;
            
                TruckDrop.GameState.objectMap.removeTile(startX, startY);
                TruckDrop.GameState.objectMap.removeTile(startX + 1, startY);
                TruckDrop.GameState.objectMap.removeTile(startX, startY + 1);
                TruckDrop.GameState.objectMap.removeTile(startX + 1, startY + 1);
                TruckDrop.GameState.currObject.index = -1;
            }
            else if(one.includes(object.index))
            {
                let startX = object.x;
                let startY = object.index==indices[object.index]?object.y:object.index<indices[object.index]?object.y-1:object.y+1;
            
                TruckDrop.GameState.objectMap.removeTile(startX, startY);
                TruckDrop.GameState.objectMap.removeTile(startX, startY - 1);
                TruckDrop.GameState.currObject.index = -1;
            }
        //Reduce by half a heart and check that the truck is not out of lives
            if(TruckDrop.GameState.lives[TruckDrop.GameState.currlife].key === "fullHeart")
            {
                TruckDrop.GameState.lives[TruckDrop.GameState.currlife].loadTexture("emptyHeart");
            
                TruckDrop.GameState.currlife--;
            
                if(TruckDrop.GameState.currlife<0)
                {
                    TruckDrop.GameState.checkOver();
                }
            }
            truck.body.velocity.y = TruckDrop.GameState.runningVelocity;
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
                    TruckDrop.GameState.bombs++;
                    TruckDrop.GameState.continueText.setText(TruckDrop.GameState.bombs);
                }
                else if(TruckDrop.GameState.currLevelData.collectItems[i][1] === "end")
                {
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
        //If the truck has not rotated yet
        if(TruckDrop.GameState.endTween === undefined)
        {
            TruckDrop.GameState.parachute.alpha = 0;
            TruckDrop.GameState.endTween = TruckDrop.GameState.add.tween(truck).to({rotation: -0.7}, 1000, "Linear", true);
            TruckDrop.GameState.endTween.onComplete.add(function()
            {
                TruckDrop.GameState.add.tween(truck).to({x:1000}, 2000, "Linear", true);
            }, this);
            TruckDrop.GameState.checkOver();
        }
    },
    checkOver: function()
    {
        //Increase the level reset the end tween and launch the ending
        TruckDrop.currLevel++;
        this.endTween = undefined;
        this.state.start('End');
    },
    update: function ()
    {
        //Update gravity
        this.truck.body.gravity.y -=0.1;
        this.runningVelocity = this.truck.body.velocity.y;
        //Collisions
        this.game.physics.arcade.collide(this.truck, this.hill, this.tip);
        this.game.physics.arcade.collide(this.truck, this.object, this.hit);
        this.game.physics.arcade.overlap(this.truck, this.coin, this.collect);   
        
        if (this.game.input.mousePointer.isDown || !Phaser.Device.desktop)
        {   
            //Move right
            if(this.game.input.x>this.truck.x+5)
            {
                this.truck.x+=5;
            }
            //Move left
            else if(this.game.input.x<this.truck.x-5)
            {
                this.truck.x-=5;
            }

        }
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/