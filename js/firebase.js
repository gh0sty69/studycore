/* Firebase Module — Config & Init */
const FirebaseModule = (() => {
    let db = null;
    let initialized = false;

    const HARDCODED_CONFIG = {
        apiKey: "AIzaSyAgSEZlSO8ox2GEto8xZpsNwcYIEhDyW0w",
        authDomain: "studycore-eb796.firebaseapp.com",
        databaseURL: "https://studycore-eb796-default-rtdb.firebaseio.com",
        projectId: "studycore-eb796",
        storageBucket: "studycore-eb796.firebasestorage.app",
        messagingSenderId: "960217883711",
        appId: "1:960217883711:web:fcbc596465115723f6448a"
    };

    function getConfig() {
        try {
            const raw = localStorage.getItem('sc_firebase_config');
            if (raw) return JSON.parse(raw);
        } catch { }
        return HARDCODED_CONFIG;
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
