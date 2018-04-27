var TruckDrop = TruckDrop || {};

TruckDrop.TransitionState = {
    create: function ()
    {
        this.add.sprite(0, 0, 'transition1');
        let truck = this.add.sprite(0, 500, 'trucks');
        truck.animations.add('roll');
        truck.animations.play('roll', 5, true);
        
        let roundText = this.add.text(300, 0, `Drop: ${TruckDrop.currLevel+1}`, {fill: '#00CC00', font: '120px ArialBold', stroke: '#00AA00', strokeThickness: 20});
        roundText.alpha=0;
        let textTween = this.add.tween(roundText).to({alpha: 1}, 500, "Linear", true, 0, -1);
        textTween.yoyo(true, 100);
        
        let startTween = this.add.tween(truck).to({x: 550}, 2000, "Linear", true);
        startTween.onComplete.add(function()
        {
            this.add.tween(truck).to({rotation: 0.8}, 400, "Linear", true);
            let midTween = this.add.tween(truck).to({x: 640}, 400, "Linear", true);
            midTween.onComplete.add(function()
            {
                let lastTween = this.add.tween(truck).to({x: 800, y: 700}, 1000, "Linear", true);
                lastTween.onComplete.add(function()
                {
                    this.game.state.start('Game');
                }, this);
            }, this);
        }, this);
        
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