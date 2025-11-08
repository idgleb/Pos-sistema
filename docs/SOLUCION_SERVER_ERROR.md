# 🚨 Solución: Error "server_error" en Google OAuth

## ⚠️ Problema

Después de hacer clic en "Continuar" en la pantalla de consentimiento de Google, aparece el error **"server_error"**. Esto significa que Google aceptó el consentimiento, pero hubo un problema al procesar la autorización.

## 🎯 Causa Principal

El error **"server_error"** generalmente ocurre porque:

1. **Tu email NO está en la lista de "Test users"** (si la app está en modo "Testing")
2. **La app está en modo "Testing"** y solo los usuarios en la lista pueden usar la app
3. **Problemas de configuración** en Google Cloud Console

## ✅ Solución Paso a Paso

### Paso 1: Agregar tu Email como Test User (SOLUCIÓN RÁPIDA)

1. **Ve a Google Cloud Console:**
   - https://console.cloud.google.com/apis/credentials/consent

2. **Haz clic en "Test users" o "Usuarios de prueba"**
   - Está en el menú lateral izquierdo o en la sección principal

3. **Haz clic en "+ ADD USERS" o "+ AGREGAR USUARIOS"**

4. **Agrega tu email:**
   - `gleb.ursol@davinci.edu.ar` (el email que usaste para iniciar sesión)
   - Puedes agregar múltiples emails si necesitas

5. **Haz clic en "SAVE" o "GUARDAR"**

6. **Espera 5-10 minutos** para que los cambios se propaguen

7. **Recarga la página** de tu aplicación (Ctrl+F5)

8. **Vuelve a intentar** conectar Google Drive

### Paso 2: Verificar que el Email Esté Agregado

1. Vuelve a la sección "Test users"
2. Verifica que `gleb.ursol@davinci.edu.ar` aparezca en la lista
3. Si no aparece, repite el Paso 1

### Paso 3: Publicar la App (SOLUCIÓN PERMANENTE)

Si quieres que cualquier usuario pueda usar la app sin agregarlos manualmente:

1. **Completa todos los campos requeridos** en "OAuth consent screen":
   - App name: "POS System" (o tu nombre preferido)
   - User support email: Tu email
   - Application home page: `https://idgleb.github.io/Pos-sistema/`
   - Privacy policy: `https://idgleb.github.io/privacy.html`
   - Terms of service: `https://idgleb.github.io/terms.html`

2. **Haz clic en "PUBLISH APP" o "PUBLICAR APP"**

3. **Confirma la publicación**

4. **Espera la revisión de Google** (puede tardar varios días)

5. **Una vez aprobada**, cualquier usuario podrá usar la app

---

## 🔍 Verificación

Después de agregar tu email como Test User:

1. ✅ Tu email (`gleb.ursol@davinci.edu.ar`) está en "Test users"
2. ✅ Esperaste 5-10 minutos después de guardar
3. ✅ Recargaste la página completamente (Ctrl+F5)
4. ✅ Limpiaste la caché del navegador (opcional pero recomendado)
5. ✅ Intentaste conectar de nuevo

---

## 📝 Notas Importantes

- **Tiempo de propagación:** Los cambios pueden tardar 5-10 minutos en aplicarse
- **Caché del navegador:** Limpia la caché si el problema persiste
- **Email exacto:** Asegúrate de usar el mismo email que usas para iniciar sesión en Google
- **Modo Testing:** En modo Testing, SOLO los usuarios en la lista pueden usar la app
- **Modo Production:** En modo Production, cualquier usuario puede usar la app (después de la revisión de Google)

---

## 🔗 Enlaces Útiles

- **Google Cloud Console - OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent
- **Google Cloud Console - Test Users:** https://console.cloud.google.com/apis/credentials/consent (sección "Test users")
- **Tu aplicación:** https://idgleb.github.io/Pos-sistema/

---

## ❓ Si Sigue Sin Funcionar

1. **Verifica que el email sea correcto:**
   - Debe ser exactamente el mismo que usas para iniciar sesión
   - Verifica que no haya espacios extra

2. **Verifica el estado de la app:**
   - Si está en "Testing", solo los test users pueden usar la app
   - Si está en "In production", cualquier usuario puede usar la app (después de la revisión)

3. **Verifica las URLs:**
   - Asegúrate de que `https://idgleb.github.io` esté en "Authorized JavaScript origins"
   - Asegúrate de que `https://idgleb.github.io` esté en "Authorized redirect URIs"

4. **Espera más tiempo:**
   - A veces los cambios tardan hasta 30 minutos en aplicarse

5. **Prueba en una ventana de incógnito:**
   - Esto descarta problemas de caché o extensiones

---

## ✅ Resumen

**El error "server_error" se resuelve agregando tu email a la lista de "Test users" en Google Cloud Console.**

1. Ve a: https://console.cloud.google.com/apis/credentials/consent
2. Haz clic en "Test users"
3. Agrega: `gleb.ursol@davinci.edu.ar`
4. Guarda y espera 5-10 minutos
5. Recarga la página y vuelve a intentar

¡Después de esto, el error debería desaparecer!

