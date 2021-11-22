"use strict";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

globalThis.typext.sleep = sleep;
