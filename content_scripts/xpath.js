"use strict";

let previousXpathStringSearch = [null, null];
function xpathStringSearch(query) {
    let [prevQuery, prevResult] = previousXpathStringSearch;
    if (prevQuery === query) {
        console.warn("Memoized result used in xpathStringSearch!");
        return [...prevResult];
    }

    let escapedQuery = query.replace("'", "\\'");
    escapedQuery = `.//*[contains(., '${escapedQuery}')]`;
    let results = xpath(escapedQuery, document);

    let validResults = [];
    let thisNode;

    try {
        do {
            thisNode = results.iterateNext();
            if (thisNode &&
                countXPathResultLength(xpath(escapedQuery, thisNode)) === 0 &&
                egt.isVisible(thisNode)) {
                    validResults.push(thisNode);
            }
        } while (thisNode) 
    }
    catch (e) {
      console.trace(e);
    }

    console.info(validResults);
    previousXpathStringSearch = [query, [...validResults]]

    return validResults;
}

function countXPathResultLength(res) {
    let count = 0;
    while (res.iterateNext()) {
        count++;
    }
    return count;
}

function xpath(query, node, type=XPathResult.ANY_TYPE) {
    return document.evaluate(query, node, null, type, null);
}


egt.xpathStringSearch = xpathStringSearch;
