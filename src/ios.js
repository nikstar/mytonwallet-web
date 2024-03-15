/* eslint-disable no-console */
import { callApi, initApi } from './api';

(async () => {
  const api = initApi((update) => console.log(`update=${JSON.stringify(update).substring(0, 20)}`), {
    isElectron: false,
    isNativeBottomSheet: false,
  });
  const ok = await callApi('validateMnemonic', ['poo']);
  console.log(ok);
  console.log(`api=${JSON.stringify(api)}`);
})();

document.initApi = initApi;
document.callApi = callApi;
