"use strict";

function showBufferMatches(buffer) {
    let elements;
    if (buffer.length > 4) {
        elements = egt.xpathStringSearch(buffer);
    } else {
        elements = [];
    }

    for (let el of egt.state.coloredElements) {
        if (!elements.includes(el)) {
            el.classList.remove(egt.consts.class.HIGHLIGHT);
        }
    }
    for (let el of elements) {
        el.classList.add(egt.consts.class.HIGHLIGHT);
    }
    egt.state.coloredElements = elements;

    updateLookingHUD(egt.state);

}

function updateLookingHUD(state) {
    if (!state.coloredElements.includes(state.focusedElement)) {
        if (state.focusedElement) {
            state.focusedElement.classList.remove(egt.consts.class.TYPED);
        }
        if (state.coloredElements.length === 0) {
            state.focusedElement = null;
            egt.HUD.TypedHUD.SetContent([['', state.buffer, '', '', '', '']])
            return;
        }

        state.focusedElement = state.coloredElements[0];
        state.focusedElement.classList.add(egt.consts.class.TYPED);
    }

    let idx = state.coloredElements.indexOf(state.focusedElement);
    let hudHeightCount = Math.min(TypedHUD.MAX_HEIGHT, state.coloredElements.length);
    let newContent = [];
    //egt.setHUDHeight(Math.min(egt.consts.HUD_HEIGHT+1, state.coloredElements.length));

    for (let i=idx; i<idx+hudHeightCount; ++i) {
        console.log({i})
        const elText = state.coloredElements[i%state.coloredElements.length].innerText;
        let textpos = elText.indexOf(state.buffer);
        newContent[i-idx] = [
            elText.slice(0, textpos),
            state.buffer,
            '', '', '',
            elText.slice(textpos+state.buffer.length)
        ];
    }
    console.log(newContent);
    egt.HUD.TypedHUD.SetContent(newContent);

    egt.state.focusedElement?.scrollIntoView(egt.consts.SCROLL_OPT);
}

function cycleFocusedLooking() {
    const cel = egt.state.coloredElements.length;
    if (cel > 1) {
        let idx = egt.state.coloredElements.indexOf(egt.state.focusedElement);
        idx = (idx+1) % cel;
        egt.state.focusedElement.classList.remove(egt.consts.class.TYPED);
        egt.state.focusedElement = egt.state.coloredElements[idx];
        egt.state.focusedElement.classList.add(egt.consts.class.TYPED);
        updateLookingHUD(egt.state);
    }
}

egt.showBufferMatches = showBufferMatches;
egt.cycleFocusedLooking = cycleFocusedLooking;