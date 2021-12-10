"use strict";

document.addEventListener('keydown', (ev) => {
    keypressPreventDefault(ev);
    handleKeyEvent(ev);
});

function handleKeyEvent(ev) {
    if (egt.state.mode === egt.consts.states.ANIMATION) {
        return;
    }
    if (egt.state.mode === egt.consts.states.OFF) {
        if (ev.code === egt.consts.keys.F2) {
            egt.state.mode = egt.state.prevmode;
            egt.showHUD();
        }
        return;
    }

    switch (ev.code) {
        case egt.consts.keys.F2:
            egt.state.prevmode = egt.state.mode;
            egt.state.mode = egt.consts.states.OFF;
            egt.hideHUD();
            break;

        case egt.consts.keys.Backspace:
            if (egt.state.mode === egt.consts.states.LOCKED) {
                egt.backspaceDel();
            }
            else if (egt.state.mode === egt.consts.states.LOOKING) {
                if (egt.state.buffer.length > 0) {
                    egt.state.buffer = egt.state.buffer.slice(0, egt.state.buffer.length-1);
                }
            }
            break;

        case egt.consts.keys.Delete:
            if (egt.state.mode === egt.consts.states.LOCKED) {
                egt.visualEmptyBuffer();
            }
            else if (egt.state.mode === egt.consts.states.LOOKING) {
                egt.state.buffer = '';
            }
            break;

        case egt.consts.keys.Tab:
            if (egt.state.mode === egt.consts.states.LOOKING) {
                egt.cycleFocusedLooking();
            }
            break;

        case egt.consts.keys.Enter:
            if (egt.state.mode === egt.consts.states.LOOKING) {
                const fe = egt.state.focusedElement;
                egt.showBufferMatches('');
                egt.lockState(egt.state.buffer, fe);
                // hackily finish hud init, make it nicer later please :)
                kickHUD();

            }
            else if (egt.state.mode === egt.consts.states.LOCKED) {
                egt.unlockState();
            }
    }
    
    if (ev.key.length === 1) {
        egt.state.buffer += ev.key;
        if (egt.state.mode === egt.consts.states.LOCKED) {
            egt.extendTyped(ev.key);
        }
    }
    if (egt.state.mode === egt.consts.states.LOOKING) {
        egt.showBufferMatches(egt.state.buffer);
    }
}

const preventedKeys = [
    egt.consts.keys.Enter,
    egt.consts.keys.Tab,
    egt.consts.keys.Space,
    egt.consts.keys.Backspace, 
    egt.consts.keys.Delete,
    egt.consts.keys.F2,
];
function keypressPreventDefault(ev) {
    if (ev.code === egt.consts.keys.F2) {
        ev.preventDefault;
        return;
    }
    if (egt.state.mode !== egt.consts.states.OFF && preventedKeys.includes(ev.code)) {
        ev.preventDefault();
    }
}

// simulate keypress
function kickHUD() {
    handleKeyEvent({
        code: egt.consts.WILDCARD_CHAR,
        key: egt.consts.WILDCARD_CHAR,

    })
    handleKeyEvent({
        code: egt.consts.keys.Backspace,
        key: egt.consts.keys.Backspace,

    })
}