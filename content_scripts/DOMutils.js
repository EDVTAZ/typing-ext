"use strict";

function repack(element) {
    if (element.classList.contains(egt.consts.NAMESPACE)) {
        return;
    }
    let cNodes = element.childNodes;
    for (let i=0; i<cNodes.length; ++i) {
        let node = cNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
            const span = document.createElement("span");
            span.className = egt.consts.NAMESPACE;
            element.insertBefore(span, node);
            span.appendChild(node);
        }
    }
}

function getNextElementWithText(el, step) {
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
    return getNextElementWithText(el.parentElement, step);
}

function getNEWTstephelper(el) {
    repack(el);
    if (el.classList.contains(egt.consts.NAMESPACE) && el.children.length === 0) {
        return el;
    } else {
        return getNextElementWithText(el.children[0], false);
    }
}

function splitElement(el, pos) {
    let left = document.createElement('span');
    let right = document.createElement('span');

    left.innerText = el.innerText.slice(0, pos);
    left.className = egt.consts.NAMESPACE;
    right.innerText = el.innerText.slice(pos);
    right.className = egt.consts.NAMESPACE;

    el.innerText = '';
    el.appendChild(left);
    el.appendChild(right);

    return [left, right];
}

function isVisible(element) {
    let style = window.getComputedStyle(element);
    return (style.display !== 'none')
}


globalThis.typext.repack = repack;
globalThis.typext.getNextElementWithText = getNextElementWithText;
globalThis.typext.splitElement = splitElement;
globalThis.typext.isVisible = isVisible;
