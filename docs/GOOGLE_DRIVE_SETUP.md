# 📋 Instrucciones: Configurar Google Drive Backup

## 🎯 Paso 1: Obtener Client ID de Google Cloud Console

### 1.1 Crear Proyecto en Google Cloud

1. Ve a: https://console.cloud.google.com/
2. En la parte superior, haz clic en el selector de proyectos
3. Haz clic en "**New Project**" o "**Nuevo Proyecto**"
4. Nombre del proyecto: `POS Sistema` (o el nombre que prefieras)
5. Haz clic en "**Create**" o "**Crear**"
6. Espera a que se cree el proyecto (toma unos segundos)

### 1.2 Habilitar Google Drive API

1. Asegúrate de que estés en tu nuevo proyecto (verifica en la parte superior)
2. En el menú lateral izquierdo, ve a: **"APIs & Services"** → **"Library"**
3. En el buscador, escribe: `Google Drive API`
4. Haz clic en el resultado "**Google Drive API**"
5. Haz clic en el botón "**ENABLE**" o "**HABILITAR**"
6. Espera a que se habilite (toma unos segundos)

### 1.3 Configurar Pantalla de Consentimiento (OAuth)

1. Ve a: **"APIs & Services"** → **"OAuth consent screen"**
2. Selecciona: **"External"** (uso externo)
3. Haz clic en "**Create**" o "**Crear**"

**Paso 1 - App information:**
- **App name:** `POS Sistema` (o tu nombre preferido)
- **User support email:** Tu email de Gmail
- **App logo:** (Opcional, puedes dejarlo vacío)
- **Application home page:** (Opcional)
- **Authorized domains:** (Déjalo vacío por ahora)
- **Developer contact information:** Tu email

Haz clic en "**SAVE AND CONTINUE**"

**Paso 2 - Scopes:**
- Haz clic en "**SAVE AND CONTINUE**" (sin agregar scopes adicionales)

**Paso 3 - Test users:**
- Haz clic en "**+ ADD USERS**"
- Agrega tu email (y los emails de personas que usarán el sistema)
- Haz clic en "**SAVE AND CONTINUE**"

**Paso 4 - Summary:**
- Revisa la información
- Haz clic en "**BACK TO DASHBOARD**"

### 1.4 Crear Credenciales OAuth

1. Ve a: **"APIs & Services"** → **"Credentials"**
2. Haz clic en "**+ CREATE CREDENTIALS**" (parte superior)
3. Selecciona: "**OAuth client ID**"

**Configuración:**
- **Application type:** Selecciona **"Web application"**
- **Name:** `POS Web Client`

**Authorized JavaScript origins:**
Haz clic en "**+ ADD URI**" y agrega estas URLs (una por una):
```
http://localhost:3000
http://localhost:5173
http://127.0.0.1:3000
```

**Authorized redirect URIs:**
Deja esto vacío (no es necesario para nuestra aplicación)

4. Haz clic en "**CREATE**"

### 1.5 Copiar el Client ID

Aparecerá un popup con tus credenciales:

```
Your Client ID
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com

Your Client Secret
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45
```

**⚠️ IMPORTANTE:**
- **Copia el "Client ID"** (la línea larga que termina en `.apps.googleusercontent.com`)
- **NO necesitas el "Client Secret"** para esta aplicación
- Guarda el Client ID en un lugar seguro

---

## 💻 Paso 2: Configurar el Client ID en tu Código

### 2.1 Abrir el archivo de configuración

Abre el archivo: `src/lib/googleDriveBackup.js`

### 2.2 Reemplazar el Client ID

En la **línea 7**, encontrarás:

```javascript
const CLIENT_ID = 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com';
```

**Reemplaza** `TU_CLIENT_ID_AQUI.apps.googleusercontent.com` con tu Client ID real:

```javascript
const CLIENT_ID = '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com';
```

### 2.3 Guardar el archivo

Guarda los cambios (Ctrl + S o Cmd + S)

