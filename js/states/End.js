var TruckDrop = TruckDrop || {};

TruckDrop.EndState = {
    create: function ()
    {
        this.add.sprite(0, 0, 'endScreen');
        
        //Create the truck (player)
        this.truck = this.add.sprite(250, -20, 'truck');
        this.truck.animations.add('roll');
        this.truck.animations.play('roll', 5, true);
        this.truck.anchor.setTo(0.9, 0.9);
        
        this.parachute = this.add.sprite(-170, -235, 'parasprite');
        this.parachute.frame = 4;
        this.parachute.animations.add('repack');
        this.truck.addChild(this.parachute);
        
        this.fallTween = this.add.tween(this.truck).to({y: 610}, 4000, "Linear", true);
        this.fallTween.onComplete.add(function()
        {
            this.truck.rotation = -0.7;
            this.parachute.animations._anims.repack.reverseOnce();
            this.parachute.animations.play('repack', 10, false);
            this.parachute.animations._anims.repack.onComplete.add(function()
            {
                this.parachute.kill();
            }, this);
            this.add.tween(this.truck).to({x: 1500}, 5000, "Linear", true);
            this.add.text(250, 0, "You Win!!", {font: '100px Georgia', fill: '#FFFFFF', stroke: '#000000', strokeThickness: 5});
            this.coupon = this.add.sprite(500, 300, 'coupon');
            this.coupon.scale.setTo(0.001, 0.001);
            this.coupon.anchor.setTo(0.5, 0.5);
            this.add.tween(this.coupon.scale).to({x: 0.8, y: 0.8}, 2000, "Linear", true);
            
            if(TruckDrop.currLevel<TruckDrop.maxLevels)
            {
                this.continue = this.add.button(600, 450, 'start', function()
                {
                    this.state.start('Transition');
                }, this);
                this.continue.scale.setTo(0.8, 0.8);
            }
        }, this);
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/