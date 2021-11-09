let buffer = '';


document.addEventListener('keydown', (ev) => {
    updateBuffer(ev);
    updateDOM();
});

function updateDOM() {
    if (buffer.length > 4) {
        xpathSearch(buffer);
    }
}

function updateBuffer(ev) {
    // console.log(ev);
    if (ev.code === 'Space') {
        ev.preventDefault();
    }
    switch (ev.code) {
        case 'Space':
            ev.preventDefault();
            break;
        case 'Backspace':
            ev.preventDefault();
            if (buffer.length > 1) {
                buffer = buffer.slice(0, buffer.length-1);
            }
            break;
        case 'Delete':
            ev.preventDefault();
            buffer = '';
            break;
    }
    
    if (ev.key.length == 1) {
        buffer += ev.key;
    }
    console.log(buffer);
}

function xpathSearch(query) {
    let escapedQuery = query.replace("'", "\\'");
    escapedQuery = `.//*[contains(., '${escapedQuery}')]`;
    let results = xpath(escapedQuery, document);

    let validResults = [];
    let thisNode;

    try {
        do {
            thisNode = results.iterateNext();
            if (thisNode) {
                if (countXPathResultLength(xpath(escapedQuery, thisNode)) === 0) {
                    validResults.push(thisNode);
                }
            }
        } while (thisNode) 
    }
    catch (e) {
      console.trace(e);
    }
    console.info(validResults);
    return validResults;
}

function countXPathResultLength(res) {
    let count = 0;
    while (res.iterateNext()) {
        count++;
    }
    return count;
}

function xpath(query, node) {
    return document.evaluate(query, node, null, XPathResult.ANY_TYPE, null);
}