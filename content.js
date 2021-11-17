const TYPEXT_TYPED = 'typext-typed';
const TYPEXT_NAMESPACE = 'typext-namespace';
const TYPEXT_HIGHLIGHT = 'typext-highlight';
const TYPEXT_STATES = {
    LOOKING: 'LOOKING',
    LOCKED: 'LOCKED',
};
const TYPEXT_WILDCARD_CHAR = '.';

let state = TYPEXT_STATES.LOOKING;
let cursor = null;
let cursorChain = [];
let wrongCharCount = 0;
let buffer = '';
let coloredElements = [];


document.addEventListener('keydown', (ev) => {
    updateBuffer(ev);
    let res = searchDOM(buffer);
    updateDOM(res);
});

function updateDOM(elements) {
    for (let el of coloredElements) {
        if (!elements.includes(el)) {
            el.classList.remove(TYPEXT_HIGHLIGHT);
        }
    }
    for (let el of elements) {
        if (!el.classList.contains(TYPEXT_HIGHLIGHT)) {
            el.classList.add(TYPEXT_HIGHLIGHT);
        }
    }
    coloredElements = elements;
}

function repack(element) {
    if (element.classList.contains(TYPEXT_NAMESPACE)) {
        return;
    }
    let cNodes = element.childNodes;
    for (let i=0; i<cNodes.length; ++i) {
        let node = cNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
            const span = document.createElement("span");
            span.className = TYPEXT_NAMESPACE;
            element.insertBefore(span, node);
            span.appendChild(node);
        }
    }
}

function searchDOM(query) {
    if (query.length > 4) {
        return xpathStringSearch(query);
    }
    return [];
}

function updateBuffer(ev) {
    if (keypressPreventDefault(ev)) {
        return;
    }

    switch (ev.code) {
        case 'Backspace':
            if (buffer.length > 1) {
                buffer = buffer.slice(0, buffer.length-1);
                if (wrongCharCount > 0) {
                    wrongCharCount--;
                }
                else if (state === TYPEXT_STATES.LOCKED) {
                    shrinkTyped();
                    console.log(cursorChain);
                }
            }
            break;
        case 'Delete':
            buffer = '';
            break;
        case 'Enter':
            if (state === TYPEXT_STATES.LOOKING) {
                lockState(buffer);
            }
            else if (state === TYPEXT_STATES.LOCKED) {
                unlockState();
            }
    }
    
    if (ev.key.length === 1) {
        buffer += ev.key;
        if (state === TYPEXT_STATES.LOCKED) {
            extendTyped(ev.key);
        }
    }

    console.log(buffer);
}

function shrinkTyped() {
    if (cursor.innerText.length > 0) {
        if (cursor.nextElementSibling) {
            let nextEl = cursor.nextElementSibling;
            if (nextEl.classList.contains(TYPEXT_NAMESPACE) && nextEl.children.length == 0) {
                left = cursor.innerText.slice(0, -1);;
                right = cursor.innerText.at(-1) + nextEl.innerText;

                cursor.innerText = left;
                nextEl.innerText = right;
                return;
            }
        }
        if (cursor.innerText.length === 1) {
            cursor.classList.remove(TYPEXT_TYPED);
            cursorChain.pop();
            cursor = cursorChain.at(-1);
            return;
        }
        cursor.classList.remove(TYPEXT_TYPED);
        [cursor, nextEl] = splitElement(cursor, -1);
        cursor.classList.add(TYPEXT_TYPED);
        cursorChain.pop();
        cursorChain.push(cursor);
    } else {
        cursor.remove();
        cursorChain.pop();
        cursor = cursorChain.at(-1);
        shrinkTyped();
    }
}

function extendTyped(newChar) {
    let nextEl = getNextElementWithText(cursor, step=true);
    if (newChar === TYPEXT_WILDCARD_CHAR) {
        newChar = nextEl.innerText[0];
    }
    if (wrongCharCount > 0 || nextEl.innerText[0] !== newChar) {
        wrongCharCount += 1;
        return;
    }

    if (nextEl === cursor.nextElementSibling) {
        left = cursor.innerText + newChar;
        right = nextEl.innerText.slice(1);

        cursor.innerText = left;
        nextEl.innerText = right;
    } else {
        lockElement(nextEl, 0, 1);
    }
}

