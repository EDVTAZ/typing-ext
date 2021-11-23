function buildHUD() {
    let ifram = document.createElement('iframe');
    ifram.src = chrome.runtime.getURL('content_html/hud.html');
    ifram.className = 'typext-hud-frame';
    document.body.appendChild(ifram);
}

buildHUD()
egt.buildHUD = buildHUD;