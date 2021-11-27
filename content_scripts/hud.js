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

    addContainer(hud, 'typext-hud-dominant');
    addContainer(hud, 'typext-hud-weak');

    egt.hud = hud;
    return hud;
}

function addContainer(hud, typeClass) {
    const elem = hud.hudRoot;
    const hudContainer = document.createElement('box');
    hudContainer.classList.add('typext-hud-container');
    hudContainer.classList.add(typeClass);
    elem.prepend(hudContainer);

    const hudLeft = document.createElement('box');
    hudLeft.classList.add('typext-hud-textbox');
    hudLeft.classList.add('typext-hud-textleft');
    hudContainer.appendChild(hudLeft);

    const typedText = document.createElement('span');
    typedText.classList.add('typext-hud-typedtext');
    hudLeft.appendChild(typedText);

    const hudRight = document.createElement('box');
    hudRight.classList.add('typext-hud-textbox');
    hudRight.classList.add('typext-hud-textright');
    hudContainer.appendChild(hudRight);

    const wrongText = document.createElement('span');
    wrongText.classList.add('typext-hud-wrongtext');
    hudRight.appendChild(wrongText);

    const untypedText = document.createElement('span');
    untypedText.classList.add('typext-hud-untyped');
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
egt.buildHUD = buildHUD;