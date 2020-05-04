import { createApp } from 'ice';


const appConfig = {
  app: {
    rootId: 'ice-container',
  },
  request: {
    baseURL: 'http://localhost:9001'
  }
};
createApp(appConfig);
