var TruckDrop = TruckDrop || {};

TruckDrop.PreloadState = {
    preload: function ()
    {
        var preloadBG = this.add.sprite((this.world.width - 580) * 0.5, (this.world.height + 150) * 0.5, 'loading-background');
        var preloadProgress = this.add.sprite((this.world.width - 540) * 0.5, (this.world.height + 170) * 0.5, 'loading-progress');
        this.load.setPreloadSprite(preloadProgress);

        this.load.image('hill', 'assets/images/hill.png');
        this.load.tilemap('hills','assets/hill.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('objects','assets/objects.json', null, Phaser.Tilemap.TILED_JSON);
        //this.load.spritesheet('tiles', 'assets/images/ninja-tiles64.png', 64, 64);
        this.load.spritesheet('sandSprite', 'assets/images/sandSprite.png', 70, 70, 16);
        this.load.spritesheet('truck', 'assets/images/player.png', 117, 59, 5);
    },
    create: function ()
    {
        this.state.start('Story');
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/