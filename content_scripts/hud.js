function buildHUD() {

    let hudAnchor = document.createElement('div');
    document.body.appendChild(hudAnchor);
    let hudShadowRoot = hudAnchor.attachShadow({mode: 'open'});

    const styleElem = addStyle(hudShadowRoot);
    const hudRoot = addRoot(hudShadowRoot);
    //hudRoot.style.display = 'none';

    const hud = {
        hudAnchor,
        hudShadowRoot,
        hudRoot,
        containers: [],
    };

    addContainer(hud, egt.consts.class.DOMINANT);
    addContainer(hud, egt.consts.class.WEAK);

    egt.hud = hud;
    return hud;
}

function addContainer(hud, typeClass) {
    const elem = hud.hudRoot;
    const hudContainer = document.createElement('box');
    hudContainer.classList.add(egt.consts.class.CONTAINER);
    hudContainer.classList.add(typeClass);
    elem.prepend(hudContainer);

    const hudLeft = document.createElement('box');
    hudLeft.classList.add(egt.consts.class.TEXTBOX);
    hudLeft.classList.add(egt.consts.class.TEXTLEFT);
    hudContainer.appendChild(hudLeft);

    const typedText = document.createElement('span');
    typedText.classList.add(egt.consts.class.HUD_TYPED);
    hudLeft.appendChild(typedText);

    const hudRight = document.createElement('box');
    hudRight.classList.add(egt.consts.class.TEXTBOX);
    hudRight.classList.add(egt.consts.class.TEXTRIGHT);
    hudContainer.appendChild(hudRight);

    const wrongText = document.createElement('span');
    wrongText.classList.add(egt.consts.class.HUD_WRONG);
    hudRight.appendChild(wrongText);

    const untypedText = document.createElement('span');
    untypedText.classList.add(egt.consts.class.HUD_UNTYPED);
    hudRight.appendChild(untypedText);

    const container = {
        hudContainer,
        hudLeft,
        hudRight,
        typedText,
        wrongText,
        untypedText,
    };

    hud.containers.push(container);
    return container;
}

function addRoot(elem) {
    const hudRoot = document.createElement('box');
    hudRoot.className = 'typext-hud-frame';
    elem.appendChild(hudRoot);
    return hudRoot;
}

function addStyle(elem) {
    const styleElem = document.createElement('link');
    styleElem.setAttribute('rel', 'stylesheet');
    styleElem.setAttribute('href', chrome.runtime.getURL('content_styles/content.css'));
    elem.appendChild(styleElem);
    return styleElem;
}

buildHUD()
egt.addContainer = addContainer;