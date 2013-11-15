/**
 * Created by hessj on 11/11/13.
 */

var init_Game = enchant.Class.create(enchant.Scene,{
    initialize: function(bpm){
        var game = new Core(1388, 732);
        game.rootScene.backgroundColor = "#411";
        game.preload(preLoadFiles());
        game.fps = fps;
        game.bpm = 135;
    }
});

//----------- Button Event ------------------\\
var Local_Player_Input = function (ConsoleClass) {
    // BUTTON UP
    var game = enchant.Core.instance;
    var test = game.input.up;
    if (game.input.up) {
        ConsoleClass.arrowBase.ArrowUp.opacity = 1;
    }
    if (!game.input.up) {
        ConsoleClass.arrowBase.ArrowUp.tl.fadeOut(3);
    }
    if (game.input.down) {
        ConsoleClass.arrowBase.ArrowDown.opacity = 1;
    }
    if (!game.input.down) {
        ConsoleClass.arrowBase.ArrowDown.tl.fadeOut(3);
    }
    if (game.input.left) {
        ConsoleClass.arrowBase.ArrowLeft.opacity = 1;
    }
    if (!game.input.left) {
        ConsoleClass.arrowBase.ArrowLeft.tl.fadeOut(3);
    }
    if (game.input.right) {
        ConsoleClass.arrowBase.ArrowRight.opacity = 1;
    }
    if (!game.input.right) {
        ConsoleClass.arrowBase.ArrowRight.tl.fadeOut(3);
    }
};