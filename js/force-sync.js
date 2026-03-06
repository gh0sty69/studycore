// A script to forcefully overwrite the cloud database with local data
(async function forceSync() {
    console.log("Running Force Sync...");
    const USERS_KEY = 'sc_users';
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const localGhosty = users['ghosty'];

    if (!localGhosty) {
        console.error("Local 'ghosty' account not found.");
        return;
    }

    if (window.FirebaseModule && FirebaseModule.isAvailable()) {
        try {
            const db = FirebaseModule.getDB();
            console.log("Pushing local data to cloud (Force Overwrite)...");
            await db.ref('users/ghosty').set(localGhosty);
            console.log("Success! Cloud data has been wiped and replaced with local data.");
            alert("Force sync complete! Your Home computer data has successfully overwritten the cloud. You can now log in normally.");
        } catch (e) {
            console.error("Failed to force sync:", e);
        }
    } else {
        console.error("Firebase is not connected.");
    }
})();
