function highlightBufferMatches(buffer) {
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
}

egt.highlightBufferMatches = highlightBufferMatches;