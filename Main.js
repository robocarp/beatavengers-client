/**
 * Created by hessj on 11/3/13.
 */
enchant();
var arrowsPerScreen = 9;
var fps = 60;
var songStart = false;
var startDelay = 2 * fps;
var arrowStartDelay = 49.5; //Frames
var arrowStart = false;
var scwidget;
var IMG_CONSOLE_BG = "img/consoleBg.png";
var IMG_CONSOLE_ARROWS = "img/consoleArrows.png";
var POS_ARROW_UP = 1;
var POS_ARROW_DOWN = 2;
var POS_ARROW_LEFT = 0;
var POS_ARROW_RIGHT = 3;
var ARROW_GLOW_OFFSET = 28;
var UP_STATE = false;
var DOWN_STATE = false;
var LEFT_STATE = false;
var RIGHT_STATE = false;

var init_Game = enchant.Class.create(enchant.Scene,{
    initialize: function(bpm){
        var game = new Core(1388, 732);
        game.rootScene.backgroundColor = "#f00";
        game.preload(preLoadFiles());
        game.fps = fps;
        game.bpm = 135;
    }
});

window.onload = function() {
    init_Game();
    var game = enchant.Core.instance;
    scwidget = new SoundCloudHandler('https://soundcloud.com/darkbydesign-official/the-monster-beat-dbd-135bpm');

    game.onload = function(){
        this.arrowStart = null;
        var local_Console = new console(30,0, 'local');
        var remote_Console = new console(600,0, 'remote');
        game.rootScene.addChild(remote_Console);
        game.rootScene.addChild(local_Console);





        var lastFrame;
        var fpb = Math.round(game.fps/(game.bpm/60));
        game.rootScene.backgroundColor = '#080808';

        game.addEventListener("enterframe", function(){

            if(game.frame == startDelay){
                scwidget.startSong();
            }
            if(game.frame > 1){
                var e = new enchant.Event("BeatHit");
                var nextBeat = game.frame % fpb;
                if(nextBeat < 8 ){
                    this.beatHit = true;

                }else{

                    this.beatHit = false;
                }
                game.rootScene.dispatchEvent(e);
                lastFrame = game.frame;
            }
            if(arrowStart && game.frame == arrowStartDelay){
                //*********BEAT**********\\
                setInterval(function(){
                    game.assets['sound/hit2.mp3'].clone().play();
                    var arrowPose = Math.floor((Math.random()*4)+1);
                    var beatarrow = new beatArrow(arrowPose);
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
            game.assets["sound/hit2.mp3"].clone().play();
        });
    };
    game.start();


// +------------------------------+
// |      CONSOLE CLASS           |
// +------------------------------+
    var console = enchant.Class.create(enchant.Sprite,{
        initialize: function(x,y, name){
            this.name = name;
            var _this = this;
            enchant.Sprite.call(this,362,732);
            var game = enchant.Core.instance;
            var img_background = new enchant.Sprite(362,732);
            img_background.x = x;
            img_background.y = y;
            img_background.image = game.assets[IMG_CONSOLE_BG];
            game.rootScene.addChild(img_background);
            this.arrowBase = new ArrowBase(x - ARROW_GLOW_OFFSET,592+ y - ARROW_GLOW_OFFSET,game);
            new Local_Player_Input(this);
           //game.pushScene(this);
        }
    });
// ---------  Base Arrows Class---------- \\
    var ArrowBase = enchant.Class.create(enchant.Sprite,{
        initialize: function(x, y, game){
            var game = enchant.Core.instance;
            this.ArrowUp    = new arrow01(x + 111 , y , POS_ARROW_UP);
            this.ArrowDown  = new arrow01(x + 194 , y , POS_ARROW_DOWN);
            this.ArrowLeft  = new arrow01(x + 26  , y , POS_ARROW_LEFT);
            this.ArrowRight = new arrow01(x + 278 , y , POS_ARROW_RIGHT);

            game.rootScene.addChild(this.ArrowUp);
            game.rootScene.addChild(this.ArrowDown);
            game.rootScene.addChild(this.ArrowLeft);
            game.rootScene.addChild(this.ArrowRight);

        }
    });

    var Local_Player_Input = function(ConsoleClass){
        // BUTTON UP
        var game = enchant.Core.instance;
        ConsoleClass.addEventListener(Event.UP_BUTTON_DOWN, function(){
            if(!UP_STATE){
                UP_STATE = true;
                ConsoleClass.arrowBase.ArrowUp.tl.fadeIn(3);
            }
        });
        ConsoleClass.addEventListener(Event.UP_BUTTON_UP, function(){
            if(UP_STATE){
                UP_STATE = false;
                ConsoleClass.arrowBase.ArrowUp.tl.fadeOut(3);
            }
        });
        //BUTTON DOWN
        ConsoleClass.addEventListener(Event.DOWN_BUTTON_DOWN, function(){
            if(!DOWN_STATE){
                DOWN_STATE = true;
                ConsoleClass.arrowBase.ArrowDown.tl.fadeIn(3);
            }
        });
        ConsoleClass.addEventListener(Event.DOWN_BUTTON_UP, function(){
            if(DOWN_STATE){
                DOWN_STATE = false;
                ConsoleClass.arrowBase.ArrowDown.tl.fadeOut(3);
            }
        });
        //BUTTON LEFT
        ConsoleClass.addEventListener(Event.LEFT_BUTTON_DOWN, function(){
            if(!LEFT_STATE){
                LEFT_STATE = true;
                ConsoleClass.arrowBase.ArrowLeft.tl.fadeIn(3);
            }
        });
        ConsoleClass.addEventListener(Event.LEFT_BUTTON_UP, function(){
            if(LEFT_STATE){
                LEFT_STATE = false;
                ConsoleClass.arrowBase.ArrowLeft.tl.fadeOut(3);
            }
        });
        //BUTTON Right
        ConsoleClass.addEventListener(Event.RIGHT_BUTTON_DOWN, function(){
            if(!RIGHT_STATE){
                RIGHT_STATE = true;
                ConsoleClass.arrowBase.ArrowRight.tl.fadeIn(3);
            }
        });
        ConsoleClass.addEventListener(Event.RIGHT_BUTTON_UP, function(){
            if(RIGHT_STATE){
                RIGHT_STATE = false;
                ConsoleClass.arrowBase.ArrowRight.tl.fadeOut(3);
            }
        });
    };
    var beatArrow = enchant.Class.create(enchant.Sprite,{
        initialize: function(arrowPose){
            enchant.Sprite.call(this,35 ,35);
            this.arrow = new Arrow02();
            if(arrowPose == 1){
                this.arrow.rotation = -90;
                this.arrow.x=56;
            }
            if(arrowPose == 2){
                this.arrow.rotation = -180;
                this.arrow.x=96;
            }
            if(arrowPose == 3){
                this.arrow.rotation = 0;
                this.arrow.x=136;
            }
            if(arrowPose == 4){
                this.arrow.rotation = 90;
                this.arrow.x=176;
            }
            this.arrow.opacity=0;
            game.rootScene.addChild(this.arrow);
            var _this = this;
            this.arrow.addEventListener("enterframe",function(){
                if(this.age == 1){
                    this.opacity = 0;
                    this.tl.setTimeBased();         // Set Time Based.
                    this.fpb = (1000/game.bpm*60*9)-1040;  // Time Based
                    //this.fpb = (game.fps/(game.bpm/60)*9)-60.65;
                    this.tl.moveTo(this.x,296,this.fpb).and().fadeIn(30);
                }
                if(Math.round(this.y) == 296){
                  //game.assets['sound/hit2.mp3'].clone().play();
                  game.rootScene.removeChild(this);
                }
            });
        }
    });

    //--------- Arrow 2 ----------------\\
    var Arrow02 = enchant.Class.create(enchant.Sprite,{
        initialize: function(arrowPose){
            this.startFrame = 1;
            enchant.Sprite.call(this,35 ,35);
            //this.image =       game.assets["img/ArrowGlow.png"]; @TODO
            this.fader = new Sprite(35,35);
            //this.fader.image=  game.assets["img/ArrowGlow.png"]; @TODO
            this.fader.frame = 1;
            this.tl.setFrameBased();
            this.fader.tl.setFrameBased();
            //game.rootScene.addChild(this);
            //game.rootScene.addChild(this.fader);
            this.addEventListener("enterframe",function(){
                if(this.age % 12 == 0){
                    this.frame = this.startFrame;
                    this.fader.frame = this.startFrame +1;
                    this.tl.fadeOut(6).fadeIn(6);
                    this.fader.tl.fadeIn(6).fadeOut(6);
                    this.startFrame += 1;
                    if(this.startFrame > 5){
                        this.startFrame =0;
                    }
                }
            });

        }
    });

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
    //fileList.push("img/Arrow.png");
    //fileList.push("img/battleText.png");
    //fileList.push("sound/hit2.mp3");
    return(fileList);
}
