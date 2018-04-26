var TruckDrop = TruckDrop || {};

TruckDrop.TransitionState = {
    create: function ()
    {
        this.add.sprite(0, 0, 'transition1');
        let truck = this.add.sprite(0, 500, 'trucks');
        truck.animations.add('roll');
        truck.animations.play('roll', 5, true);
        
        this.add.tween(truck).to({x: 500}, 2000, "Linear", true);
        
        let parachute=this.add.sprite(-160, -40, 'parasprite');
        parachute.rotation = -0.7;
        parachute.animations.add('open');
        parachute.alpha = 0;
        truck.addChild(parachute);
        
        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function()
        {
            parachute.alpha = 1;
            parachute.animations.play('open', 7, false);
        }, this);
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/