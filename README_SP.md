# Bude Global Neuro-Chain

[SPANISH](./README_SP.md) | English

**Plataforma de visualización de la red de innovación**


Visualización interactiva de la innovación humana como una red no lineal, que muestra cómo las tecnologías se construyen unas sobre otras, desde el fuego hasta la AGI. Impulsado por Bude Global.

![Previsualizacion Neuro Chain](public/images/neuro-chain-preview.png)


## 🌟 Sobre Bude Global

Bude Global se especializa en la visualización de redes de innovación complejas y dependencias tecnológicas. Esta plataforma Neuro-Chain demuestra nuestra capacidad para transformar datos en experiencias visuales intuitivas e interactivas.

## 🚀 Funcionalidades

- **Busqueda inteligente**: Búsqueda de nodos en tiempo real con enfoque automático de cámara
- **Conversión Pixel-Perfect**: Fidelidad visual 1:1 respecto a la implementación original en HTML
- **Conducido por datos**: Todos los datos de invenciones separados en archivos JSON para fácil edición
- **Lienzo interactivo**: Desplazamiento, zoom y exploración de la red de innovación
- **Editor de datos en vivo**: Edición en tiempo real de nodos, conexiones, clústeres y descripciones
- **Optimizado para rendimiento**: Memoización, renderizado eficiente, escala a más de 10.000 nodos
- **100% Estático**: No requiere servidor, se puede desplegar en cualquier lugar
- **SEO Listo**: Metaetiquetas completas para motores de búsqueda y redes sociales
- **Responsive para móviles**: Optimizado para todos los tamaños de pantalla

## 📦 Installation

```bash
# Clonar el repositorio
cd bude-global-neuro-chain-react

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🏗️ Estructura del proyecto

```
bude-global-neuro-chain-react/
├── public/
├── src/
│   ├── components/          # Componentes de React
│   │   ├── CanvasNetwork.jsx
│   │   ├── TitleBlock.jsx
│   │   ├── Legend.jsx
│   │   ├── Panel.jsx
│   │   ├── ClusterView.jsx
│   │   ├── DataEditor.jsx
│   │   ├── Controls.jsx
│   │   └── Tooltip.jsx
│   ├── data/                # Archivos de datos JSON
│   │   ├── clusters.json    # 9 Definiciones de clusters
│   │   ├── nodes.json       # 78 Nodos de invenciones
│   │   ├── edges.json       # 113 Conexiones
│   │   └── descriptions.json # Descripciones de clusters
│   ├── styles/              # Modulos CSS
│   │   ├── global.css
│   │   └── components/
│   ├── App.jsx              # Aplicación principal
│   └── main.jsx             # Punto de entrada
├── vite.config.js
└── package.json
```

## 📊 Esquema de datos

### clusters.json
```json
{
  "cluster_id": {
    "color": "#hex",
    "label": "Display Name"
  }
}
```

### nodes.json
```json
[
  {
    "id": "unique_id",
    "label": "Display Label",
    "cluster": "cluster_id",
    "x": 0,
    "y": 0,
    "size": 16
  }
]
```

### edges.json
```json
[
  {
    "source": "node_id",
    "target": "node_id",
    "type": "forward" | "backlink"
  }
]
```

### descriptions.json
```json
{
  "cluster_id": {
    "title": "Cluster Title",
    "body": "HTML description",
    "links": ["→ Target"],
    "backlinks": ["← Source"]
  }
}
```

## 🎮 Controles

- **Mouse Drag**: Desplazar el lienzo
- **Rueda del mouse**: Zoom in/out
- **Mouse sobre un nodo**: Mostrar globo informativo con detalles
- **Clic en la leyenda**: Enfocarse en un cluster
- **Botón ⟲**: Resetear vista al origen
- **Botón ⏸/▶**: Pausar/Continuar animación
- **Botón ↓**: Exportar todos los datos como JSON

## 🎨 Personalización

### Agregar nuevos nodos

1. Abrir la pestaña **Editor de Datos** en el panel derecho
2. Seleccionar `nodes.json` desde el desplegable
3. Agregar tu nodo siguiendo el esquema
4. Hacer clic en **"Aplicar cambios"**

### Editar descripciones de clústeres

1. Abrir la pestaña **Editor de Datos**
2. Seleccionar `descriptions.json`
3. Editar el contenido HTML (será sanitizado)
4. Hacer clic en **"Aplicar cambios"**

### Cambiar colores

Editar `clusters.json` y actualizar los valores hexadecimales de `color`.

## 🚢 Despliegue

### Cloudflare Pages

```bash
npm run build
# Subir la carpeta dist/ a Cloudflare Pages
```

### Netlify

```bash
npm run build
# Desplegar la carpeta dist/ mediante Netlify CLI o arrastrando y soltando
```

### Vercel

```bash
npm run build
# Desplegar mediante Vercel CLI: vercel --prod
```

### GitHub Pages

```bash
npm run build
# Subir la carpeta dist/ a la rama gh-pages
```

## 🔒 Seguridad

- ✅ Sin uso de `dangerouslySetInnerHTML` sin sanitización con DOMPurify
- ✅ Sin uso de `eval()`
- ✅ Compatible con CSP (sin scripts inline)
- ✅ Parseo seguro de JSON contra XSS usando try-catch

## ⚡ Rendimiento

- **Memoización**: todos los componentes usan `React.memo`
- **Búsquedas eficientes**: búsquedas de nodos O(1) mediante `Map`
- **Renderizado optimizado**: un único loop de `requestAnimationFrame`
- **Separación de código**: vendor chunks separados
- **Minificado**: minificación con Terser para producción

## 🧬 Modelo Neuro-Chain

Esta visualización representa la invención como una **red no lineal** en lugar de una línea de tiempo lineal:

- **Enlaces directos**: dependencias tecnológicas directas
- **Enlaces inversos**: dependencias inversas (mostradas como líneas discontinuas)
- **Hubs**: nodos de alta conectividad como Fuego, Electricidad, AGI
- **Clústeres**: agrupaciones temáticas (Energía, Herramientas, Bio, Información, etc.)
- **Abierto**: la AGI conduce a invenciones futuras desconocidas (∞)

## 📝 Licencia

MIT

## 🌐 Comunidad e Inspiración

- **Proyecto desplegado**: [https://invent.budeglobal.in/](https://invent.budeglobal.in/)
- **Únete a nuestra comunidad**: [WhatsApp Group](https://chat.whatsapp.com/JSa5qnGbqAE76DEav1KCK6)
- **Inspiración**: Este proyecto fue inspirado mirando el documental [The Thinking Game](https://www.youtube.com/watch?v=d95J8yzvjbQ) de Google DeepMind.
- **Canal oficial**: [The Thinking Game Film](https://www.youtube.com/channel/UC0SOuDkpL6qpIF1o4wRhqRQ)
- **Hub de la comunidad**: [Bude Global Community](https://www.budeglobal.in/community) - Mira nuestros proyectos y contribuidores.

## 🙏 Agradecimientos

@aravind-govindhasamy
