"use strict";

const consts = {
    class: {
        TYPED: 'typext-typed',
        NAMESPACE: 'typext-namespace',
        HIGHLIGHT: 'typext-highlight',
        FRAME: 'typext-hud-frame',
        CONTAINER: 'typext-hud-container',
        TEXTBOX: 'typext-hud-textbox',
        TEXTLEFT: 'typext-hud-textleft',
        TEXTRIGHT: 'typext-hud-textright',
        DOMINANT: 'typext-hud-dominant',
        WEAK: 'typext-hud-weak',
        WRONGTEXT: 'typext-hud-wrongtext',
        HUD_TYPED: 'typext-hud-typedtext',
        HUD_WRONG: 'typext-hud-wrongtext',
        HUD_UNTYPED: 'typext-hud-untyped',

    },
    WILDCARD_CHAR: '.',
    states: {
        OFF: 'OFF',
        LOOKING: 'LOOKING',
        LOCKED: 'LOCKED',
        ANIMATION: 'ANIMATION',
    },
    keys: {
        Backspace: 'Backspace',
        Space: 'Space',
        Delete: 'Delete',
        Enter: 'Enter',
        F2: 'F2',
    },
}

globalThis.typext = {
    consts,
    state: initState(consts.states.OFF),
    history: [],
};

function initState(mode) {
    return {
        mode: mode,
        prevmode: consts.states.LOOKING,
        cursor: null,
        cursorChain: [],
        wrongCharCount: 0,
        buffer: '',
        coloredElements: [],
    }
}

const egt = globalThis.typext;
egt.initState = initState;