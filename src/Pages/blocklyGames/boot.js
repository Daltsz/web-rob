/**
 * @license
 * Copyright 2014 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Load the correct language pack and code bundle.
 * @author fraser@google.com (Neil Fraser)
 */
// 'use strict';

// Redirect to new domain.
// if (location.host === 'blockly-games.appspot.com') {
//   location.replace('https://blockly.games' +
//       location.pathname + location.search + location.hash);
// }



// const appName = (() => {
//   const match  = location.pathname.match(/\/([-\w]+)(\.html)?$/);
//   return match ? match[1].replace('-', '/') : 'index';
// })();


// const supportedLanguages = [
//   'am', 'ar', 'be', 'be-tarask', 'bg', 'bn', 'br', 'ca', 'cs', 'da', 'de',
//   'el', 'en', 'eo', 'es', 'eu', 'fa', 'fi', 'fo', 'fr', 'gl', 'ha', 'he',
//   'hi', 'hr', 'hu', 'hy', 'ia', 'id', 'ig', 'is', 'it', 'ja', 'kab', 'kn',
//   'ko', 'lt', 'lv', 'ms', 'my', 'nb', 'nl', 'pl', 'pms', 'pt', 'pt-br',
//   'ro', 'ru', 'sc', 'sk', 'sl', 'sq', 'sr', 'sr-latn', 'sv', 'th', 'ti',
//   'tr', 'uk', 'ur', 'vi', 'yo', 'zh-hans', 'zh-hant'
// ];


// const getLanguage = () => {
//   let lang = new URLSearchParams(location.search).get('lang');
//   if (lang && supportedLanguages.includes(lang)) {
//     document.cookie = `lang=${encodeURIComponent(lang)}; expires=${new Date(Date.now() + 2 * 31536000000).toUTCString()}; path=/`;
//   } else {
//     const cookieLang = document.cookie.match(/(^|;)\s*lang=([\w\-]+)/);
//     lang = cookieLang ? decodeURIComponent(cookieLang[2]) : null;
//     if (!supportedLanguages.includes(lang)) {
//       lang = navigator.language;
//       if (!supportedLanguages.includes(lang)) {
//         lang = 'en';
//       }
//     }
//   }
//   return lang
// };

// const lang = getLanguage();
// window['BlocklyGamesLang'] = lang;


// const loadScript = (src) => {
//   const script = document.createElement('script');
//   script.src = src;
//   script.type = 'module'; // Use 'module' for ES6
//   document.head.appendChild(script);
// };

// loadScript(debug ? `generated/msg/${lang}.js` : `${appName}/generated/msg/${lang}.js`);
// loadScript(debug ? `${appName}/generated/uncompressed.js` : `${appName}/generated/compressed.js`);


// (function() {
//   // Application path.
//   var appName = location.pathname.match(/\/([-\w]+)(\.html)?$/);
//   appName = appName ? appName[1].replace('-', '/') : 'index';

//   // Supported languages (consistent across all apps).
//   const supportedLanguages = [
//     'am', 'ar', 'be', 'be-tarask', 'bg', 'bn', 'br', 'ca', 'cs', 'da', 'de',
//     'el', 'en', 'eo', 'es', 'eu', 'fa', 'fi', 'fo', 'fr', 'gl', 'ha', 'he',
//     'hi', 'hr', 'hu', 'hy', 'ia', 'id', 'ig', 'is', 'it', 'ja', 'kab', 'kn',
//     'ko', 'lt', 'lv', 'ms', 'my', 'nb', 'nl', 'pl', 'pms', 'pt', 'pt-br',
//     'ro', 'ru', 'sc', 'sk', 'sl', 'sq', 'sr', 'sr-latn', 'sv', 'th', 'ti',
//     'tr', 'uk', 'ur', 'vi', 'yo', 'zh-hans', 'zh-hant'
//   ];

//   window['BlocklyGamesLanguages'] = supportedLanguages;

//   // Use a series of heuristics that determine the likely language of this user.
//   const getLanguage = () => {
//     let lang = new URLSearchParams(location.search).get('lang');
//     if (lang && supportedLanguages.includes(lang)) {
//       // Save this explicit choice as cookie.
//       document.cookie = `lang=${encodeURIComponent(lang)}; expires=${new Date(Date.now() + 2 * 31536000000).toUTCString()}; path=/`;
//     } else {
//       // Second choice: Language cookie.
//       const cookieLang = document.cookie.match(/(^|;)\s*lang=([\w\-]+)/);
//       lang = cookieLang ? decodeURIComponent(cookieLang[2]) : null;
//       if (!supportedLanguages.includes(lang)) {
//         // Third choice: The browser's language.
//         lang = navigator.language;
//         if (!supportedLanguages.includes(lang)) {
//           // Fourth choice: English.
//           lang = 'en';
//         }
//       }
//     }
//     return lang;
//   };

