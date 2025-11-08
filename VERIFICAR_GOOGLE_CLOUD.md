# 🔍 Guía para Verificar Configuración de Google Cloud

## ❌ Error Actual:
```
"Not a valid origin for the client: https://idgleb.github.io has not been registered for client ID 642034093723-k9clei5maqkr2q0ful3dhks4hnrgufnu.apps.googleusercontent.com"
```

## ✅ SOLUCIÓN PASO A PASO

### PASO 1: Abrir Credentials

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Asegúrate de estar en el proyecto: **pos-sistema-477619**
3. Busca en la lista: **"OAuth 2.0 Client IDs"**
4. Haz click en el Client ID que termina en: `hnrgufnu.apps.googleusercontent.com`

---

### PASO 2: Verificar "Authorized JavaScript origins"

**DEBE tener EXACTAMENTE estas URLs (sin barra final `/`):**

```
✅ http://localhost:3000
✅ http://localhost:5173
✅ http://127.0.0.1:3000
✅ https://idgleb.github.io  ← IMPORTANTE: Sin barra final, sin /Pos-sistema/
```

**⚠️ VERIFICA:**
- ❌ NO debe ser: `https://idgleb.github.io/`
- ❌ NO debe ser: `https://idgleb.github.io/Pos-sistema/`
- ✅ DEBE ser: `https://idgleb.github.io` (sin barra final)

---

### PASO 3: Verificar "Authorized redirect URIs"

**DEBE tener EXACTAMENTE estas URLs:**

```
✅ https://idgleb.github.io  ← IMPORTANTE
✅ http://localhost:3000
✅ http://localhost:5173
✅ http://127.0.0.1:3000
```

---

### PASO 4: Guardar Cambios

1. **Scroll hacia abajo** hasta el final de la página
2. Haz click en el botón **"SAVE"** (azul, en la parte inferior)
3. **ESPERA** a que aparezca un mensaje de confirmación: "Client saved"

---

### PASO 5: Esperar Propagación

**IMPORTANTE:** Los cambios pueden tardar **5-10 minutos** en aplicarse.

**NO pruebes inmediatamente después de guardar.** Espera al menos 5 minutos.

---

### PASO 6: Verificar que se Guardó Correctamente

1. **Recarga la página** de Google Cloud Console (F5)
2. **Vuelve a abrir** el mismo Client ID
3. **Verifica** que `https://idgleb.github.io` sigue en la lista
4. Si NO está, **vuelve a agregarlo** y guarda

---

### PASO 7: Limpiar Caché del Navegador

1. Abre: https://idgleb.github.io/Pos-sistema/
2. Presiona **Ctrl+Shift+Delete** (o Cmd+Shift+Delete en Mac)
3. Selecciona: **"Cookies and other site data"** y **"Cached images and files"**
4. Haz click en **"Clear data"**
5. **Cierra todas las ventanas** del navegador
6. **Abre una nueva ventana** y prueba de nuevo

---

## 🔧 TROUBLESHOOTING

### Si la URL NO aparece después de agregarla:

1. **Verifica** que hiciste click en **"SAVE"**
2. **Verifica** que apareció el mensaje de confirmación
3. **Espera** 5-10 minutos
4. **Recarga** la página de Google Cloud Console
5. **Verifica** que la URL sigue ahí

### Si la URL aparece pero sigue dando error:

1. **Verifica** que NO tiene barra final: `https://idgleb.github.io` (correcto) vs `https://idgleb.github.io/` (incorrecto)
2. **Verifica** que es HTTPS (no HTTP)
3. **Espera** más tiempo (puede tardar hasta 15 minutos)
4. **Limpia** la caché del navegador completamente
5. **Prueba** en una ventana de incógnito

### Si tienes MÚLTIPLES Client IDs:

1. **Verifica** que estás editando el Client ID correcto: `642034093723-k9clei5maqkr2q0ful3dhks4hnrgufnu`
2. **Verifica** que este Client ID está en tu código: `src/lib/googleDriveBackup.js` (línea 7)
3. Si tienes varios, agrega la URL a **TODOS** los Client IDs que uses

---

## ✅ CHECKLIST FINAL

Antes de probar, verifica:

- [ ] Client ID correcto está abierto: `hnrgufnu.apps.googleusercontent.com`
- [ ] `https://idgleb.github.io` está en "Authorized JavaScript origins" (sin barra final)
- [ ] `https://idgleb.github.io` está en "Authorized redirect URIs"
- [ ] Hiciste click en "SAVE" y apareció confirmación
- [ ] Esperaste al menos 5-10 minutos después de guardar
- [ ] Limpiaste la caché del navegador
- [ ] Cerraste todas las ventanas del navegador
- [ ] Probaste en una ventana nueva o incógnito

---

## 🆘 SI NADA FUNCIONA

Si después de seguir todos estos pasos sigue sin funcionar:

1. **Crea un NUEVO Client ID:**
   - Ve a: https://console.cloud.google.com/apis/credentials
   - Click en "CREATE CREDENTIALS" → "OAuth client ID"
   - Tipo: "Web application"
   - Agrega las URLs desde el principio
   - Guarda el nuevo Client ID
   - Actualiza el código con el nuevo Client ID

2. **Verifica el dominio en OAuth consent screen:**
   - Ve a: https://console.cloud.google.com/apis/credentials/consent
   - En "Authorized domains", debe aparecer: `github.io`
   - Si no está, agrégalo y guarda

---

## 📝 NOTAS IMPORTANTES

- **NO uses** `http://idgleb.github.io` (debe ser HTTPS)
- **NO uses** `https://idgleb.github.io/` (sin barra final)
- **NO uses** `https://idgleb.github.io/Pos-sistema/` (solo el dominio)
- **SÍ usa** `https://idgleb.github.io` (correcto)

---

## 🎯 RESUMEN

El problema es que Google no reconoce `https://idgleb.github.io` como un origen válido. 

**Solución:**
1. Agrega `https://idgleb.github.io` a "Authorized JavaScript origins"
2. Agrega `https://idgleb.github.io` a "Authorized redirect URIs"
3. Guarda los cambios
4. Espera 5-10 minutos
5. Limpia la caché del navegador
6. Prueba de nuevo

¡Eso debería solucionarlo!

