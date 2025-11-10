# Solucionar Error: Scope de Google Drive No Incluido

## 🔴 Problema

Cuando intentas conectar Google Drive por primera vez, recibes este error:

```
❌ ERROR: El token no incluye el scope de Google Drive necesario.
```

Esto significa que aunque el código está solicitando el permiso de Google Drive, Google no lo está otorgando porque **no está habilitado en la pantalla de consentimiento de OAuth**.

## ✅ Solución Paso a Paso

### Paso 1: Verificar que Google Drive API esté habilitada

1. Ve a: https://console.cloud.google.com/apis/library/drive.googleapis.com
2. Busca "Google Drive API"
3. Si no está habilitada, haz clic en **"ENABLE"**
4. Espera a que se habilite completamente

### Paso 2: Ir a la pantalla de consentimiento

1. Ve a: https://console.cloud.google.com/apis/credentials/consent
2. Selecciona tu proyecto (si tienes varios)

### Paso 3: Agregar los scopes necesarios

1. En la sección **"Scopes"**, haz clic en **"ADD OR REMOVE SCOPES"**
2. En el cuadro de búsqueda, busca: `drive.file`
3. Marca la casilla: ✅ **`https://www.googleapis.com/auth/drive.file`**
4. También verifica que estos scopes estén marcados:
   - ✅ `https://www.googleapis.com/auth/userinfo.email`
   - ✅ `https://www.googleapis.com/auth/userinfo.profile`
   - ✅ `openid`
5. Haz clic en **"UPDATE"**
6. Haz clic en **"SAVE AND CONTINUE"** (puede aparecer varias veces, sigue guardando hasta llegar al final)

### Paso 4: Verificar usuarios de prueba (si la app está en modo Testing)

1. En la misma pantalla, ve a la sección **"Test users"**
2. Haz clic en **"ADD USERS"**
3. Agrega tu email de Google (el que usas para conectarte)
4. Haz clic en **"ADD"**
5. Guarda los cambios

### Paso 5: Esperar propagación

- Espera **5-10 minutos** para que los cambios se propaguen en los servidores de Google
- Esto es importante, los cambios no son instantáneos

### Paso 6: Revocar permisos anteriores (MUY IMPORTANTE)

1. Ve a: https://myaccount.google.com/permissions
2. Busca "POS Sistema" o el nombre de tu app
3. Haz clic en **"Remove access"** o **"Eliminar acceso"**
4. Confirma la eliminación

**¿Por qué es importante esto?**
- Google puede estar usando permisos antiguos que no incluyen el scope de Drive
- Al revocar los permisos, forzamos a Google a solicitar nuevos permisos con los scopes correctos

### Paso 7: Recargar la aplicación

1. En tu navegador, presiona **Ctrl+F5** (o Cmd+Shift+R en Mac)
2. Esto fuerza una recarga completa sin usar caché

### Paso 8: Intentar conectar nuevamente

1. Haz clic en **"Conectar Google Drive"**
2. Acepta todos los permisos que se soliciten
3. Debería funcionar correctamente ahora

## 🔍 Verificación

Después de seguir estos pasos, cuando te conectes deberías ver en la consola:

```
✅ Token incluye scope de Google Drive: [scopes con drive.file incluido]
```

## ❓ Si sigue fallando

1. **Verifica el Client ID**: Debe ser exactamente:
   ```
   642034093723-k9clei5maqkr2q0ful3dhks4hnrgufnu.apps.googleusercontent.com
   ```

2. **Verifica las URLs autorizadas**:
   - Ve a: https://console.cloud.google.com/apis/credentials
   - Abre tu OAuth 2.0 Client ID
   - En "Authorized JavaScript origins" debe estar:
     - `https://idgleb.github.io`
     - `http://localhost:3000` (si pruebas localmente)

3. **Verifica que Google Drive API esté habilitada**:
   - Ve a: https://console.cloud.google.com/apis/dashboard
   - Busca "Google Drive API" en la lista
   - Debe aparecer como "Enabled"

4. **Espera más tiempo**: A veces los cambios pueden tardar hasta 30 minutos en propagarse

5. **Limpia la caché del navegador completamente**:
   - Presiona Ctrl+Shift+Delete
   - Selecciona "Cached images and files"
   - Haz clic en "Clear data"

## 📝 Notas

- Si la app está en modo "Testing", solo los usuarios en la lista de "Test users" podrán conectarse
- Si quieres que cualquier usuario pueda conectarse, necesitas publicar la app (requiere verificación de Google)
- Los cambios en Google Cloud Console pueden tardar varios minutos en aplicarse