//   const lang = getLanguage();
//   window['BlocklyGamesLang'] = lang;

//   var debug = true;
//   try {
//     // debug = !!sessionStorage.getItem('debug');
//     console.log(debug);
//     if (debug) {
//       console.info('Loading uncompressed JavaScript.');
//     }
//   } catch (e) {
//     // Don't even think of throwing an error.
//   }

//   var script = document.createElement('script');
//   if (debug) {
//     script.src = '/generated/msg/' + lang + '.js';
//     console.log('Loading language script:', script.src);
//   } else {
//     script.src = appName + '/generated/msg/' + lang + '.js';
//     console.log('Loading language script:', script.src);
//   }
//   script.type = 'text/javascript';
//   document.head.appendChild(script);
  
//   script = document.createElement('script');
//   if (debug) {
//     script.src = appName + '/generated/uncompressed.js';
//     console.log('Loading uncompressed script:', script.src);
//   } else {
//     script.src = appName + '/generated/compressed.js';
//     console.log('Loading compressed script:', script.src);
//   }
//   script.type = 'text/javascript';
//   document.head.appendChild(script);
// })();





// (function() {
//   // Obtendo `location` de forma segura
//   const currentLocation = window.location;
  
//   // Application path.
//   let appName = currentLocation.pathname.match(/\/([-\w]+)(\.html)?$/);
//   appName = appName ? appName[1].replace('-', '/') : 'index';

//   // Supported languages (consistent across all apps).
//   const supportedLanguages = [
//     'am', 'ar', 'be', 'be-tarask', 'bg', 'bn', 'br', 'ca', 'cs', 'da', 'de',
//     'el', 'en', 'eo', 'es', 'eu', 'fa', 'fi', 'fo', 'fr', 'gl', 'ha', 'he',
//     'hi', 'hr', 'hu', 'hy', 'ia', 'id', 'ig', 'is', 'it', 'ja', 'kab', 'kn',
//     'ko', 'lt', 'lv', 'ms', 'my', 'nb', 'nl', 'pl', 'pms', 'pt', 'pt-br',
//     'ro', 'ru', 'sc', 'sk', 'sl', 'sq', 'sr', 'sr-latn', 'sv', 'th', 'ti',
//     'tr', 'uk', 'ur', 'vi', 'yo', 'zh-hans', 'zh-hant'
//   ];

//   window['BlocklyGamesLanguages'] = supportedLanguages;

//   // Use a series of heuristics that determine the likely language of this user.
//   const getLanguage = () => {
//     const urlParams = new URLSearchParams(currentLocation.search);
//     let lang = urlParams.get('lang');

//     if (lang && supportedLanguages.includes(lang)) {
//       // Save this explicit choice as a cookie.
//       document.cookie = `lang=${encodeURIComponent(lang)}; expires=${new Date(Date.now() + 2 * 31536000000).toUTCString()}; path=/`;
//     } else {
//       // Second choice: Language cookie.
//       const cookieLang = document.cookie.match(/(^|;)\s*lang=([\w\-]+)/);
//       lang = cookieLang ? decodeURIComponent(cookieLang[2]) : null;

//       if (!supportedLanguages.includes(lang)) {
//         // Third choice: The browser's language.
//         lang = navigator.language;

//         if (!supportedLanguages.includes(lang)) {
//           // Fourth choice: English.
//           lang = 'en';
//         }
//       }
//     }
//     return lang;
//   };

//   const lang = getLanguage();
//   window['BlocklyGamesLang'] = lang;

//   let debug = true;
//   try {
//     // debug = !!sessionStorage.getItem('debug');
//     console.log(debug);
//     if (debug) {
//       console.info('Loading uncompressed JavaScript.');
//     }
//   } catch (e) {
//     // Don't even think of throwing an error.
//   }

//   let script = document.createElement('script');
//   if (debug) {
//     script.src = `/generated/msg/${lang}.js`;
//     console.log('Loading language script:', script.src);
//   } else {
//     script.src = `${appName}/generated/msg/${lang}.js`;
//     console.log('Loading language script:', script.src);
//   }
//   script.type = 'text/javascript';
//   document.head.appendChild(script);

//   script = document.createElement('script');
//   if (debug) {
//     script.src = `${appName}/generated/uncompressed.js`;
//     console.log('Loading uncompressed script:', script.src);
//   } else {
//     script.src = `${appName}/generated/compressed.js`;
//     console.log('Loading compressed script:', script.src);
//   }
//   script.type = 'text/javascript';
//   document.head.appendChild(script);
// })();


