var TruckDrop = TruckDrop || {};

TruckDrop.GameState = {
    create: function ()
    {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);

        let map = this.add.tilemap('hills');    
        map.addTilesetImage('sandSprite', 'sandSprite');
        //map.addTilesetImage('Objects', 'Objects');
        map.setCollision(1);
        map.setCollision(2);
        map.setCollision(3);
        map.setCollision(4);
        this.hill = map.createLayer('HillLayer');   
        
        //this.objectGroup = this.game.add.physicsGroup();
        //this.map.createFromTiles([11, 12, 13, 14, 15, 16, 17], 0, 'obstacle', this.hill, this.objectGroup);
        //this.objects = map.createLayer('ObjectLayer');   
        //this.objects.resizeWorld();
        this.hill.resizeWorld();
        this.game.slopes.convertTilemapLayer(this.hill, {
            2:  'FULL',
            4:  'HALF_BOTTOM_Left'
        });
        
        let objectMap = this.add.tilemap('objects');    
        objectMap.addTilesetImage('sandSprite', 'sandSprite');
        objectMap.setCollision(1);
        objectMap.setCollision(2);
        objectMap.setCollision(3);
        objectMap.setCollision(4);
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
        this.object = objectMap.createLayer('ObjectLayer');  
        this.object.resizeWorld();
        
        //this.objectGroup = this.game.add.physicsGroup();
        //this.map.createFromTiles([11, 12, 13, 14, 15, 16, 17], 0, 'obstacle', this.hill, this.objectGroup);
        //this.objects = map.createLayer('ObjectLayer');   
        //this.objects.resizeWorld();
        //this.object.resizeWorld();
        this.game.slopes.convertTilemapLayer(this.object, {
            9:  'HALF_BOTTOM'
        });
        
        
        
        
        
        
        
        
        this.truck = this.add.sprite(350, 5, 'truck');
        this.truck.animations.add('roll');
        this.truck.animations.play('roll', 5, true);
        
        this.physics.enable(this.truck, Phaser.Physics.ARCADE);
        this.truck.body.gravity.y = 100;
        this.truck.body.gravity.x = 0.5;
 
this.game.slopes.enable(this.truck);
this.game.camera.follow(this.truck);
    },
    ground: function(truck, object)
    {
        console.log('stop');
        truck.body.gravity.x = 0;
        truck.body.gravity.y = 0;
        truck.body.velocity.x = 0;
        truck.body.velocity.y = 0;
    },
    update: function ()
    {
        this.game.physics.arcade.collide(this.truck, this.hill);
        this.game.physics.arcade.collide(this.truck, this.object, this.ground);
        this.game.physics.arcade.collide(this.object, this.truck, this.ground, null, this);
        //0.75 -> 1.0625;
        /*if(this.hill.tilePosition.y > -3840)
        {this.hill.tilePosition.y -= 1.5;}
        if(this.hill.tilePosition.x > -5430)
        {this.hill.tilePosition.x -= 2.125;}*/
        
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/