---

## 🧪 Paso 3: Probar la Integración

### 3.1 Iniciar la aplicación

Si no está corriendo, inicia tu aplicación:

```bash
npm start
# o
npm run dev
```

### 3.2 Probar la conexión

1. Abre tu navegador en: `http://localhost:3000` (o el puerto que uses)
2. En el Navbar, haz clic en **"💾 Backup"**
3. En el dropdown, haz clic en **"☁️ Conectar Google Drive"**

### 3.3 Flujo de autenticación

Deberías ver:

1. **Popup de Google** pidiendo que elijas una cuenta
2. Selecciona tu cuenta de Gmail
3. Verás advertencia: "Google hasn't verified this app"
   - Esto es NORMAL porque tu app está en modo desarrollo
   - Haz clic en **"Advanced"** o **"Avanzado"**
   - Haz clic en **"Go to POS Sistema (unsafe)"** o **"Ir a POS Sistema (no seguro)"**
   
4. Pantalla de permisos:
   - Verás: "POS Sistema wants to access your Google Account"
   - Permisos solicitados: "See and download files from Google Drive that you create with this app"
   - Haz clic en **"Allow"** o **"Permitir"**

### 3.4 Verificar conexión exitosa

Después de permitir:
- Deberías ver un modal de éxito: "✅ Conectado a Google Drive"
- El dropdown ahora mostrará tu nombre y foto
- Aparecerá la opción: "☁️ Guardar en Google Drive"

### 3.5 Probar guardado de backup

1. Haz clic en **"☁️ Guardar en Google Drive"**
2. Deberías ver: "✅ Backup guardado en Google Drive"
3. Ve a tu Google Drive: https://drive.google.com/
4. Deberías ver una carpeta nueva llamada **"POS Backups"**
5. Dentro de esa carpeta, verás tu archivo de backup

---

## ✅ ¡Listo!

Tu sistema de backup con Google Drive está configurado y funcionando.

**Los usuarios de tu aplicación:**
- NO necesitan hacer estos pasos de configuración
- Solo necesitan hacer clic en "Conectar Google Drive"
- Iniciar sesión con su cuenta de Google
- ¡Y ya pueden guardar backups en la nube!

---

## 🔧 Solución de Problemas

### Error: "The OAuth client was not found"

**Causa:** El Client ID no es correcto o no existe.

**Solución:**
1. Verifica que copiaste el Client ID completo
2. Asegúrate de que no hay espacios extra
3. Verifica que termina en `.apps.googleusercontent.com`

### Error: "redirect_uri_mismatch"

**Causa:** La URL desde donde accedes no está autorizada.

**Solución:**
1. Ve a Google Cloud Console → Credentials
2. Edita tu OAuth Client ID
3. Agrega la URL exacta desde donde accedes (ej: `http://localhost:5173`)

### Advertencia: "Google hasn't verified this app"

**Es normal** en modo desarrollo. Para producción:
1. Ve a OAuth consent screen
2. Haz clic en "PUBLISH APP"
3. Sigue el proceso de verificación de Google

### No aparece el popup de Google

**Causa:** Bloqueador de popups.

**Solución:**
1. Permite popups en tu navegador para localhost
2. Vuelve a intentar conectar

---

## 📞 ¿Necesitas ayuda?

Si tienes problemas:
1. Verifica que seguiste todos los pasos
2. Revisa la consola del navegador (F12) para ver errores
3. Asegúrate de que el Client ID esté correctamente configurado

---

## 🔐 Seguridad

**¿Es seguro?**
- ✅ Solo accede a archivos que crea tu app
- ✅ No puede ver otros archivos de Google Drive
- ✅ El usuario puede revocar permisos en cualquier momento
- ✅ No guardamos contraseñas ni credenciales

**Para revocar permisos:**
1. Ve a: https://myaccount.google.com/permissions
2. Encuentra "POS Sistema"
3. Haz clic en "Remove Access"

