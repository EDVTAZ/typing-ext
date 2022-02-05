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

        this.TypedHUD = new TypedHUD(this.#shadowRoot, visible);
    }

    /** @type {Element} */
    #anchor;
    /** @type {ShadowRoot} */
    #shadowRoot;
    /** @type {TypedHUD} */
    TypedHUD;

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

    Show() {
        this.TypedHUD.Show();
    }
    
    Hide() {
        this.TypedHUD.Hide();
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
        this.#addContainer(HUDContainer.DOMINANT_CLASS);
    }

    /** @type {Element} */
    #root;
    /** @type {HUDContainer[]} */
    #containers = [];
    /** @type {number} */
    static MAX_HEIGHT = 4;

    /** @type {string} */
    #FRAME_CLASS = 'typext-hud-frame';
    /**
     * 
     * @param {ShadowRoot} shadowRoot
     * @param {boolean} visible
     */
    #addRoot(shadowRoot, visible) {
        this.#root = document.createElement('box');
        this.#root.className = this.#FRAME_CLASS;
        if (visible) this.Show(); else this.Hide();
        shadowRoot.appendChild(this.#root);
    }

    /**
     * 
     * @param {string} typeClass 
     */
    #addContainer(typeClass) {
        const newContainer = new HUDContainer(typeClass);
        this.#containers.push(newContainer);
        newContainer.AttachTo(this.#root);
    }
    
    Show() {
        this.#root.style.display = 'block';
    }

    Hide() {
        this.#root.style.display = 'none';
    }

    /**
     * 
     * @param {number} height 
     */
    SetHeight(height) {
        if (height === 0) {
            console.error('HUD height was attempted to be set to 0!');
            return;
        }
        height = Math.min(height, TypedHUD.MAX_HEIGHT+1);

        const curHeight = this.#containers.length;
        if (height === curHeight) {
            return;
        }
    
        if (height < curHeight) {
            while (height < this.#containers.length) {
                let container = this.#containers.pop();
                container.Remove();
            }
            return;
        }
    
        if (height > curHeight) {
            for (let i = curHeight; i < Math.min(height, TypedHUD.MAX_HEIGHT); ++i) {
                this.#addContainer(HUDContainer.WEAK_CLASS);
            }
            if (height > TypedHUD.MAX_HEIGHT) {
                this.#addContainer(HUDContainer.OVERFLOWED_CLASS);
            }
        }
    }

    /**
     * 
     * @param {object[]} content 
     */
    SetContent(content) {
        this.SetHeight(content.length);
        for (let idx in content) {
            this.#containers[idx].SetContent(...content[idx]);
        }
    }

    /**
     * 
     * @param {string} untypedLeft 
     * @param {string} typed 
     * @param {string} mistyped 
     * @param {string} untypedRight 
     */
    SetTypingContent(untypedLeft, typed, mistyped, untypedRight) {
        this.SetHeight(1);
        this.#containers[0].SetTypingContent(untypedLeft, typed, mistyped, untypedRight)
    }
}

class HUDContainer {
    /** @type {string} */
    static DOMINANT_CLASS = 'typext-hud-dominant';
    /** @type {string} */
    static WEAK_CLASS = 'typext-hud-weak';
    /** @type {string} */
    static OVERFLOWED_CLASS = 'typext-hud-overflowed';

    /** @type {string} */
    #CONTAINER_CLASS = 'typext-hud-container';
    /** @type {string} */
    #UNTYPED_CLASS = 'typext-hud-untyped';
    /** @type {string} */
    #TYPED_CLASS = 'typext-hud-typedtext';
    /** @type {string} */
    #TYPEDFOCUS_CLASS = 'typext-hud-focustypedtext';
    /** @type {string} */
    #WRONG_CLASS = 'typext-hud-wrongtext';
    /** @type {string} */
    #FOCUS_CLASS = 'typext-hud-focusword';
    
    /** @type {string} */
    #TEXTBOX_CLASS = 'typext-hud-textbox';
    /** @type {string} */
    #TEXTLEFT_CLASS = 'typext-hud-textleft';
    /** @type {string} */
    #TEXTRIGHT_CLASS = 'typext-hud-textright';
    /** @type {string} */
    #WSPRESERVE_CLASS = 'typext-hud-wspreserver';

