'use strict';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(function (registration) {
            console.log('Registration successful. SW has scope: ', registration.scope);
        }).catch(function (err) {
            console.warn('Registration failed with error: ', err);
        });
}