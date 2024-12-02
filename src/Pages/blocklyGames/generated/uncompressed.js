// Automatically generated file.  Do not edit!

// window.CLOSURE_NO_DEPS = true;

// (function() {
//   var srcs = [
//       // "/ss/test.js",
//       "/blocklyGames/base.js",
//       "/blocklyGames/global.js",
//       "/blocklyGames/msg.js",
//       "/blocklyGames/lib-games.js",
//       "/blocklyGames/html.js",
//       "/blocklyGames/main.js"
//   ];
//   function loadScript() {
//     var src = srcs.shift();
//     if (src) {
//       var script = document.createElement('script');
//       script.src = src;
//       script.type = 'text/javascript';
//       script.onload = loadScript;
//       document.head.appendChild(script);
//     }
//   }
//   loadScript();
// })();


import React, { useEffect } from 'react';

const UncompressedLoader = ({ lang, onLoadComplete }) => {
  useEffect(() => {
    console.log('UncompressedLoader mounted');

    // Código para carregar scripts
    const baseUrls = [
      "/Pages/blocklyGames/test.js"
      // "/Pages/blocklyGames/base.js",
      // "/Pages/blocklyGames/global.js",
      // "/Pages/blocklyGames/lib-games.js",
      // "/Pages/blocklyGames/html.js",
      // "/Pages/blocklyGames/main.js"
    ];
    
    const langUrl = `/Pages/blocklyGames/generated/msg/${lang}.js`;

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.onload = () => {
          console.log(`Script loaded from ${src}`);
          resolve(src);
        };
        script.onerror = () => {
          console.error(`Failed to load script from ${src}`);
          reject(new Error(`Failed to load script: ${src}`));
        };
        document.head.appendChild(script);
      });
    };

    const loadScriptsSequentially = async () => {
      try {
        await loadScript(langUrl);
        console.log(`Loaded language script from ${langUrl}`);

        for (const src of baseUrls) {
          await loadScript(src);
          console.log(`Loaded script from ${src}`);
        }

        if (onLoadComplete) {
          onLoadComplete();
        }
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    loadScriptsSequentially();

    // Cleanup function to remove scripts if needed
    return () => {
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => document.head.removeChild(script));
    };
  }, [lang, onLoadComplete]);

  console.log('UncompressedLoader rendered');
  return null; // Não renderiza nada na tela
};

export default UncompressedLoader;