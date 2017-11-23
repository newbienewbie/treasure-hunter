
//The `keyboard` helper function
export function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}


export function bindKeyStrokeToPlayer(explorer) {
    //Capture the keyboard arrow keys
    const left = keyboard(37);
    const up = keyboard(38);
    const right = keyboard(39);
    const down = keyboard(40);

    //Left arrow key `press` method
    left.press = function () {
        explorer.emit('move_left');
    };
    left.release = function () {
        if (!right.isDown && explorer.vy === 0) {
            explorer.emit('stop_left');
        }
    };

    //Up
    up.press = function () {
        explorer.emit('move_top');
    };
    up.release = function () {
        if (!down.isDown && explorer.vx === 0) {
            explorer.emit('stop_top');
        }
    };

    //Right
    right.press = function () {
        explorer.emit('move_right');
    };
    right.release = function () {
        if (!left.isDown && explorer.vy === 0) {
            explorer.emit('stop_right');
        }
    };

    //Down
    down.press = function () {
        explorer.emit('move_bottom');
    };
    down.release = function () {
        if (!up.isDown && explorer.vx === 0) {
            explorer.emit('stop_bottom');
        }
    };
}

