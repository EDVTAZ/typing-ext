"use strict";

function buildHUD() {
    let hudAnchor = document.createElement('div');
    document.body.appendChild(hudAnchor);
    let hudShadowRoot = hudAnchor.attachShadow({mode: 'open'});

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

        const leftSpan = document.createElement('span');
        hudLeft.appendChild(leftSpan);
  
          const untypedLeft = document.createElement('span');
          untypedLeft.classList.add(egt.consts.class.HUD_UNTYPED);
          leftSpan.appendChild(untypedLeft);
      
          const typedText = document.createElement('span');
          typedText.classList.add(egt.consts.class.HUD_TYPED);
          leftSpan.appendChild(typedText);
      
          const leftWsPreserve = document.createElement('span');
          leftWsPreserve.classList.add(egt.consts.class.HUD_WSPRESERVE);
          leftWsPreserve.innerText = '_';
          leftSpan.appendChild(leftWsPreserve);
  
      const hudRight = document.createElement('box');
      hudRight.classList.add(egt.consts.class.TEXTBOX);
      hudRight.classList.add(egt.consts.class.TEXTRIGHT);
      hudContainer.appendChild(hudRight);

        const rightSpan = document.createElement('span');
        hudRight.appendChild(rightSpan);
      
          const rightWsPreserve = document.createElement  ('span');
          rightWsPreserve.classList.add(egt.consts.class.  HUD_WSPRESERVE);
          rightWsPreserve.innerText = '_';
          rightSpan.appendChild(rightWsPreserve);
  
          const wrongText = document.createElement('span');
          wrongText.classList.add(egt.consts.class.HUD_WRONG);
          rightSpan.appendChild(wrongText);
    
          const untypedText = document.createElement('span');
          untypedText.classList.add(egt.consts.class.HUD_UNTYPED);
          rightSpan.appendChild(untypedText);

    const container = {
        hudContainer,
        hudLeft,
        hudRight,
        untypedLeft,
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
    if (Math.min(height, egt.consts.HUD_HEIGHT+1) === curHeight) {
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
        for (let i=curHeight; i<Math.min(height,egt.consts.HUD_HEIGHT); ++i) {
            addContainer(egt.hud, egt.consts.class.WEAK);
        }
        if (height > egt.consts.HUD_HEIGHT) {
            addContainer(egt.hud, egt.consts.class.OVERFLOWED);
        }
    }
}

function setHUDContent(idx, untypedLeft, typed, mistyped, untypedRight) {
    if (untypedLeft !== null) {
        egt.hud.containers[idx].untypedLeft.innerText = untypedLeft;
    }
    egt.hud.containers[idx].typedText.innerText = typed;
    egt.hud.containers[idx].wrongText.innerText = mistyped;
    egt.hud.containers[idx].untypedText.innerText = untypedRight;
}

buildHUD()
egt.showHUD = showHUD;
egt.hideHUD = hideHUD;
egt.addContainer = addContainer;
egt.setHUDHeight = setHUDHeight;
egt.setHUDContent = setHUDContent;