    /**
     * 
     * @param {string} typeClass 
     */
    constructor(typeClass) {
        this.#hudContainer = document.createElement('box');
        this.#hudContainer.classList.add(this.#CONTAINER_CLASS);
        this.#hudContainer.classList.add(typeClass);

            this.#hudLeft = document.createElement('box');
            this.#hudLeft.classList.add(this.#TEXTBOX_CLASS);
            this.#hudLeft.classList.add(this.#TEXTLEFT_CLASS);
            this.#hudContainer.appendChild(this.#hudLeft);

                const leftSpan = document.createElement('span');
                this.#hudLeft.appendChild(leftSpan);

                    this.#untypedLeft = document.createElement('span');
                    this.#untypedLeft.classList.add(this.#UNTYPED_CLASS);
                    leftSpan.appendChild(this.#untypedLeft);

                        this.#typedText = document.createElement('span');
                        this.#typedText.classList.add(this.#TYPED_CLASS);
                        leftSpan.appendChild(this.#typedText);

                        const leftWsPreserve = document.createElement('span');
                        leftWsPreserve.classList.add(this.#WSPRESERVE_CLASS);
                        leftWsPreserve.innerText = '_';
                        leftSpan.appendChild(leftWsPreserve);

                this.#hudRight = document.createElement('box');
                this.#hudRight.classList.add(this.#TEXTBOX_CLASS);
                this.#hudRight.classList.add(this.#TEXTRIGHT_CLASS);
                this.#hudContainer.appendChild(this.#hudRight);

                    const rightSpan = document.createElement('span');
                    this.#hudRight.appendChild(rightSpan);

                        const rightWsPreserve = document.createElement('span');
                        rightWsPreserve.classList.add(this.#WSPRESERVE_CLASS);
                        rightWsPreserve.innerText = '_';
                        rightSpan.appendChild(rightWsPreserve);

                        this.#focusTyped = document.createElement('span');
                        this.#focusTyped.classList.add(this.#TYPEDFOCUS_CLASS);
                        rightSpan.appendChild(this.#focusTyped);

                        this.#wrongText = document.createElement('span');
                        this.#wrongText.classList.add(this.#WRONG_CLASS);
                        rightSpan.appendChild(this.#wrongText);

                        this.#focusUntyped = document.createElement('span');
                        this.#focusUntyped.classList.add(this.#FOCUS_CLASS);
                        rightSpan.appendChild(this.#focusUntyped);

                        this.#untypedText = document.createElement('span');
                        this.#untypedText.classList.add(this.#UNTYPED_CLASS);
                        rightSpan.appendChild(this.#untypedText);
    }

    /** @type {Element} */
    #hudContainer;
    /** @type {Element} */
    #hudLeft;
    /** @type {Element} */
    #hudRight;
    /** @type {Element} */
    #untypedLeft;
    /** @type {Element} */
    #typedText;
    /** @type {Element} */
    #focusTyped;
    /** @type {Element} */
    #wrongText;
    /** @type {Element} */
    #focusUntyped;
    /** @type {Element} */
    #untypedText;

    Remove() {
        this.#hudContainer.remove();
    }

    /**
     * 
     * @param {Element} root 
     */
    AttachTo(root) {
        root.prepend(this.#hudContainer);
    }

    /**
     * 
     * @param {Element} el 
     * @param {string} str 
     */
    #setSanitizeInnerText(el, str) {
        el.innerText = str.replaceAll('\n', '⏎');
    }

    /**
     * 
     * @param {string} untypedLeft 
     * @param {string} typed 
     * @param {string} focusTyped 
     * @param {string} mistyped 
     * @param {string} focusUntyped 
     * @param {string} untypedRight 
     */
    SetContent(untypedLeft, typed, focusTyped, mistyped, focusUntyped, untypedRight) {
        // TODO maybe optimize enter sanitization, it could be slow...
        if (untypedLeft !== null) {
            this.#setSanitizeInnerText(this.#untypedLeft, untypedLeft);
        }
        this.#setSanitizeInnerText(this.#typedText, typed);
        this.#setSanitizeInnerText(this.#focusTyped, focusTyped);
        this.#setSanitizeInnerText(this.#wrongText, mistyped);
        this.#setSanitizeInnerText(this.#focusUntyped, focusUntyped);
        this.#setSanitizeInnerText(this.#untypedText, untypedRight);
    }

    /**
     * 
     * @param {string} untypedLeft 
     * @param {string} typed 
     * @param {string} mistyped 
     * @param {string} untypedRight 
     */
    SetTypingContent(untypedLeft, typed, mistyped, untypedRight) {
        let focusTyped;
        let focusUntyped;
    
        const spaceRegex = /\s/g;
        const untypedSpacePos = untypedRight.search(spaceRegex);
        const mistypedSpacePos = mistyped.search(spaceRegex);
    
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
        this.SetContent(untypedLeft, typed, focusTyped, mistyped, focusUntyped, untypedRight);
    }
}

egt.HUD = new HUD();
