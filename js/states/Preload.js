var TruckDrop = TruckDrop || {};

TruckDrop.PreloadState = {
    preload: function ()
    {
        var preloadBG = this.add.sprite((this.world.width - 580) * 0.5, (this.world.height + 150) * 0.5, 'loading-background');
        var preloadProgress = this.add.sprite((this.world.width - 540) * 0.5, (this.world.height + 170) * 0.5, 'loading-progress');
        this.load.setPreloadSprite(preloadProgress);

        this.load.image('bomb', 'assets/images/bomb.png');
        this.load.image('emptyHeart', 'assets/images/heartEmpty.png');
        this.load.image('halfHeart', 'assets/images/heartHalf.png');
        this.load.image('fullHeart', 'assets/images/heartFull.png');
        this.load.image('gas', 'assets/images/gas.png');
        this.load.spritesheet('sandSprite', 'assets/images/sandSprite.png', 70, 70, 45);
        this.load.spritesheet('truck', 'assets/images/playerSnow.png', 117, 59, 5);
        
        this.load.tilemap('hillSand','assets/maps/hillSand.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('coinSand','assets/maps/coinSand.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('objectSand','assets/maps/objectSand.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('hillStone','assets/maps/hillStone.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('coinStone','assets/maps/coinStone.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('objectStone','assets/maps/objectStone.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('hillGrass','assets/maps/hillGrass.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('coinGrass','assets/maps/coinGrass.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('objectGrass','assets/maps/objectGrass.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('hillIce','assets/maps/hillIce.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('coinIce','assets/maps/coinIce.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('objectIce','assets/maps/objectIce.json', null, Phaser.Tilemap.TILED_JSON);
        
        this.load.tilemap('hillTest','assets/maps/hillTest.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('coinTest','assets/maps/testCoin.json', null, Phaser.Tilemap.TILED_JSON);
        
        this.load.text('truckDropData', 'assets/data/truckDropData.json');
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