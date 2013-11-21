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
var IMG_BEAT_LINE =         "img/consoleLine.png";
var IMG_START_TEXT =        "img/battleText.png";
var SND_BEAT_HIT =          "sound/hit2.mp3";
var POS_ARROW_UP =          1;
var POS_ARROW_DOWN =        2;
var POS_ARROW_LEFT =        0;
var POS_ARROW_RIGHT =       3;
var ARROW_GLOW_OFFSET =     29;
//var UP_STATE =              false;
//var DOWN_STATE =            false;
//var LEFT_STATE =            false;
//var RIGHT_STATE =           false;

window.onload = function() {
    //var Local_Player_Input;
    init_Game();
    var game = enchant.Core.instance;
    game.paused = false;
    scwidget = new SoundCloudHandler('https://soundcloud.com/darkbydesign-official/the-monster-beat-dbd-135bpm');

    game.onload = function(){
        scwidget.changeVolume(50);   //volume 0-100
        this.arrowStart = null;
        var local_Console = new local_console(30,0, 'local');
        var remote_Console = new remote_console(800,0, 'remote');

        game.rootScene.addChild(local_Console);
        game.rootScene.addChild(remote_Console);
        game.rootScene.backgroundColor = '#080808';
        game.Toggle_Pause = function(){
            if(!game.paused){
                scwidget.pauseSong();
                game.pause();
                game.paused = true;
            }else{
                scwidget.startSong();
                game.resume();
                game.paused = false;
            }
        };
        var beat = window.setInterval;
        game.addEventListener("enterframe", function(){
            if(game.frame == startDelay){
                scwidget.startSong();
            }
            if(arrowStart && game.frame == startDelay){
                //*********BEAT**********\\
                beat(function(){
                    //game.assets[SND_BEAT_HIT].clone().play();
                    if(!game.paused){
                        var arrowPose = Math.floor((Math.random()*4));
                        local_Console.spawnArrows(arrowPose);
                        remote_Console.spawnArrows(arrowPose);
                        var beat = new enchant.Event('beathit');
                        local_Console.dispatchEvent(beat);
                        remote_Console.dispatchEvent(beat);

                    }
                },1000/game.bpm*60);
            }
        });
        game.rootScene.addEventListener(enchant.Event.TOUCH_START,function(){
            game.Toggle_Pause();
            //window.clearInterval(beat);
        });
        game.rootScene.addEventListener('startSong',function(){
            songStart = true;
            //arrowStart = true;
        });

        game.rootScene.addEventListener('songReady',function(){
            //beginText();
            local_Console.StartText();
            remote_Console.StartText();
            arrowStart = true;
            arrowStartDelay += game.frame + arrowStartDelay;
        });

        game.rootScene.addEventListener('songInfoLoaded',function(){
            var songTitle = new Label();
            songTitle.font = "13px Helvetica";
            songTitle.textAlign = "center";
            songTitle.text = scwidget.getSongTitle();
            songTitle.color = "#f8b800";
            songTitle.x = 380;
            songTitle.y = 20;
            game.rootScene.addChild(songTitle);
        });

        this.rootScene.addEventListener(Event.DOWN_BUTTON_DOWN, function(){
            //game.assets["sound/hit2.mp3"].clone().play();
        });
    };
    game.start();

    // ---------  Base Arrows Class---------- \\
    var ArrowBase = enchant.Class.create(enchant.Group,{
        initialize: function(x, y){
            enchant.Group.call(this);

            this.ArrowUp    = new arrow01(111 - ARROW_GLOW_OFFSET, 592 - ARROW_GLOW_OFFSET , POS_ARROW_UP);
            this.ArrowDown  = new arrow01(194 - ARROW_GLOW_OFFSET, 592 - ARROW_GLOW_OFFSET , POS_ARROW_DOWN);
            this.ArrowLeft  = new arrow01(26  - ARROW_GLOW_OFFSET, 592 - ARROW_GLOW_OFFSET , POS_ARROW_LEFT);
            this.ArrowRight = new arrow01(278 - ARROW_GLOW_OFFSET, 592 - ARROW_GLOW_OFFSET , POS_ARROW_RIGHT);

            this.addChild(this.ArrowUp);
            this.addChild(this.ArrowDown);
            this.addChild(this.ArrowLeft);
            this.addChild(this.ArrowRight);
        }
    });

    //--------------- CONSOLE CLASS ----------------\\
    var console = enchant.Class.create(enchant.Group,{
        initialize: function(x,y, name){
            enchant.Group.call(this);
            this.name = name;
            this.x = x;
            this.y = y;
            this.input = null;
            this.width = 362;
            this.height = 732;
            var img_background = new enchant.Sprite(362,732);
            img_background.image = game.assets[IMG_CONSOLE_BG];
            var beatLine = new enchant.Sprite(373, 10);
            beatLine.y = 616;
            beatLine.image = game.assets[IMG_BEAT_LINE];
            this.addChild(img_background);
            this.arrowBase = ArrowBase();
            this.addChild(this.arrowBase);
            this.addChild(beatLine);
            var _this = this;
            this.SetInput = function(inputControler){
                this.input = inputControler;
            };
            this.spawnArrows = function(arrowPose){
                new beatArrow(arrowPose, this);
            };
            this.StartText = function(){
                var startText = new enchant.Sprite(166, 82);
                startText.image = game.assets[IMG_START_TEXT];
                startText.frame = 0;
                startText.x = this.width/2 - startText.width/2;
                startText.y = 260;
                startText.opacity = 1;
                this.addChild(startText);
                startText.tl.fadeIn(30).fadeOut(30).then(function(){
                    startText.opacity=0;
                    startText.frame = 1;
                    startText.tl.fadeIn(5).fadeOut(9).fadeIn(9).fadeOut(6).fadeIn(6).fadeOut(20).then(function(){
                        _this.removeChild(startText);
                    });
                });
            };
            this.addEventListener('beathit',function(){
                beatLine.opacity = 1;
                beatLine.scale = .99;
                var fadeout =game.actualFps * 60 / game.bpm;
                beatLine.tl.fadeOut(fadeout).and().scaleTo(.98,4).scaleTo(.99,4);
            })
        }
    });

    // -------------- LOCAL CONSOLE ---------------------\\
    var local_console = enchant.Class.create(console,{
        initialize: function(x,y, name){
            console.call(this,x, y, name);
            this.SetInput(Local_Player_Input);
            this.addEventListener(Event.ENTER_FRAME, function(){
                this.input(this);
            });
        }
    });

    // -------------- Remote CONSOLE ---------------------\\
    var remote_console = enchant.Class.create(console,{
        initialize: function(x,y, name){
            console.call(this, x, y, name);
            this.SetInput(Local_Player_Input);
            this.addEventListener(Event.ENTER_FRAME, function(){
                this.input(this);
            });
        }
    });


    //------------ Beat Arrow -------------------\\
    var beatArrow = enchant.Class.create(enchant.Sprite,{
        initialize: function(arrowPose, ConsoleClass){
            enchant.Sprite.call(this,35 ,35);
            this.arrow = new Arrow02(arrowPose);
            ConsoleClass.addChild(this.arrow);
            if(arrowPose == POS_ARROW_LEFT){ // Left
                this.arrow.x= 26;
            }
            if(arrowPose == POS_ARROW_UP){ // UP
                this.arrow.x= 109;
            }
            if(arrowPose == POS_ARROW_DOWN){// Down
                this.arrow.x= 192;
            }
            if(arrowPose == POS_ARROW_RIGHT){
                this.arrow.x=278;
            }
            this.arrow.opacity=0;

            this.arrow.addEventListener("enterframe",function(){
                if(this.age == 1){
                    this.opacity = 0;
                    this.tl.setTimeBased();         // Set Time Based.
                    this.fpb = (1000/game.bpm*60*ARROWS_PER_SCREEN)-1040;  // Time Based
                    //this.fpb = (game.fps/(game.bpm/60)*9)-60.65;
                    this.tl.moveTo(this.x,592,this.fpb).and().fadeIn(30);
                }
                if(Math.round(this.y) == 592){
                    //game.assets[SND_BEAT_HIT].clone().play();
                    ConsoleClass.removeChild(this);
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
    fileList.push(IMG_BEAT_LINE);
    fileList.push(IMG_START_TEXT);
    //fileList.push("img/battleText.png");
    //fileList.push("sound/hit2.mp3");
    return(fileList);
}
