function buildHUD() {
    /*
    let ifram = document.createElement('iframe');
    ifram.src = chrome.runtime.getURL('content_html/hud.html');
    ifram.className = 'typext-hud-frame';
    document.body.appendChild(ifram);
    */

    let hudBody = document.body;
    let hudAnchor = document.createElement('div');
    hudBody.appendChild(hudAnchor);
    let hudShadow = hudAnchor.attachShadow({mode: 'open'});

    // Apply external styles to the shadow dom
    const styleElem = document.createElement('link');
    styleElem.setAttribute('rel', 'stylesheet');
    styleElem.setAttribute('href', chrome.runtime.getURL('content_styles/content.css'));
    hudShadow.appendChild(styleElem);

    const hudRoot = document.createElement('box');
    hudRoot.className = 'typext-hud-frame';
    hudShadow.appendChild(hudRoot);

    const hudContainer = document.createElement('box');
    hudContainer.classList.add('typext-hud-container');
    hudContainer.classList.add('typext-hud-dominant');
    hudRoot.appendChild(hudContainer);

    const hudLeft = document.createElement('box');
    hudLeft.classList.add('typext-hud-textbox');
    hudLeft.classList.add('typext-hud-textleft');
    hudLeft.textContent = 'qqqqqq';
    hudContainer.appendChild(hudLeft);

    const hudRight = document.createElement('box');
    hudRight.classList.add('typext-hud-textbox');
    hudRight.classList.add('typext-hud-textright');
    hudRight.textContent = 'caa';
    hudContainer.appendChild(hudRight);
}

buildHUD()
egt.buildHUD = buildHUD;