const CLIENT_ID = '642034093723-k9clei5maqkr2q0ful3dhks4hnrgufnu.apps.googleusercontent.com';
const SCOPES = 'openid profile email https://www.googleapis.com/auth/drive.file';
const GOOGLE_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

let tokenClient = null;
let isScriptLoaded = false;
let activeButton = null;

function loadGoogleScript() {
    if (isScriptLoaded) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = GOOGLE_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            isScriptLoaded = true;
            resolve();
        };
        script.onerror = () => reject(new Error('No se pudo cargar Google Identity Services'));
        document.head.appendChild(script);
    });
}

function ensureTokenClient() {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
        throw new Error('Google Identity Services no está disponible todavía.');
    }

    if (!tokenClient) {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (response) => {
                if (activeButton) {
                    activeButton.disabled = false;
                }
                if (response.error) {
                    updateStatus(`Error: ${response.error}`);
                    return;
                }

                const token = response.access_token ? 'token obtenido' : 'sin token';
                updateStatus(`Conectado correctamente (${token}).`);
            },
            error_callback: (error) => {
                if (activeButton) {
                    activeButton.disabled = false;
                }
                updateStatus(`Error: ${error.error}`);
            }
        });
    }

    return tokenClient;
}

function updateStatus(message) {
    const statusEl = document.getElementById('gdrive-test-status');
    if (statusEl) {
        statusEl.textContent = message;
    }
}

async function handleClick() {
    const button = document.getElementById('gdrive-test-btn');
    if (!button) return;

    activeButton = button;
    button.disabled = true;
    updateStatus('Cargando servicios de Google...');

    try {
        await loadGoogleScript();
        const client = ensureTokenClient();
        updateStatus('Solicitando permisos...');
        client.requestAccessToken({ prompt: 'consent' });
    } catch (error) {
        if (activeButton) {
            activeButton.disabled = false;
        }
        updateStatus(`Error al conectar: ${error.message}`);
        button.disabled = false;
    }
}

export function initGoogleDriveTestButton() {
    const button = document.getElementById('gdrive-test-btn');
    if (!button) return;

    button.addEventListener('click', () => {
        handleClick();
    });
}
