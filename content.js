const TYPEXT_TYPED = 'typext-typed';
const TYPEXT_NAMESPACE = 'typext-namespace';
const TYPEXT_HIGHLIGHT = 'typext-highlight';
const TYPEXT_STATES = {
    LOOKING: 'LOOKING',
    LOCKED: 'LOCKED',
};

let state = TYPEXT_STATES.LOOKING;
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
            // repack(el);
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
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            const span = document.createElement("span");
            span.className = TYPEXT_NAMESPACE;
            element.insertBefore(span, node);
            span.appendChild(node);
        }
    }
}

function searchDOM(query) {
    if (buffer.length > 4) {
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
            }
            break;
        case 'Delete':
            buffer = '';
            break;
        case 'Enter':
            if (state === TYPEXT_STATES.LOOKING) {
                lockState();
            }
            if (state === TYPEXT_STATES.LOCKED) {
                unlockState();
            }
    }
    
    if (ev.key.length == 1) {
        buffer += ev.key;
    }

    console.log(buffer);
}

function lockState() {
    state = TYPEXT_STATES.LOCKED;
    let focusedElement = searchDOM(buffer)[0];
    repack(focusedElement);
    let startPosition = focusedElement.innerText.search(buffer);
    while (focusedElement.children.length > 0) {
        let children = focusedElement.children;
        let currentSum = children[0].innerText.length;
        let idx;
        for (idx=1; idx<focusedElement.children.length &&
                      currentSum + children[idx].innerText.length < startPosition; ++idx) {
            currentSum += children[idx].innerText.length;
        }
        repack(children[idx]);
        focusedElement = children[idx];
        startPosition -= currentSum;
    }

    console.log({focusedElement});
    console.log({startPosition});

    // TODO split focusedElement so startPosition is pos 0 in the new element created
    // TODO color until end position (also find it...) and split there as well
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

function xpath(query, node) {
    return document.evaluate(query, node, null, XPathResult.ANY_TYPE, null);
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