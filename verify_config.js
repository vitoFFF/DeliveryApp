const { getConfig } = require('@expo/config');
const path = require('path');

const projectRoot = path.resolve(__dirname);
const { exp } = getConfig(projectRoot);

console.log('Google Maps API Key:', exp.android?.config?.googleMaps?.apiKey ? 'LOADED' : 'MISSING');
// Check if it matches the hardcoded one we saw earlier just in case, or if it's different.
// We won't print the actual key to avoid leaking it in logs if possible, but 'LOADED' is good enough.
if (exp.android?.config?.googleMaps?.apiKey) {
    console.log('Key length:', exp.android.config.googleMaps.apiKey.length);
}
