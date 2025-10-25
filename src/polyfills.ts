/**
 * Polyfills for browser environment
 */

// Global polyfill for Node.js global object
(window as any).global = window;

// Process polyfill for libraries that expect Node.js process
(window as any).process = {
  env: {},
  version: '',
  nextTick: (callback: Function) => setTimeout(callback, 0)
};

// Buffer polyfill (if needed)
// (window as any).Buffer = (window as any).Buffer || require('buffer').Buffer;