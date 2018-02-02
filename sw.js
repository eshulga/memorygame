'use strict';
importScripts('sw-toolbox.js');
toolbox.precache(['index.html','css/style.css', 'js/main.js']);
toolbox.router.get('/ico/*', toolbox.cacheFirst);
toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});