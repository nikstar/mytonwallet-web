import type { ApiInitArgs, OnApiUpdate } from '../types';

import { IS_CAPACITOR } from '../../config';
import { initWindowConnector } from '../../util/capacitorStorageProxy/connector';
import blockchains from '../blockchains';
import { connectUpdater, startStorageMigration } from '../common/helpers';
import { setEnvironment } from '../environment';
import { addHooks } from '../hooks';
import * as tonConnect from '../tonConnect';
import { resetupSseConnection, sendSseDisconnect } from '../tonConnect/sse';
import * as methods from '.';

addHooks({
  onDappDisconnected: sendSseDisconnect,
  onDappsChanged: resetupSseConnection,
  onSwapCreated: methods.setupSwapPolling,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function init(onUpdate: OnApiUpdate, args: ApiInitArgs) {
  connectUpdater(onUpdate);
  const environment = setEnvironment(args);

  if (IS_CAPACITOR) {
    initWindowConnector();
  }

  methods.initPolling(onUpdate, methods.isAccountActive);
  methods.initTransactions(onUpdate);
  methods.initStaking();
  methods.initSwap(onUpdate);
  methods.initNfts(onUpdate);

  if (environment.isDappSupported) {
    methods.initDapps(onUpdate);
    tonConnect.initTonConnect(onUpdate);
  }

  await startStorageMigration(onUpdate, blockchains.ton);

  if (environment.isSseSupported) {
    void resetupSseConnection();
  }
}
