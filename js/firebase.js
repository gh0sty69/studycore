/* Firebase Module — Config & Init */
const FirebaseModule = (() => {
    let db = null;
    let initialized = false;

    function getConfig() {
        try {
            const raw = localStorage.getItem('sc_firebase_config');
            if (!raw) return null;
            return JSON.parse(raw);
        } catch { return null; }
    }

    function saveConfig(config) {
        localStorage.setItem('sc_firebase_config', JSON.stringify(config));
    }

    function init() {
        if (initialized) return db;
        const config = getConfig();
        if (!config || !config.apiKey || !config.databaseURL) return null;
        try {
            // Check if already initialized
            if (firebase.apps.length === 0) {
                firebase.initializeApp(config);
            }
            db = firebase.database();
            initialized = true;
            return db;
        } catch (err) {
            console.error('Firebase init error:', err);
            return null;
        }
    }

    function isAvailable() {
        if (!initialized) init();
        return db !== null;
    }

    function getDB() {
        if (!initialized) init();
        return db;
    }

    function reset() {
        db = null;
        initialized = false;
    }

    return { getConfig, saveConfig, init, isAvailable, getDB, reset };
})();
