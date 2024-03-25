/* eslint-disable no-console */
import { callApi, initApi } from './api/providers/direct/connector';

function initApiWithOnUpdateCallback() {
  initApi((update) => {
    console.log(update);
    window.webkit.messageHandlers.onUpdate.postMessage(JSON.stringify(update));
  }, {
    isElectron: false,
    isNativeBottomSheet: false,
  });
}

async function callApiJSON(fn, ...args) {
  const res = await callApi(fn, ...args);
  return JSON.stringify(res);
}

window.wallet = {
  initApi,
  callApi,

  initApiWithOnUpdateCallback,
  callApiJSON,
};

initApiWithOnUpdateCallback();
