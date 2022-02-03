"use strict";

class HUD {
    /**
     * @param {boolean} visible 
     */
    constructor(visible) {
        this.#anchor = document.createElement('div');
        document.body.appendChild(this.#anchor);
        this.#shadowRoot = this.#anchor.attachShadow({ mode: 'open' });
        this.#addStyle(this.#shadowRoot);

        this.#typedHUD = new TypedHUD(visible);
    }

    /** @type {Element} */
    #anchor;
    /** @type {ShadowRoot} */
    #shadowRoot;
    /** @type {TypedHUD} */
    #typedHUD;

    /**
     * @param {ShadowRoot} elem 
     * @returns {Element}
     */
    #addStyle(elem) {
        const styleElem = document.createElement('link');
        styleElem.setAttribute('rel', 'stylesheet');
        styleElem.setAttribute('href', chrome.runtime.getURL('content_styles/content.css'));
        elem.appendChild(styleElem);
        return styleElem;
    }
}

class TypedHUD {
    /**
     * 
     * @param {ShadowRoot} shadowRoot 
     * @param {boolean} visible 
     */
    constructor(shadowRoot, visible) {
        this.#addRoot(shadowRoot, visible);
    }

    /** @type {Element} */
    #root;
    /** @type {Element[]} */
    #containers;

    /**
     * 
     * @param {ShadowRoot} shadowRoot
     * @param {boolean} visible
     */
    #addRoot(shadowRoot, visible) {
        const hudRoot = document.createElement('box');
        hudRoot.className = 'typext-hud-frame';
        hudRoot.style.display = visible ? 'block' : 'none';
        shadowRoot.appendChild(hudRoot);
        this.#root = hudRoot;
    }
}

