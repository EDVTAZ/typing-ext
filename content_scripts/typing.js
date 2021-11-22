"use strict";

function extendTyped(newChar) {
    let nextEl = egt.getNextElementWithText(egt.state.cursor, true);
    if (newChar === egt.consts.WILDCARD_CHAR) {
        newChar = nextEl.innerText[0];
    }
    if (egt.state.wrongCharCount > 0 || nextEl.innerText[0] !== newChar) {
        egt.state.wrongCharCount += 1;
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
}

function shrinkTyped() {
    if (egt.state.cursor.innerText.length > 0) {
        if (egt.state.cursor.nextElementSibling) {
            let nextEl = egt.state.cursor.nextElementSibling;
            if (nextEl.classList.contains(egt.consts.NAMESPACE) && nextEl.children.length == 0) {
                let left = egt.state.cursor.innerText.slice(0, -1);;
                let right = egt.state.cursor.innerText.at(-1) + nextEl.innerText;

                egt.state.cursor.innerText = left;
                nextEl.innerText = right;
                return;
            }
        }
        if (egt.state.cursor.innerText.length === 1) {
            egt.state.cursor.classList.remove(egt.consts.TYPED);
            egt.state.cursorChain.pop();
            egt.state.cursor = egt.state.cursorChain.at(-1);
            return;
        }
        egt.state.cursor.classList.remove(egt.consts.TYPED);
        let _;
        [egt.state.cursor, _] = egt.splitElement(egt.state.cursor, -1);
        egt.state.cursor.classList.add(egt.consts.TYPED);
        egt.state.cursorChain.pop();
        egt.state.cursorChain.push(egt.state.cursor);
    } else {
        egt.state.cursor.remove();
        egt.state.cursorChain.pop();
        egt.state.cursor = egt.state.cursorChain.at(-1);
        shrinkTyped();
    }
}

function lockState(buffer) {
    let focusedElement = egt.xpathStringSearch(buffer)?.[0];
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
}

function lockElement(el, pos, len) {
    if (len === 0) {
        console.warn('lockElement called with', {el, pos, len});
    }

    if (pos !== 0) {
        [_, right] = egt.splitElement(el, pos);

        el = right;
    }

    if (len === el.innerText.length) {
        el.classList.add(egt.consts.TYPED);
        egt.state.cursor = el;
        egt.state.cursorChain.push(egt.state.cursor);
    }
    else if (len < el.innerText.length) {
        let [left, _]  = egt.splitElement(el, len);
        left.classList.add(egt.consts.TYPED);
        egt.state.cursor = left;
        egt.state.cursorChain.push(egt.state.cursor);
    }
    else if (len > el.innerText.length) {
        el.classList.add(egt.consts.TYPED);
        egt.state.cursorChain.push(el);
        lockElement(egt.getNextElementWithText(el, true), 0, len-el.innerText.length);
    }
}

function unlockState() {
    egt.state.mode = egt.consts.states.LOOKING;
    // TODO
}

globalThis.typext.extendTyped = extendTyped;
globalThis.typext.shrinkTyped = shrinkTyped;
globalThis.typext.lockState = lockState;
globalThis.typext.unlockState = unlockState;
