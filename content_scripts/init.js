"use strict";

const consts = {
    WILDCARD_CHAR: '.',
    SYNONYM_CHARS: {
        "'": "ʹʻʼʽˈ‘’",
        '"': '“	”ʺ',
        "-": "–—˗"
    },
    SYNONYM_REGEX: {
        " ": /[\s\u00A0]/,
    },
    SCROLL_OPT: {
        behavior: "smooth",
        block: "center", 
        inline: "nearest",
    },
    class: {
        TYPED: 'typext-typed',
        NAMESPACE: 'typext-namespace',
        HIGHLIGHT: 'typext-highlight',
    },
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
        Tab: 'Tab',
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
        lookAhead: '',
        coloredElements: [],
    }
}

const egt = globalThis.typext;
egt.initState = initState;