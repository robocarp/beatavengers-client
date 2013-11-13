/**
 * Created by hessj on 11/3/13.
 */
enchant();

var arrowsPerScreen =       9;
var fps =                   60;
var songStart =             false;
var startDelay =            2 * fps;
arrowStartDelay =           49.5;
var ARROWS_PER_SCREEN =     9; //Frames
var arrowStart =            false;
var scwidget;
var IMG_CONSOLE_BG =        "img/consoleBg.png";
var IMG_CONSOLE_ARROWS =    "img/consoleArrows.png";
var IMG_BEAT_ARROWS =       "img/ArrowsGlow.png";
var SND_BEAT_HIT =           "sound/hit2.mp3";
var POS_ARROW_UP =          1;
var POS_ARROW_DOWN =        2;
var POS_ARROW_LEFT =        0;
var POS_ARROW_RIGHT =       3;
var ARROW_GLOW_OFFSET =     29;
var UP_STATE =              false;
var DOWN_STATE =            false;
var LEFT_STATE =            false;
var RIGHT_STATE =           false;

window.onload = function() {
    var Local_Player_Input;
    init_Game();
    var game = enchant.Core.instance;
    scwidget = new SoundCloudHandler('https://soundcloud.com/darkbydesign-official/the-monster-beat-dbd-135bpm');

    game.onload = function(){
        this.arrowStart = null;
        var local_Console = new local_console(30,0, 'local');
        var remote_Console = new remote_console(600,0, 'remote');

        game.rootScene.addChild(local_Console);
        game.rootScene.addChild(remote_Console);
        game.rootScene.backgroundColor = '#080808';

        game.addEventListener("enterframe", function(){
            Local_Player_Input(local_Console);
            //Local_Player_Input(remote_Console);
            if(game.frame == startDelay){
                scwidget.startSong();
            }
            if(arrowStart && game.frame == startDelay){
                //*********BEAT**********\\
                setInterval(function(){
                    //game.assets[SND_BEAT_HIT].clone().play();
                    var arrowPose = Math.floor((Math.random()*4));
                    var beatarrow = new beatArrow(arrowPose, local_Console.x, local_Console.y);
                },1000/game.bpm*60);
            }
        });
        game.rootScene.addEventListener('startSong',function(){
            songStart = true;
            //arrowStart = true;
        });

        game.rootScene.addEventListener('songReady',function(){
            beginText();
            arrowStart = true;
            arrowStartDelay += game.frame + arrowStartDelay;
        });

        game.rootScene.addEventListener('songInfoLoaded',function(){
            var songTitle = new Label();
            songTitle.font = "13px Helvetica";
            songTitle.text = scwidget.getSongTitle();
            songTitle.color = "#f8b800";
            songTitle.x = 280;
            songTitle.y = 20;
            game.rootScene.addChild(songTitle);
        });
        game.rootScene.addEventListener(Event.DOWN_BUTTON_DOWN, function(){
            //game.assets["sound/hit2.mp3"].clone().play();
        });
    };
    game.start();

    // -------- Start Text -------- \\
    var beginText = enchant.Class.create(enchant.Sprite,{
        initialize: function(){
            enchant.Sprite.call(this,83 ,41);
            //this.image = game.assets["img/battleText.png"]; @TODO
            this.frame = 0;
            this.x = 92;
            this.y = 150;
            this.opacity = 0;
            game.rootScene.addChild(this);
            this.addEventListener("enterframe",function(){
                if(this.age < 60){
                    var _this = this;
                    this.tl.fadeIn(30).fadeOut(30).then(function(){_this.opacity=0;});
                }
                if(this.age == 60){
                  this.frame = 1;
                  this.opacity = 0;
                  this.tl.fadeIn(5).fadeOut(7).fadeIn(7).fadeOut(10);
                }
                if(this.age >= 95){
                    game.rootScene.removeChild(this);
                }
            });
        }
    });

    // ---------  Base Arrows Class---------- \\
    var ArrowBase = enchant.Class.create(enchant.Group,{
        initialize: function(x, y){
            enchant.Group.call(this);

            this.ArrowUp    = new arrow01(111 - ARROW_GLOW_OFFSET, 592 - ARROW_GLOW_OFFSET , POS_ARROW_UP);
            this.ArrowDown  = new arrow01(194 - ARROW_GLOW_OFFSET, 592 - ARROW_GLOW_OFFSET , POS_ARROW_DOWN);
            this.ArrowLeft  = new arrow01(25  - ARROW_GLOW_OFFSET, 592 - ARROW_GLOW_OFFSET , POS_ARROW_LEFT);
            this.ArrowRight = new arrow01(278 - ARROW_GLOW_OFFSET, 592 - ARROW_GLOW_OFFSET , POS_ARROW_RIGHT);

            this.addChild(this.ArrowUp);
            this.addChild(this.ArrowDown);
            this.addChild(this.ArrowLeft);
            this.addChild(this.ArrowRight);
        }
    });

// +------------------------------+
// |      CONSOLE CLASS           |
// +------------------------------+
    //----------- Button Event ------------------\\
    Local_Player_Input = function (ConsoleClass) {
        // BUTTON UP
        //var game = enchant.Core.instance;
        //ConsoleClass.addEventListener(Event.ENTER_FRAME, function () {
        if (game.input.up && !UP_STATE) {
            UP_STATE = true;
            ConsoleClass.arrowBase.ArrowUp.tl.fadeIn(3);
        }
        if (!game.input.up && UP_STATE) {
            UP_STATE = false;
            ConsoleClass.arrowBase.ArrowUp.tl.fadeOut(3);
        }
        if (game.input.down && !DOWN_STATE) {
            DOWN_STATE = true;
            ConsoleClass.arrowBase.ArrowDown.tl.fadeIn(3);
        }
        if (!game.input.down && DOWN_STATE) {
            DOWN_STATE = false;
            ConsoleClass.arrowBase.ArrowDown.tl.fadeOut(3);
        }
        if (game.input.left && !LEFT_STATE) {
            LEFT_STATE = true;
            ConsoleClass.arrowBase.ArrowLeft.tl.fadeIn(3);
        }
        if (!game.input.left && LEFT_STATE) {
            LEFT_STATE = false;
            ConsoleClass.arrowBase.ArrowLeft.tl.fadeOut(3);
        }
        if (game.input.right && !RIGHT_STATE) {
            RIGHT_STATE = true;
            ConsoleClass.arrowBase.ArrowRight.tl.fadeIn(3);
        }
        if (!game.input.right && RIGHT_STATE) {
            RIGHT_STATE = false;
            ConsoleClass.arrowBase.ArrowRight.tl.fadeOut(3);
        }
        //});
    };
    var console = enchant.Class.create(enchant.Group,{
        initialize: function(x,y, name){
            enchant.Group.call(this);
            this.name = name;
            this.x = x;
            this.y = y;
            var img_background = new enchant.Sprite(362,732);
            img_background.image = game.assets[IMG_CONSOLE_BG];
            this.addChild(img_background);
            this.arrowBase = ArrowBase();
            this.addChild(this.arrowBase);
        }
    });
    var local_console = enchant.Class.create(console,{
        initialize: function(x,y, name){
            console.call(this,x, y, name);
            /*this.addEventListener(Event.ENTER_FRAME, function(){
                Local_Player_Input(this)
            });*/
        }
    });
    var remote_console = enchant.Class.create(console,{
        initialize: function(x,y, name){
            console.call(this, x, y, name);
            /*this.addEventListener(Event.ENTER_FRAME, function(){
                Local_Player_Input(this)
            });*/
        }
    });




    //------------ Beat Arrow -------------------\\
    var beatArrow = enchant.Class.create(enchant.Sprite,{
        initialize: function(arrowPose, x, y){
            enchant.Sprite.call(this,35 ,35);
            this.arrow = new Arrow02(arrowPose);
            game.rootScene.addChild(this.arrow);
            if(arrowPose == POS_ARROW_LEFT){ // Left
                this.arrow.x= 25 + x;
            }
            if(arrowPose == POS_ARROW_UP){ // UP
                this.arrow.x= 109 + x;
            }
            if(arrowPose == POS_ARROW_DOWN){// Down
                this.arrow.x= 192 + x;
            }
            if(arrowPose == POS_ARROW_RIGHT){
                this.arrow.x=278 + x;
            }
            this.arrow.opacity=0;
            var _this = this;
            this.arrow.addEventListener("enterframe",function(){
                if(this.age == 1){
                    this.opacity = 0;
                    this.tl.setTimeBased();         // Set Time Based.
                    this.fpb = (1000/game.bpm*60*ARROWS_PER_SCREEN)-1040;  // Time Based
                    //this.fpb = (game.fps/(game.bpm/60)*9)-60.65;
                    this.tl.moveTo(this.x,592+ y,this.fpb).and().fadeIn(30);
                }
                if(Math.round(this.y) == 592+ y){
                    game.assets[SND_BEAT_HIT].clone().play();
                    game.rootScene.removeChild(this);
                }
            });
        }
    });

    //--------- Arrow 2 ----------------\\
    var Arrow02 = enchant.Class.create(enchant.Sprite,{
        initialize: function(arrowPose){
            enchant.Sprite.call(this,62,62);                    // init
            this.image = game.assets[IMG_BEAT_ARROWS];          // Assign Image
            this.frame = arrowPose;                             //
            this.fader = new Sprite(62,62);
            this.fader.image = game.assets[IMG_BEAT_ARROWS];
            this.fader.frame = arrowPose *4;
            this.tl.setFrameBased();
            this.fader.tl.setFrameBased();
            this.addEventListener("enterframe",function(){
                if(this.age % 12 == 0){
                    this.opacity = 1;
                    this.tl.fadeOut(12).fadeIn(12);
                    this.fader.tl.fadeIn(12).fadeOut(12);
                    this.frame += 4;
                }
            });

        }
    });
    var arrow01 = enchant.Class.create(enchant.Sprite,{
        initialize: function(x,y,position){
            enchant.Sprite.call(this,114 ,114);
            this.image = game.assets[IMG_CONSOLE_ARROWS];
            this.frame = position;
            this.x =        x;
            this.y =        y;
            this.opacity =  0;
        }

    });
};



function preLoadFiles(){
    var fileList = [];
    fileList.push(IMG_CONSOLE_BG);
    fileList.push(IMG_CONSOLE_ARROWS);
    fileList.push(SND_BEAT_HIT);
    fileList.push(IMG_BEAT_ARROWS);
    //fileList.push("img/Arrow.png");
    //fileList.push("img/battleText.png");
    //fileList.push("sound/hit2.mp3");
    return(fileList);
}
