var TruckDrop = TruckDrop || {};

TruckDrop.GameState = {
    create: function ()
    {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);

        let map = this.add.tilemap('hills');    
        map.addTilesetImage('sandSprite', 'sandSprite');
        map.setCollision(1);
        map.setCollision(2);
        map.setCollision(3);
        map.setCollision(4);
        this.hill = map.createLayer('collision');   
        this.hill.resizeWorld();
        
        this.game.slopes.convertTilemapLayer(this.hill, {
            2:  'FULL',
            4:  'HALF_BOTTOM_Left'
        });
        
        
        
        
        
        
        
        
        
        this.truck = this.add.sprite(500, 5, 'truck');
        this.truck.animations.add('roll');
        this.truck.animations.play('roll', 5, true);
        
        this.physics.enable(this.truck, Phaser.Physics.ARCADE);
        this.truck.body.gravity.y = 100;
        this.truck.body.gravity.x = 0.5;
 
this.game.slopes.enable(this.truck);
this.game.camera.follow(this.truck);
    },
    ground: function(ground, truck)
    {
        console.log('hiy');
    },
    update: function ()
    {
       this.game.physics.arcade.collide(this.truck, this.hill);
        // this.game.physics.arcade.collide(this.hill, this.truck, this.ground, null, this);
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