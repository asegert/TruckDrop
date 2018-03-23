var TruckDrop = TruckDrop || {};

TruckDrop.GameState = {
    create: function ()
    {
        this.hill = this.add.tileSprite(0, 0, 6400, 4480, 'hill');
    },
    update: function ()
    {
        if(this.hill.tilePosition.y > -3840)
        {this.hill.tilePosition.y -= 1.5;}
        if(this.hill.tilePosition.x > -5430)
        {this.hill.tilePosition.x -= 2.125;}
        
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/