"use strict";

function extendTyped(newChar) {
    let nextEl = egt.getNextElementWithText(egt.state.cursor, true);
    if (newChar === egt.consts.WILDCARD_CHAR) {
        newChar = nextEl.innerText[0];
        egt.state.buffer = egt.state.buffer.slice(0, -1) + newChar;
    }
    if (egt.state.wrongCharCount > 0 || nextEl.innerText[0] !== newChar) {
        egt.state.wrongCharCount += 1;
        wrongcharTypingHUD();
        return;
    }

    if (nextEl === egt.state.cursor.nextElementSibling) {
        let left = egt.state.cursor.innerText + newChar;
        let right = nextEl.innerText.slice(1);

        egt.state.cursor.innerText = left;
        nextEl.innerText = right;
    } else {
        lockElement(nextEl, 0, 1);
    }
    
    extendTypingHUD();
    egt.state.cursor?.scrollIntoView(egt.consts.SCROLL_OPT);
}

function wrongcharTypingHUD() {
    egt.setHUDTypingContent(0,
        null,
        egt.state.buffer.slice(0, egt.state.buffer.length-egt.state.wrongCharCount),
        egt.state.lookAhead.slice(0, egt.state.wrongCharCount),
        egt.state.lookAhead.slice(egt.state.wrongCharCount),
    );
}

function extendTypingHUD() {
    egt.state.lookAhead = egt.state.lookAhead.slice(1);
    updateLookAhead();
    egt.setHUDTypingContent(0,
        null,
        egt.state.buffer,
        '',
        egt.state.lookAhead,
    );
}

function updateLookAhead() {
    if (egt.state.lookAhead.length < 30) {
        egt.state.lookAhead = '';
        let nextEl = egt.getNextElementWithText(egt.state.cursor, true);
        while (egt.state.lookAhead.length < 90) {
            egt.state.lookAhead += nextEl.innerText;
            nextEl = egt.getNextElementWithText(nextEl, true);
        }
    }
}

function shrinkTyped() {
    if (egt.state.cursor.innerText.length > 0) {
        if (egt.state.cursor.nextElementSibling) {
            let nextEl = egt.state.cursor.nextElementSibling;
            if (nextEl.classList.contains(egt.consts.class.NAMESPACE) && nextEl.children.length == 0) {
                let left = egt.state.cursor.innerText.slice(0, -1);;
                let right = egt.state.cursor.innerText.at(-1) + nextEl.innerText;

                egt.state.cursor.innerText = left;
                nextEl.innerText = right;
                return;
            }
        }
        if (egt.state.cursor.innerText.length === 1) {
            egt.state.cursor.classList.remove(egt.consts.class.TYPED);
            egt.state.cursorChain.pop();
            egt.state.cursor = egt.state.cursorChain.at(-1);
            return;
        }
        egt.state.cursor.classList.remove(egt.consts.class.TYPED);
        let _;
        [egt.state.cursor, _] = egt.splitElement(egt.state.cursor, -1);
        egt.state.cursor.classList.add(egt.consts.class.TYPED);
        egt.state.cursorChain.pop();
        egt.state.cursorChain.push(egt.state.cursor);
    } else {
        egt.state.cursor.remove();
        egt.state.cursorChain.pop();
        egt.state.cursor = egt.state.cursorChain.at(-1);
        shrinkTyped();
    }
}

function lockState(buffer, focusedElement) {
    if (!focusedElement) {
        return
    }
    egt.repack(focusedElement);
    let startPosition = focusedElement.innerText.indexOf(buffer);
    if (startPosition === -1) {
        console.log('Error locking state, string not found!');
        return
    }
    egt.state.mode = egt.consts.states.LOCKED;
    while (focusedElement.children.length > 0) {
        let children = focusedElement.children;
        let currentSum = 0;
        let idx;
        for (idx=0; idx<focusedElement.children.length &&
                    currentSum + children[idx].innerText.length < startPosition; ++idx) {
            currentSum += children[idx].innerText.length;
        }
        egt.repack(children[idx]);
        focusedElement = children[idx];
        startPosition -= currentSum;
    }

    console.log({focusedElement});
    console.log({startPosition});

    lockElement(focusedElement, startPosition, buffer.length);

    egt.state.lookAhead = '';
    egt.setHUDTypingContent(0,
        focusedElement.innerText.slice(0, startPosition),
        buffer,
        '',
        focusedElement.innerText.slice(startPosition+buffer.length)
    );
}

function lockElement(el, pos, len) {
    if (len === 0) {
        console.warn('lockElement called with', {el, pos, len});
    }

    if (pos !== 0) {
        let [_, right] = egt.splitElement(el, pos);

        el = right;
    }

    if (len === el.innerText.length) {
        el.classList.add(egt.consts.class.TYPED);
        egt.state.cursor = el;
        egt.state.cursorChain.push(egt.state.cursor);
    }
    else if (len < el.innerText.length) {
        let [left, _]  = egt.splitElement(el, len);
        left.classList.add(egt.consts.class.TYPED);
        egt.state.cursor = left;
        egt.state.cursorChain.push(egt.state.cursor);
    }
    else if (len > el.innerText.length) {
        el.classList.add(egt.consts.class.TYPED);
        egt.state.cursorChain.push(el);
        lockElement(egt.getNextElementWithText(el, true), 0, len-el.innerText.length);
    }
}

async function visualEmptyBuffer() {
    let len = egt.state.buffer.length;
    let cstate = egt.state.mode;
    if (cstate !== egt.consts.states.LOCKED) {
        return;
    }
    egt.state.mode = egt.consts.states.ANIMATION;
    for (let i=0; i<len; ++i) {
        backspaceDel();
        await egt.sleep(7);
    }
    egt.state.mode = cstate;
}

function backspaceDel() {
    if (egt.state.buffer.length > 0) {
        backspaceTypingHUD();
        egt.state.buffer = egt.state.buffer.slice(0, egt.state.buffer.length-1);
        if (egt.state.wrongCharCount > 0) {
            egt.state.wrongCharCount--;
            wrongcharTypingHUD();
        }
        else {
            shrinkTyped();
            egt.state.cursor?.scrollIntoView(egt.consts.SCROLL_OPT);
        }
    }
}

function backspaceTypingHUD() {
    if (egt.state.wrongCharCount > 0) {
        return;
    }
    
    egt.state.lookAhead = egt.state.buffer.slice(-1) + egt.state.lookAhead;
    egt.setHUDTypingContent(0,
        null,
        egt.state.buffer.slice(0, -1),
        '',
        egt.state.lookAhead,
    );
}

function unlockState() {
    egt.history.push(egt.state);
    egt.state = egt.initState(egt.consts.states.LOOKING);
    egt.setHUDContent(0, '','','','','','');
}


egt.extendTyped = extendTyped;
egt.lockState = lockState;
egt.unlockState = unlockState;
egt.visualEmptyBuffer = visualEmptyBuffer;
egt.backspaceDel = backspaceDel;
