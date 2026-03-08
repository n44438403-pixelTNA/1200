export const safeSetLocalStorage = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
            console.warn('LocalStorage quota exceeded. Attempting to clear non-essential data...');
            // Preserve essential keys
            const essentialKeys = ['nst_current_user', 'nst_system_settings', 'nst_users', 'nst_admin_codes', 'app_session_splash', 'nst_has_seen_welcome'];
            const keysToKeep: Record<string, string | null> = {};

            essentialKeys.forEach(k => {
                keysToKeep[k] = localStorage.getItem(k);
            });

            // Clear everything
            localStorage.clear();

            // Restore essentials
            essentialKeys.forEach(k => {
                if (keysToKeep[k] !== null) {
                    localStorage.setItem(k, keysToKeep[k] as string);
                }
            });

            // Try setting the new value again
            try {
                localStorage.setItem(key, value);
            } catch (err) {
                console.error('Failed to set item even after clearing cache:', err);
            }
        } else {
            console.error('Error setting localStorage:', e);
        }
    }
};
