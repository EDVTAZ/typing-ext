"use strict";

function repack(element) {
    if (element.classList.contains(egt.consts.class.NAMESPACE)) {
        return;
    }
    let cNodes = element.childNodes;
    for (let i=0; i<cNodes.length; ++i) {
        let node = cNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
            const span = document.createElement("span");
            element.insertBefore(span, node);
            span.appendChild(node);

            if (span.children.length > 0) {
                repack(span);
            }
            span.className = egt.consts.class.NAMESPACE;
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
    if (el.classList.contains(egt.consts.class.NAMESPACE) && el.children.length === 0) {
        return el;
    } else {
        return getNextElementWithText(el.children[0], false);
    }
}

function splitElement(el, pos) {
    let left = document.createElement('span');
    let right = document.createElement('span');

    left.innerText = el.innerText.slice(0, pos);
    repack(left);
    right.innerText = el.innerText.slice(pos);
    repack(right);

    el.innerText = '';
    el.appendChild(left);
    el.appendChild(right);

    return [left, right];
}

function isVisible(element) {
    let style = window.getComputedStyle(element);
    return (style.display !== 'none')
}


egt.repack = repack;
egt.getNextElementWithText = getNextElementWithText;
egt.splitElement = splitElement;
egt.isVisible = isVisible;
