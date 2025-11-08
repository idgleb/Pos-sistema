# 🚨 Solución: Error 403 en Google OAuth

## ⚠️ Problema

El error **403 (Forbidden)** en Google OAuth indica que el acceso está denegado. Esto puede deberse a varias razones:

1. **App en modo "Testing" sin tu email en la lista de testers**
2. **App no publicada** (debe estar "In production")
3. **URLs no configuradas correctamente** en Google Cloud Console
4. **Propiedad del sitio no verificada** en Google Search Console

---

## ✅ Solución Paso a Paso

### Paso 1: Verificar Estado de la App en Google Cloud Console

1. Ve a: https://console.cloud.google.com/apis/credentials/consent
2. Revisa el **"Publishing status"** (Estado de publicación)

#### Si dice "Testing":

**Opción A: Agregar tu email como Test User (Rápido)**
1. Haz clic en **"Test users"** o **"Usuarios de prueba"**
2. Haz clic en **"+ ADD USERS"** o **"+ AGREGAR USUARIOS"**
3. Agrega tu email: `idgleb646807@gmail.com` (o el que uses)
4. Haz clic en **"SAVE"** o **"GUARDAR"**
5. Espera 5-10 minutos
6. Intenta conectar de nuevo

**Opción B: Publicar la App (Recomendado para producción)**
1. Completa todos los campos requeridos en "OAuth consent screen"
2. Asegúrate de que:
   - Application home page: `https://idgleb.github.io/Pos-sistema/`
   - Privacy policy: `https://idgleb.github.io/Pos-sistema/privacy`
   - Terms of service: `https://idgleb.github.io/Pos-sistema/terms`
3. Haz clic en **"PUBLISH APP"** o **"PUBLICAR APP"**
4. Espera 15-30 minutos
5. Intenta conectar de nuevo

#### Si dice "In production":

Continúa con el Paso 2.

---

### Paso 2: Verificar URLs en Google Cloud Console

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Haz clic en tu **OAuth 2.0 Client ID**
3. Verifica que en **"Authorized JavaScript origins"** esté:
   - ✅ `https://idgleb.github.io`
   - ✅ `https://idgleb.github.io/Pos-sistema` (opcional pero recomendado)
   - ✅ `http://localhost:3000`
   - ✅ `http://localhost:5173`

4. Verifica que en **"Authorized redirect URIs"** esté:
   - ✅ `https://idgleb.github.io`
   - ✅ `https://idgleb.github.io/Pos-sistema` (opcional pero recomendado)
   - ✅ `http://localhost:3000`
   - ✅ `http://localhost:5173`

5. Haz clic en **"SAVE"** o **"GUARDAR"**
6. Espera 15-30 minutos para que los cambios se propaguen

---

### Paso 3: Verificar Propiedad del Sitio (Google Search Console)

1. Ve a: https://search.google.com/search-console
2. Verifica que la propiedad `https://idgleb.github.io` esté verificada
3. Si no está verificada, sigue los pasos en `SOLUCION_VERIFICACION_GOOGLE.md`

---

### Paso 4: Limpiar Caché y Probar de Nuevo

1. **Limpia la caché del navegador:**
   - Presiona `Ctrl+Shift+Delete`
   - Selecciona "Caché" o "Cache"
   - Haz clic en "Eliminar datos" o "Clear data"

2. **Recarga la página completamente:**
   - Presiona `Ctrl+F5` o `Ctrl+Shift+R`

3. **Intenta conectar de nuevo:**
   - Haz clic en "💾 Backup" → "☁️ Conectar Google Drive"
   - Debería aparecer el popup de Google

---

## 🔍 Verificación Final

Después de hacer los cambios:

1. ✅ Tu email está en "Test users" (si la app está en Testing)
2. ✅ La app está publicada ("In production")
3. ✅ Las URLs están correctas en "Authorized JavaScript origins"
4. ✅ Las URLs están correctas en "Authorized redirect URIs"
5. ✅ La propiedad del sitio está verificada en Google Search Console
6. ✅ Esperaste 15-30 minutos después de hacer cambios
7. ✅ Limpiaste la caché del navegador
8. ✅ Recargaste la página completamente

---

## 📝 Notas Importantes

- **Tiempo de propagación:** Los cambios en Google Cloud Console pueden tardar hasta 30 minutos en aplicarse
- **Caché del navegador:** Siempre limpia la caché después de hacer cambios
- **Modo Testing vs Production:** En modo Testing, solo los usuarios en la lista de testers pueden usar la app
- **Verificación del sitio:** Google puede requerir que verifiques la propiedad del sitio antes de aprobar la app

---

## 🔗 Enlaces Útiles

- **Google Cloud Console - OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent
- **Google Cloud Console - Credentials:** https://console.cloud.google.com/apis/credentials
- **Google Search Console:** https://search.google.com/search-console

---

## ❓ Si Sigue Sin Funcionar

1. **Verifica la consola del navegador (F12):**
   - Busca errores específicos
   - Comparte el error exacto que ves

2. **Verifica que el Client ID sea correcto:**
   - Debe terminar en `.apps.googleusercontent.com`
   - Debe coincidir con el que está en `src/lib/googleDriveBackup.js`

3. **Prueba en una ventana de incógnito:**
   - Esto descarta problemas de caché o extensiones

4. **Verifica que los popups no estén bloqueados:**
   - El navegador debe permitir popups para `https://idgleb.github.io`

---

¡Una vez completados estos pasos, el error 403 debería resolverse!

