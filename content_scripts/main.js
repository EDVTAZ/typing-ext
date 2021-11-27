"use strict";

document.addEventListener('keydown', (ev) => {
    handleKeyEvent(ev);
    highlightBufferMatches(egt.state.buffer);
});

function handleKeyEvent(ev) {
    if (keypressPreventDefault(ev)) {
        return;
    }
    if (egt.state.mode === egt.consts.states.ANIMATION) {
        return;
    }

    switch (ev.code) {
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
                egt.state.mode.buffer = '';
            }
            break;
        case 'Enter':
            if (egt.state.mode === egt.consts.states.LOOKING) {
                egt.lockState(egt.state.buffer);
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

    console.log(egt.state.buffer);
}

const preventedKeys = [egt.consts.keys.Space, egt.consts.keys.Backspace, egt.consts.keys.Delete];
let preventKeyState = true;
function keypressPreventDefault(ev) {
    if (ev.code === egt.consts.keys.F10) {
        ev.preventDefault();
        preventKeyState = !preventKeyState;
        return true;
    }
    if (preventKeyState && preventedKeys.includes(ev.code)) {
        ev.preventDefault();
    }
    return false;
}

function highlightBufferMatches(buffer) {
    let elements;
    if (buffer.length > 4) {
        elements = egt.xpathStringSearch(buffer);
    } else {
        elements = [];
    }

    for (let el of egt.state.coloredElements) {
        if (!elements.includes(el)) {
            el.classList.remove(egt.consts.class.HIGHLIGHT);
        }
    }
    for (let el of elements) {
        el.classList.add(egt.consts.class.HIGHLIGHT);
    }
    egt.state.coloredElements = elements;
}