class HUDContainer {
    constructor() {
        this.#hudContainer = document.createElement('box');
        this.#hudContainer.classList.add(egt.consts.class.CONTAINER);
        this.#hudContainer.classList.add(typeClass);

            this.#hudLeft = document.createElement('box');
            this.#hudLeft.classList.add(egt.consts.class.TEXTBOX);
            this.#hudLeft.classList.add(egt.consts.class.TEXTLEFT);
            this.#hudContainer.appendChild(hudLeft);

                const leftSpan = document.createElement('span');
                this.#hudLeft.appendChild(leftSpan);

                    this.#untypedLeft = document.createElement('span');
                    this.#untypedLeft.classList.add(egt.consts.class.HUD_UNTYPED);
                    leftSpan.appendChild(this.#untypedLeft);

                        this.#typedText = document.createElement('span');
                        this.#typedText.classList.add(egt.consts.class.HUD_TYPED);
                        leftSpan.appendChild(this.#typedText);

                        const leftWsPreserve = document.createElement('span');
                        leftWsPreserve.classList.add(egt.consts.class.HUD_WSPRESERVE);
                        leftWsPreserve.innerText = '_';
                        leftSpan.appendChild(leftWsPreserve);

                this.#hudRight = document.createElement('box');
                this.#hudRight.classList.add(egt.consts.class.TEXTBOX);
                this.#hudRight.classList.add(egt.consts.class.TEXTRIGHT);
                this.#hudContainer.appendChild(this.#hudRight);

                    const rightSpan = document.createElement('span');
                    this.#hudRight.appendChild(rightSpan);

                        const rightWsPreserve = document.createElement('span');
                        rightWsPreserve.classList.add(egt.consts.class.HUD_WSPRESERVE);
                        rightWsPreserve.innerText = '_';
                        rightSpan.appendChild(rightWsPreserve);

                        this.#focusTyped = document.createElement('span');
                        this.#focusTyped.classList.add(egt.consts.class.HUD_TYPEDFOCUS);
                        rightSpan.appendChild(this.#focusTyped);

                        this.#wrongText = document.createElement('span');
                        this.#wrongText.classList.add(egt.consts.class.HUD_WRONG);
                        rightSpan.appendChild(this.#wrongText);

                        this.#focusUntyped = document.createElement('span');
                        this.#focusUntyped.classList.add(egt.consts.class.HUD_FOCUS);
                        rightSpan.appendChild(this.#focusUntyped);

                        this.#untypedText = document.createElement('span');
                        this.#untypedText.classList.add(egt.consts.class.HUD_UNTYPED);
                        rightSpan.appendChild(this.#untypedText);
    }
}

function buildHUD() {
    let hudAnchor = document.createElement('div');
    document.body.appendChild(hudAnchor);
    let hudShadowRoot = hudAnchor.attachShadow({ mode: 'open' });

    const styleElem = addStyle(hudShadowRoot);


    const hudRoot = addRoot(hudShadowRoot);
    hudRoot.style.display = 'none';

    const hud = {
        hudAnchor,
        hudShadowRoot,
        hudRoot,
        containers: [],
    };

    addContainer(hud, egt.consts.class.DOMINANT);
    // addContainer(hud, egt.consts.class.WEAK);

    egt.hud = hud;
    return hud;
}




function addStyle(elem) {
    const styleElem = document.createElement('link');
    styleElem.setAttribute('rel', 'stylesheet');
    styleElem.setAttribute('href', chrome.runtime.getURL('content_styles/content.css'));
    elem.appendChild(styleElem);
    return styleElem;
}

function showHUD() {
    egt.hud.hudRoot.style.display = 'block';
}

function hideHUD() {
    egt.hud.hudRoot.style.display = 'none';
}

function setHUDHeight(height) {
    if (height === 0) {
        console.error('HUD height was attempted to be set to 0!');
        return;
    }

    let curHeight = egt.hud.containers.length;
    if (Math.min(height, egt.consts.HUD_HEIGHT + 1) === curHeight) {
        return;
    }

    if (height < curHeight) {
        while (height < egt.hud.containers.length) {
            let container = egt.hud.containers.pop();
            container.hudContainer.remove();
        }
        return;
    }

    if (height > curHeight) {
        for (let i = curHeight; i < Math.min(height, egt.consts.HUD_HEIGHT); ++i) {
            addContainer(egt.hud, egt.consts.class.WEAK);
        }
        if (height > egt.consts.HUD_HEIGHT) {
            addContainer(egt.hud, egt.consts.class.OVERFLOWED);
        }
    }
}

function setSanitizeInnerText(el, str) {
    el.innerText = str.replaceAll('\n', '⏎');
}

function setHUDContent(idx, untypedLeft, typed, focusTyped, mistyped, focusUntyped, untypedRight) {
    // TODO maybe optimize enter sanitization, it could be slow...
    if (untypedLeft !== null) {
        setSanitizeInnerText(egt.hud.containers[idx].untypedLeft, untypedLeft);
    }
    setSanitizeInnerText(egt.hud.containers[idx].typedText, typed);
    setSanitizeInnerText(egt.hud.containers[idx].focusTyped, focusTyped);
    setSanitizeInnerText(egt.hud.containers[idx].wrongText, mistyped);
    setSanitizeInnerText(egt.hud.containers[idx].focusUntyped, focusUntyped);
    setSanitizeInnerText(egt.hud.containers[idx].untypedText, untypedRight);
}

function setHUDTypingContent(idx, untypedLeft, typed, mistyped, untypedRight) {
    let focusTyped;
    let focusUntyped;

    const spaceRegex = /\s/g;
    let untypedSpacePos = untypedRight.search(spaceRegex);
    let mistypedSpacePos = mistyped.search(spaceRegex);

    let typedSpacePos = -1;
    if (typed.length > 120) {
        typed = typed.slice(-120);
    }
    spaceRegex.test(typed);
    while (spaceRegex.lastIndex > 0) {
        typedSpacePos = spaceRegex.lastIndex;
        spaceRegex.test(typed);
    }

    if (typedSpacePos === -1) {
        typedSpacePos = 0;
    }
    focusTyped = typed.slice(typedSpacePos);
    typed = typed.slice(0, typedSpacePos);

    if (mistypedSpacePos !== -1) {
        focusUntyped = '';
    } else {
        if (untypedSpacePos === -1) {
            focusUntyped = untypedRight;
            untypedRight = '';
        } else {
            focusUntyped = untypedRight.slice(0, untypedSpacePos + 1);
            untypedRight = untypedRight.slice(untypedSpacePos + 1);
        }
    }
    setHUDContent(idx, untypedLeft, typed, focusTyped, mistyped, focusUntyped, untypedRight);
}

buildHUD()
egt.showHUD = showHUD;
egt.hideHUD = hideHUD;
egt.addContainer = addContainer;
egt.setHUDHeight = setHUDHeight;
egt.setHUDContent = setHUDContent;
egt.setHUDTypingContent = setHUDTypingContent;