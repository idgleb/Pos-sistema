# Sistema POS - Punto de Venta

Sistema de punto de venta (POS) desarrollado con React y Vite para gestión de productos, ventas, gastos y reportes.

## 🚀 Tecnologías

- **React 19** - Biblioteca de UI
- **Vite 7** - Build tool y dev server
- **React Router DOM 7** - Enrutamiento
- **Chart.js** - Gráficos y visualizaciones
- **date-fns** - Manipulación de fechas

## 📋 Características

- ✅ Gestión de productos con precios fijos y precios libres
- ✅ Sistema de punto de venta (POS) con carrito de compras
- ✅ Registro de gastos y movimientos
- ✅ Dashboard con métricas y gráficos
- ✅ Backup y restauración de datos (Google Drive)
- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ Persistencia de datos en localStorage

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── app/              # Configuración de la app (rutas, store, App principal)
├── components/       # Componentes reutilizables
│   ├── dashboard/    # Componentes del dashboard
│   └── ui/           # Componentes UI básicos (Modal, Button, etc.)
├── features/         # Features/páginas principales
│   ├── pos/          # Punto de venta
│   ├── products/     # Gestión de productos
│   ├── expenses/     # Gestión de gastos
│   ├── movements/    # Movimientos financieros
│   ├── dashboard/    # Dashboard principal
│   └── legal/        # Páginas legales (Privacy, Terms)
├── lib/              # Utilidades y helpers
└── styles/           # Estilos globales
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo en http://localhost:3000
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm start` - Alias para `npm run dev`

## 🔧 Configuración

El proyecto está configurado para desplegarse en GitHub Pages con el path base `/Pos-sistema/`. Esta configuración se encuentra en `vite.config.js`.

## 📚 Documentación Adicional

La documentación sobre configuración de Google Drive y otros temas se encuentra en la carpeta `docs/`.

## 📄 Licencia

Este proyecto es privado.
