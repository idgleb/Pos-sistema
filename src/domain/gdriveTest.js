const CLIENT_ID = '642034093723-k9clei5maqkr2q0ful3dhks4hnrgufnu.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let loadPromise = null;
let authInstance = null;

const loadGapiScript = () => {
    if (document.querySelector('script[src="https://apis.google.com/js/api.js"]')) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('No se pudo cargar Google API (api.js).'));
        document.head.appendChild(script);
    });
};

const initAuth = () => {
    if (authInstance) {
        return Promise.resolve(authInstance);
    }

    return new Promise((resolve, reject) => {
        window.gapi.load('client:auth2', async () => {
            try {
                authInstance = await window.gapi.auth2.init({
                    client_id: CLIENT_ID,
                    scope: SCOPES,
                    fetch_basic_profile: true,
                    ux_mode: 'popup'
                });
                resolve(authInstance);
            } catch (error) {
                console.warn('Fallo inicializando auth2 (normal si el iframe está bloqueado):', error);
                try {
                    authInstance = window.gapi.auth2.getAuthInstance();
                    if (authInstance) {
                        resolve(authInstance);
                        return;
                    }
                } catch (innerError) {
                    console.error('No se pudo obtener authInstance:', innerError);
                }
                reject(error);
            }
        });
    });
};

export const ensureAuthReady = async () => {
    if (loadPromise) {
        await loadPromise;
        return authInstance ?? null;
    }

    loadPromise = (async () => {
        await loadGapiScript();
        if (!window.gapi) {
            throw new Error('Google API no está disponible en la ventana.');
        }
        try {
            await initAuth();
        } catch (error) {
            // Aunque falle la inicialización del iframe, permitir el popup al hacer click
            console.warn('Continuando pese al error de inicialización, el popup debería funcionar.');
        }
        return authInstance ?? window.gapi?.auth2?.getAuthInstance() ?? null;
    })();

    return loadPromise;
};

export const connectGoogleDriveTest = async () => {
    await ensureAuthReady();

    if (!window.gapi?.auth2) {
        throw new Error('Google Auth2 no está disponible. Recarga la página e inténtalo de nuevo.');
    }

    if (!authInstance) {
        try {
            authInstance = window.gapi.auth2.getAuthInstance();
        } catch (error) {
            console.error('No se pudo recuperar authInstance:', error);
        }
    }

    if (!authInstance) {
        authInstance = await window.gapi.auth2.init({
            client_id: CLIENT_ID,
            scope: SCOPES,
            fetch_basic_profile: true
        });
    }

    const user = await authInstance.signIn({ prompt: 'select_account' });
    const profile = user.getBasicProfile?.();

    return {
        email: profile?.getEmail?.() ?? 'Cuenta conectada',
        name: profile?.getName?.() ?? null
    };
};

export const disconnectGoogleDriveTest = async () => {
    if (!window.gapi?.auth2) {
        return;
    }

    if (!authInstance) {
        authInstance = window.gapi.auth2.getAuthInstance?.();
    }

    if (authInstance) {
        await authInstance.signOut();
    }
};
