# ✅ Verificación de Configuración de Google Cloud

## 🔍 Checklist de Verificación

### 1. **Authorized JavaScript origins**
Debe incluir (en este orden):
- ✅ `http://localhost:3000`
- ✅ `http://localhost:5173`
- ✅ `http://127.0.0.1:3000`
- ✅ `https://idgleb.github.io` ← **IMPORTANTE**
- ✅ `https://idgleb.github.io/Pos-sistema` ← **OPCIONAL (pero recomendado)**

### 2. **Authorized redirect URIs**
Debe incluir (en este orden):
- ✅ `https://idgleb.github.io` ← **IMPORTANTE**
- ✅ `https://idgleb.github.io/Pos-sistema` ← **OPCIONAL (pero recomendado)**
- ✅ `http://localhost:3000`
- ✅ `http://localhost:5173`
- ✅ `http://127.0.0.1:3000`

### 3. **OAuth consent screen**
- ✅ App name: "POS System" (o el nombre que prefieras)
- ✅ User support email: Tu email
- ✅ Application home page: `https://idgleb.github.io/Pos-sistema/`
- ✅ Application privacy policy link: `https://idgleb.github.io/Pos-sistema/privacy`
- ✅ Application terms of service link: `https://idgleb.github.io/Pos-sistema/terms`
- ✅ Publishing status: **"In production"** (no "Testing")

### 4. **Scopes**
- ✅ `https://www.googleapis.com/auth/drive.file`

---

## 🚨 Solución de Problemas

### Error: "Not a valid origin"
**Causa:** Google no reconoce el origen o los cambios no se han propagado.

**Solución:**
1. Verifica que `https://idgleb.github.io` esté en "Authorized JavaScript origins"
2. Guarda los cambios (clic en "SAVE")
3. Espera 15-30 minutos
4. Recarga la página completamente (Ctrl+F5)
5. Limpia la caché del navegador

### Error: "idpiframe_initialization_failed"
**Causa:** El iframe de Google está bloqueado (esto es normal).

**Solución:**
- Este error NO impide que funcione el popup
- El popup debería funcionar correctamente
- Si el popup no aparece, verifica que los popups no estén bloqueados en tu navegador

### Error: "access_denied"
**Causa:** La app está en modo "Testing" o no está publicada.

**Solución:**
1. Ve a "OAuth consent screen"
2. Completa todos los campos requeridos
3. Haz clic en "PUBLISH APP"
4. Espera 15-30 minutos
5. Vuelve a intentar

---

## 📝 Notas Importantes

1. **Propagación de cambios:** Los cambios en Google Cloud Console pueden tardar hasta 30 minutos en aplicarse.

2. **Caché del navegador:** Después de hacer cambios, siempre limpia la caché y recarga la página.

3. **Popups bloqueados:** Asegúrate de que tu navegador permita popups para `https://idgleb.github.io`.

4. **Orígenes exactos:** Las URLs deben ser exactas (sin barras finales, excepto en las rutas específicas).

---

## 🔗 Enlaces Útiles

- **Google Cloud Console - Credentials:** https://console.cloud.google.com/apis/credentials
- **Google Cloud Console - OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent
- **Tu aplicación en GitHub Pages:** https://idgleb.github.io/Pos-sistema/

---

## ✅ Verificación Final

Después de hacer todos los cambios:

1. ✅ Guarda todos los cambios en Google Cloud Console
2. ✅ Espera 15-30 minutos
3. ✅ Limpia la caché del navegador
4. ✅ Recarga la página (Ctrl+F5)
5. ✅ Haz clic en "💾 Backup" → "☁️ Conectar Google Drive"
6. ✅ Debería aparecer un popup de Google para iniciar sesión

Si después de todo esto sigue sin funcionar, comparte el error exacto que ves en la consola del navegador (F12 → Console).
