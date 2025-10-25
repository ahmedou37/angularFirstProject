// Global polyfills for browser environment - MUST BE AT THE TOP
(window as any).global = window;
(window as any).process = {
  env: {},
  version: '',
  nextTick: (callback: Function) => setTimeout(callback, 0)
};

// Import Angular bootstrap
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));