import { useEffect, useState } from 'react';
import UncompressedLoader from './generated/uncompressed.js';

const useBlocklyGamesLoader = () => {
  const [lang, setLang] = useState('en');
  const [debug, setDebug] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    // Obtendo `location` de forma segura
    const currentLocation = window.location;

    // Application path.
    let appName = currentLocation.pathname.match(/\/([-\w]+)(\.html)?$/);
    appName = appName ? appName[1].replace('-', '/') : 'index';

    // Supported languages (consistent across all apps).
    const supportedLanguages = [
      'am', 'ar', 'be', 'be-tarask', 'bg', 'bn', 'br', 'ca', 'cs', 'da', 'de',
      'el', 'en', 'eo', 'es', 'eu', 'fa', 'fi', 'fo', 'fr', 'gl', 'ha', 'he',
      'hi', 'hr', 'hu', 'hy', 'ia', 'id', 'ig', 'is', 'it', 'ja', 'kab', 'kn',
      'ko', 'lt', 'lv', 'ms', 'my', 'nb', 'nl', 'pl', 'pms', 'pt', 'pt-br',
      'ro', 'ru', 'sc', 'sk', 'sl', 'sq', 'sr', 'sr-latn', 'sv', 'th', 'ti',
      'tr', 'uk', 'ur', 'vi', 'yo', 'zh-hans', 'zh-hant'
    ];

     // Função para determinar o idioma
     const getLanguage = () => {
      const urlParams = new URLSearchParams(currentLocation.search);
      let lang = urlParams.get('lang');

      if (lang && supportedLanguages.includes(lang)) {
        // Salva a escolha explícita como cookie
        document.cookie = `lang=${encodeURIComponent(lang)}; expires=${new Date(Date.now() + 2 * 31536000000).toUTCString()}; path=/`;
      } else {
        // Segunda escolha: Cookie de idioma
        const cookieLang = document.cookie.match(/(^|;)\s*lang=([\w\-]+)/);
        lang = cookieLang ? decodeURIComponent(cookieLang[2]) : null;

        if (!supportedLanguages.includes(lang)) {
          // Terceira escolha: Idioma do navegador
          lang = navigator.language;

          if (!supportedLanguages.includes(lang)) {
            // Quarta escolha: Inglês
            lang = 'en';
          }
        }
      }
      return lang;
    };

    const lang = getLanguage();
    setLang(lang);

    // Define o modo de depuração
    try {
      // debug = !!sessionStorage.getItem('debug');
      setDebug(true);  // Pode personalizar a lógica para definir o debug com base em suas necessidades
      console.log(debug);
      if (debug) {
        console.info('Loading uncompressed JavaScript.');
      }
    } catch (e) {
      // Tratar erros de forma adequada
    }

    // Carregar os scripts necessários
    // const loadScript = (src, onLoad, onError) => {
    //   const script = document.createElement('script');
    //   script.src = src;
    //   script.type = 'text/javascript';
    //   script.onload = onLoad;
    //   script.onerror = onError;
    //   document.head.appendChild(script);
    // };

    // const loadScript = async (scriptContent) => {
    //   const script = document.createElement('script');
    //   script.type = 'text/javascript';
    //   script.text = scriptContent;
    //   document.head.appendChild(script);
    // };
    // const loadScript = async (url) => {
    //   try {
    //     const response = await fetch(url);
    //     const scriptContent = await response.text();

    //     const script = document.createElement('script');
    //     script.type = 'text/javascript';
    //     script.text = scriptContent;
    //     document.head.appendChild(script);

    //     console.log(`Loaded script from ${url}`);
    //   } catch (error) {
    //     console.error(`Error loading script from ${url}:`, error);
    //   }
    // };


    //  loadScript(`/Pages/blocklyGames/generated/msg/${lang}.js`);
    //  loadScript(`/Pages/blocklyGames/generated/uncompressed.js`);

    // loadScript(uncompressedScript)
    // // Corrigir os caminhos dos scripts
    // loadScript(`/Pages/blocklyGames/generated/msg/${lang}.js`, 
    //   () => console.info('Language script loaded'), 
    //   (error) => console.error('Error loading language script:', error)
    // );

    // loadScript(`/Pages/blocklyGames/generated/${debug ? 'uncompressed' : 'compressed'}.js`, 
    //   () => console.info('uncompressed script loaded'), 
    //   (error) => console.error('Error loading uncompressed script:', error)
    // );

  }, [debug]);

  return(
    <div>
      <UncompressedLoader
        lang="en"
        onLoadComplete={() => setScriptsLoaded(true)}
      />
      {scriptsLoaded ? <p>Scripts loaded successfully!</p> : <p>Loading scripts...</p>}
    </div>
  );
};

export default useBlocklyGamesLoader;
