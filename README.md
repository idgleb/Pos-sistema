# 🛒 POS Sistema

<div align="center">

![POS Sistema](https://img.shields.io/badge/POS-Sistema-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

**Sistema de Punto de Venta gratuito que funciona completamente en tu navegador**

[🌐 **Ver Aplicación en Vivo**](https://idgleb.github.io/Pos-sistema/)
[📄 **Landing Page**](https://idgleb.github.io/Pos-sistema/home.html)

</div>

---

## 📖 Descripción

POS Sistema es una aplicación web moderna y gratuita para la gestión de punto de venta. Funciona completamente en tu navegador, sin necesidad de servidores ni bases de datos externas. Todos los datos se almacenan localmente en tu dispositivo, con la opción de hacer backups en Google Drive.

### ✨ Características Principales

- 🛒 **Punto de Venta (POS)** - Procesa ventas rápidamente con una interfaz intuitiva
- 📦 **Gestión de Productos** - Administra tu inventario con precios fijos o libres
- 💰 **Control de Gastos** - Registra y categoriza todos tus gastos
- 📊 **Dashboard y Reportes** - Visualiza métricas con gráficos interactivos
- ☁️ **Backup en Google Drive** - Protege tus datos con backups en la nube
- 📱 **100% Responsive** - Funciona perfectamente en cualquier dispositivo
- 💾 **Persistencia Local** - Todos los datos se guardan en tu navegador
- 🎨 **Interfaz Moderna** - Diseño limpio y fácil de usar

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/idgleb/Pos-sistema.git
cd Pos-sistema

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

### Construcción para Producción

```bash
# Construir para producción
npm run build

# Vista previa del build
npm run preview
```

---

## 🛠️ Tecnologías

- **React 19** - Biblioteca de UI moderna
- **Vite 7** - Build tool rápido y eficiente
- **React Router DOM 7** - Enrutamiento de la aplicación
- **Chart.js** - Gráficos y visualizaciones
- **date-fns** - Manipulación de fechas
- **Google Drive API** - Integración para backups

---

## 📋 Funcionalidades Detalladas

### 🛒 Punto de Venta (POS)
- Carrito de compras interactivo
- Teclado numérico integrado
- Múltiples métodos de pago
- Búsqueda rápida de productos
- Precios fijos y libres

### 📦 Gestión de Productos
- Agregar, editar y eliminar productos
- Categorización de productos
- Precios fijos y precios libres
- Control de inventario
- Búsqueda y filtrado

### 💰 Control de Gastos
- Registro de gastos con categorías
- Filtrado por fecha y categoría
- Edición y eliminación de gastos
- Historial completo de gastos

### 📊 Dashboard
- Métricas en tiempo real
- Gráficos interactivos
- Productos más vendidos
- Análisis de ingresos y gastos
- Velocidad de ventas

### ☁️ Backup en Google Drive
- Backup automático opcional
- Restauración de datos
- Historial de backups
- Sincronización en la nube
- Protección de datos

---

## 📁 Estructura del Proyecto

```
src/
├── app/              # Configuración de la app
│   ├── routes.jsx    # Configuración de rutas
│   ├── store/        # Estado global (Context API)
│   └── App.jsx       # Componente principal
├── components/       # Componentes reutilizables
│   ├── dashboard/    # Componentes del dashboard
│   └── ui/           # Componentes UI básicos
├── features/         # Features/páginas principales
│   ├── pos/          # Punto de venta
│   ├── products/     # Gestión de productos
│   ├── expenses/     # Gestión de gastos
│   ├── movements/    # Movimientos financieros
│   ├── dashboard/    # Dashboard principal
│   └── legal/        # Páginas legales
├── lib/              # Utilidades y helpers
│   ├── backup.js     # Backup local
│   └── googleDriveBackup.js  # Backup en Google Drive
└── styles/           # Estilos globales
```

---

## 🔧 Configuración

### Google Drive Backup

Para usar la funcionalidad de backup en Google Drive:

1. La aplicación solicita acceso a Google Drive únicamente para crear backups
2. Los datos se almacenan en una carpeta privada "POS Backups" en tu Google Drive
3. Puedes revocar los permisos en cualquier momento desde tu cuenta de Google
4. La funcionalidad es completamente opcional

**⚠️ Importante:** Al conectar Google Drive, asegúrate de marcar el checkbox que dice:
> "Visualiza, crea, edita y elimina solo los archivos de Google Drive que uses con esta aplicación"

Si no marcas este checkbox, la aplicación no podrá guardar backups.

### GitHub Pages

El proyecto está configurado para desplegarse en GitHub Pages con el path base `/Pos-sistema/`. Esta configuración se encuentra en `vite.config.js`.

---

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm start` | Alias para `npm run dev` |

---

## 🔐 Privacidad y Seguridad

- ✅ Todos los datos se almacenan localmente en tu navegador
- ✅ Backup opcional en Google Drive (en una carpeta privada)
- ✅ No se comparten datos con terceros
- ✅ Autenticación OAuth 2.0 de Google
- ✅ Puedes revocar permisos en cualquier momento
- ✅ Código de código abierto y auditable

Para más información, consulta:
- [Política de Privacidad](https://idgleb.github.io/privacy.html)
- [Términos de Servicio](https://idgleb.github.io/terms.html)

---

## 📚 Documentación Adicional

La documentación sobre configuración de Google Drive y otros temas se encuentra en la carpeta `docs/`:

- [Verificar Dominio en Google Search Console](docs/VERIFICAR_DOMINIO_GOOGLE_SEARCH_CONSOLE.md)
- [Solución de Problemas con Scope de Google Drive](docs/SOLUCIONAR_SCOPE_GOOGLE_DRIVE.md)
- [Verificación de Homepage para Google OAuth](docs/VERIFICACION_HOMEPAGE_GOOGLE.md)

---

## 🌐 Enlaces

- 🌐 [Aplicación en Vivo](https://idgleb.github.io/Pos-sistema/)
- 📄 [Landing Page](https://idgleb.github.io/Pos-sistema/home.html)
- 🔒 [Política de Privacidad](https://idgleb.github.io/privacy.html)
- 📋 [Términos de Servicio](https://idgleb.github.io/terms.html)
- 💻 [Repositorio en GitHub](https://github.com/idgleb/Pos-sistema)

---

## 🤝 Contribuir

Este es un proyecto privado. Si tienes sugerencias o encuentras algún problema, por favor abre un issue en el repositorio.

---

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

---

## 👨‍💻 Autor

**idgleb**

- GitHub: [@idgleb](https://github.com/idgleb)
- Portfolio: [https://idgleb.github.io](https://idgleb.github.io)

---

<div align="center">

**⭐ Si te gusta este proyecto, considera darle una estrella ⭐**

Hecho con ❤️ usando React y Vite

</div>
