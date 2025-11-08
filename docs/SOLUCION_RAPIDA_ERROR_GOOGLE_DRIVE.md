# 🚨 Solución Rápida: Errores 400/403 al Conectar Google Drive

## ⚠️ Síntomas

Al intentar conectar Google Drive, ves en la consola:
- Error 400 (Bad Request)
- Error 403 (Forbidden)
- "Error en login"

## ✅ Solución Paso a Paso

### Paso 1: Verificar Google Cloud Console

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Selecciona tu proyecto
3. Haz clic en tu **OAuth 2.0 Client ID**

### Paso 2: Verificar "Authorized JavaScript origins"

Debe incluir **EXACTAMENTE** estas URLs (una por línea):

```
http://localhost:3000
https://idgleb.github.io
```

**⚠️ IMPORTANTE:**
- No incluyas `/Pos-sistema` al final
- No incluyas `http://` en URLs que deben ser `https://`
- Verifica que no haya espacios extra

### Paso 3: Verificar "Authorized redirect URIs"

Puede estar vacío o incluir:

```
http://localhost:3000
https://idgleb.github.io
```

### Paso 4: Verificar OAuth Consent Screen

1. Ve a: https://console.cloud.google.com/apis/credentials/consent
2. Verifica el **"Publishing status"**

#### Si dice "Testing":
- Haz clic en **"Test users"** o **"Usuarios de prueba"**
- Haz clic en **"+ ADD USERS"**
- Agrega tu email de Google (el que usas para iniciar sesión)
- Haz clic en **"SAVE"**

#### Si quieres publicar la app (recomendado):
1. Completa todos los campos requeridos:
   - Application home page: `https://idgleb.github.io/Pos-sistema/`
   - Privacy policy: `https://idgleb.github.io/privacy.html`
   - Terms of service: `https://idgleb.github.io/terms.html`
2. Haz clic en **"PUBLISH APP"**
3. Sigue el proceso de verificación

### Paso 5: Verificar Google Drive API

1. Ve a: https://console.cloud.google.com/apis/library
2. Busca "Google Drive API"
3. Verifica que esté **habilitada** (debe decir "API enabled")

### Paso 6: Esperar y Recargar

1. **Espera 15-30 minutos** después de hacer cambios en Google Cloud Console
2. **Limpia la caché del navegador:**
   - Presiona `Ctrl+Shift+Delete`
   - Selecciona "Caché" o "Cache"
   - Haz clic en "Eliminar datos"
3. **Recarga la página completamente:**
   - Presiona `Ctrl+F5` o `Ctrl+Shift+R`

### Paso 7: Verificar URL

Asegúrate de estar usando la URL correcta:
- **Desarrollo:** `http://localhost:3000`
- **Producción:** `https://idgleb.github.io/Pos-sistema/`

## 🔍 Verificación Rápida

### Checklist:

- [ ] Google Drive API está habilitada
- [ ] `http://localhost:3000` está en "Authorized JavaScript origins"
- [ ] `https://idgleb.github.io` está en "Authorized JavaScript origins"
- [ ] Si la app está en "Testing", tu email está en "Test users"
- [ ] O la app está publicada ("In production")
- [ ] Esperaste 15-30 minutos después de hacer cambios
- [ ] Limpiaste la caché del navegador
- [ ] Recargaste la página completamente (Ctrl+F5)

## 🐛 Si Sigue Sin Funcionar

### 1. Verifica el Client ID

Abre `src/lib/googleDriveBackup.js` y verifica que el Client ID sea correcto:

```javascript
const CLIENT_ID = '642034093723-k9clei5maqkr2q0ful3dhks4hnrgufnu.apps.googleusercontent.com';
```

Debe coincidir con el que ves en Google Cloud Console.

### 2. Prueba en Ventana de Incógnito

1. Abre una ventana de incógnito (Ctrl+Shift+N)
2. Ve a `http://localhost:3000`
3. Intenta conectar de nuevo

Esto descarta problemas de caché o extensiones.

### 3. Verifica los Popups

Asegúrate de que los popups no estén bloqueados:
- En Chrome: Verifica el icono de popup bloqueado en la barra de direcciones
- Permite popups para `localhost:3000` o `idgleb.github.io`

### 4. Revisa la Consola del Navegador

1. Presiona `F12` para abrir las herramientas de desarrollador
2. Ve a la pestaña "Console"
3. Busca errores específicos
4. Comparte el error exacto que ves

## 📝 Notas Importantes

- **Tiempo de propagación:** Los cambios en Google Cloud Console pueden tardar hasta 30 minutos
- **Caché:** Siempre limpia la caché después de hacer cambios
- **URLs exactas:** Las URLs deben coincidir EXACTAMENTE (sin espacios, sin trailing slashes innecesarios)
- **Modo Testing:** En modo Testing, SOLO los usuarios en la lista de testers pueden usar la app

## 🔗 Enlaces Útiles

- **Google Cloud Console - Credentials:** https://console.cloud.google.com/apis/credentials
- **Google Cloud Console - OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent
- **Google Cloud Console - APIs:** https://console.cloud.google.com/apis/library

---

**Si después de seguir estos pasos sigue sin funcionar, comparte:**
1. El error exacto que ves en la consola
2. El estado de "Publishing status" (Testing o In production)
3. Si tu email está en la lista de test users (si está en Testing)

