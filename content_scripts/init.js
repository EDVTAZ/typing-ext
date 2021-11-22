"use strict";

const consts = {
    TYPED: 'typext-typed',
    NAMESPACE: 'typext-namespace',
    HIGHLIGHT: 'typext-highlight',
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
        F10: 'F10',
    },
}

globalThis.typext = {
    consts,
    state: initState(),
    history: [],
};

function initState() {
    return {
        mode: consts.states.LOOKING,
        cursor: null,
        cursorChain: [],
        wrongCharCount: 0,
        buffer: '',
        coloredElements: [],
    }
}

const egt = globalThis.typext;
egt.initState = initState;