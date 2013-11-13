/**
 * Created by hessj on 11/11/13.
 */

var init_Game = enchant.Class.create(enchant.Scene,{
    initialize: function(bpm){
        var game = new Core(1388, 732);
        game.rootScene.backgroundColor = "#f00";
        game.preload(preLoadFiles());
        game.fps = fps;
        game.bpm = 135;
    }
});

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