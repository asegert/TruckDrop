var TruckDrop = TruckDrop || {};

TruckDrop.StoryState = {
    create: function ()
    {
        //If TruckDrop.currLevel is undefined the story stage is being run for the first time
        if(TruckDrop.currLevel === undefined)
        {
            TruckDrop.currLevel=0;
            this.add.sprite(0, 0, 'story');
        
            this.climber = this.add.sprite(500, 0, 'climber');
            this.climber.animations.add('climb');
            this.climber.animations.play('climb', 2, false);
        
            //Create the truck (player)
            this.truck = this.add.sprite(250, -20, 'truck');
            this.truck.animations.add('roll');
            this.truck.animations.play('roll', 5, true);
            this.truck.anchor.setTo(0.9, 0.9);
        
            this.parachute = this.add.sprite(-170, -235, 'parachute');
            this.truck.addChild(this.parachute);
        
            var fallTween = this.add.tween(this.truck).to({y: 1000}, 4000, "Linear", true);
            fallTween.onComplete.add(function()
            {
                this.add.sprite(0, 50, 'title');
            }, this);
        
            this.start = this.add.button(700, 500, 'start', function()
            {
                this.game.state.start('Story');
            }, this);
            this.start.scale.setTo(0.5, 0.5);
        }
        //Otherwise it is the second time and the instructions should be shown
        else
        {
            this.add.sprite(0, 0, 'instructions');
            
            this.start = this.add.button(570, 480, 'start', function()
            {
                this.game.state.start('Transition');
            }, this);
            this.start.scale.setTo(0.5, 0.5);
        }
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/