function lockState(buffer) {
    let focusedElement = xpathStringSearch(buffer)?.[0];
    if (!focusedElement) {
        return
    }
    repack(focusedElement);
    let startPosition = focusedElement.innerText.indexOf(buffer);
    if (startPosition === -1) {
        console.log('Error locking state, string not found!');
        return
    }
    state = TYPEXT_STATES.LOCKED;
    while (focusedElement.children.length > 0) {
        let children = focusedElement.children;
        let currentSum = 0;
        let idx;
        for (idx=0; idx<focusedElement.children.length &&
                    currentSum + children[idx].innerText.length < startPosition; ++idx) {
            currentSum += children[idx].innerText.length;
        }
        repack(children[idx]);
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
        [_, right] = splitElement(el, pos);

        el = right;
    }

    if (len === el.innerText.length) {
        el.classList.add(TYPEXT_TYPED);
        cursor = el;
        cursorChain.push(cursor);
    }
    else if (len < el.innerText.length) {
        [left, _]  = splitElement(el, len);
        left.classList.add(TYPEXT_TYPED);
        cursor = left;
        cursorChain.push(cursor);
    }
    else if (len > el.innerText.length) {
        el.classList.add(TYPEXT_TYPED);
        cursorChain.push(el);
        lockElement(getNextElementWithText(el), 0, len-el.innerText.length);
    }
}

function getNextElementWithText(el, step=true) {
    repack(el.parentElement);
    repack(el);
    if (!step) {
        if (el.innerText.length > 0) {
            return getNEWTstephelper(el);
        }
    }
    while (el.nextElementSibling) {
        el = el.nextElementSibling;
        if (el.innerText.length > 0) {
            return getNEWTstephelper(el);
        }
    } 

    // look at higher level
    return getNextElementWithText(el.parentElement, step=true);
}

function getNEWTstephelper(el) {
    repack(el);
    if (el.classList.contains(TYPEXT_NAMESPACE) && el.children.length === 0) {
        return el;
    } else {
        return getNextElementWithText(el.children[0], step=false);
    }
}

function splitElement(el, pos) {
    let left = document.createElement('span');
    let right = document.createElement('span');

    left.innerText = el.innerText.slice(0, pos);
    left.className = TYPEXT_NAMESPACE;
    right.innerText = el.innerText.slice(pos);
    right.className = TYPEXT_NAMESPACE;

    el.innerText = '';
    el.appendChild(left);
    el.appendChild(right);

    return [left, right];
}

function unlockState() {
    state = TYPEXT_STATES.LOOKING;
    // TODO
}

let previousXpathStringSearch = [null, null];
function xpathStringSearch(query) {
    let [prevQuery, prevResult] = previousXpathStringSearch;
    if (prevQuery === query) {
        console.warn("Memoized result used in xpathStringSearch!");
        return [...prevResult];
    }

    let escapedQuery = query.replace("'", "\\'");
    escapedQuery = `.//*[contains(., '${escapedQuery}')]`;
    let results = xpath(escapedQuery, document);

    let validResults = [];
    let thisNode;

    try {
        do {
            thisNode = results.iterateNext();
            if (thisNode &&
                countXPathResultLength(xpath(escapedQuery, thisNode)) === 0 &&
                isVisible(thisNode)) {
                    validResults.push(thisNode);
            }
        } while (thisNode) 
    }
    catch (e) {
      console.trace(e);
    }

    console.info(validResults);
    previousXpathStringSearch = [query, [...validResults]]

    return validResults;
}

function countXPathResultLength(res) {
    let count = 0;
    while (res.iterateNext()) {
        count++;
    }
    return count;
}

function isVisible(element) {
    let style = window.getComputedStyle(element);
    return (style.display !== 'none')
}

function xpath(query, node, type=XPathResult.ANY_TYPE) {
    return document.evaluate(query, node, null, type, null);
}

const preventedKeys = ['Space', 'Backspace', 'Delete'];
const ignoredKeys = ['Space', 'Backspace', 'Delete'];
let preventKeyState = true;
function keypressPreventDefault(ev) {
    if (ev.code === 'F10') {
        ev.preventDefault();
        preventKeyState = !preventKeyState;
        return true;
    }
    if (preventKeyState && preventedKeys.includes(ev.code)) {
        ev.preventDefault();
    }
    return false;
}