import { createApp } from 'ice';

const appConfig = {
  app: {
    rootId: 'ice-container',
  },
  request: {
    baseURL: 'http://localhost:9000'
  }
};
createApp(appConfig);
