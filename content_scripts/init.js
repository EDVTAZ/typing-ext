"use strict";

const consts = {
    TYPED: 'typext-typed',
    NAMESPACE: 'typext-namespace',
    HIGHLIGHT: 'typext-highlight',
    WILDCARD_CHAR: '.',
    states: {
        LOOKING: 'LOOKING',
        LOCKED: 'LOCKED',
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
    state: {
        mode: consts.states.LOOKING,
        cursor: null,
        cursorChain: [],
        wrongCharCount: 0,
        buffer: '',
        coloredElements: [],
    }
};

const egt = globalThis.typext;