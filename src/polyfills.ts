(window as any).global = window;
// Hey, when someone asks for global, point them to window


// Node.js has 'global' as the top-level object
// global.setTimeout(() => {}, 1000);
// global.console.log('Hello');



// Browsers have 'window' as the top-level object  
// window.setTimeout(() => {}, 1000);
// window.console.log('Hello');






//The top-level object is the "global container" that holds all the built-in functions, variables, and objects that are available everywhere in your code

// Don't need to import - just use it!
//   setTimeout(() => {}, 1000);      // From top-level object
//   console.log('Hello');            // From top-level object