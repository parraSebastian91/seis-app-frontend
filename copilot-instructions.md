# SEIS App Frontend - GitHub Copilot Guidelines

## Arquitectura del Proyecto

### Estructura General
- **Framework:** Angular 19 con Module Federation (Native Federation)
- **Patrón:** Monorepo con Portal (host) + 4 Micro Frontends (MFEs)
- **Build:** Shared dependencies via `shared-federation.config.js`

### Proyectos en el Monorepo

#### Portal (Host)
- **Path:** `projects/seis-portal/`
- **Puerto:** 4200 (dev)
- **Responsabilidad:** Carga dinámicamente los MFEs vía Module Federation
- **Routing:** `projects/seis-portal/src/app/contenedor/contenedor-routing.module.ts` (punto central de enrutamiento)
- **Federation Manifests:**
  - Dev: `projects/seis-portal/public/federation.manifest.json` (localhost:4XXX)
  - Prod: `projects/seis-portal/public/federation.manifest.prod.json` (paths /mfe-XXX)

#### MFE 1: seis-mfe-dashboard-facturas
- **Path:** `projects/seis-mfe-dashboard-facturas/`
- **Puerto:** 4202 (dev)
- **Ruta en Portal:** `/pages/factoring/dashboard-facturas`
- **Exposed Module:** `./DashboardFacturasRoutingModule`
- **Responsabilidad:** Dashboard de facturas emitidas

#### MFE 2: seis-mfe-gestion-usuario
- **Path:** `projects/seis-mfe-gestion-usuario/`
- **Puerto:** 4201 (dev)
- **Ruta en Portal:** `/pages`
- **Exposed Module:** `./UserProfileRoutingModule`
- **Responsabilidad:** Gestión de perfil de usuario

#### MFE 3: seis-mfe-publicador-facturas
- **Path:** `projects/seis-mfe-publicador-facturas/`
- **Puerto:** 4203 (dev)
- **Ruta en Portal:** `/pages/factoring/publicador-facturas`
- **Exposed Module:** `./PublicadorFacturasRoutingModule`
- **Responsabilidad:** Publicar/emitir facturas

#### MFE 4: seis-mfe-ofertador-facturas
- **Path:** `projects/seis-mfe-ofertador-facturas/`
- **Puerto:** 4204 (dev)
- **Ruta en Portal:** `/pages/factoring/ofertador-facturas`
- **Exposed Module:** `./OfertadorFacturasRoutingModule`
- **Responsabilidad:** Gestión de ofertas de factoring

#### Librería Compartida
- **Path:** `projects/shared-utils/`
- **Exports:** HTTP Interceptors, Guards, utilidades comunes
- **Build:** Se compila primero (`npm run build:shared-utils`)
- **Importada por:** Todos los proyectos

## Límites de Dependencias y Patrones

### ✅ Dependencias Permitidas

1. **Portal → MFEs (One-way):**
   - Portal puede importar/cargar dinámicamente cualquier MFE
   - Import method: `loadRemoteModule('mfe-name', './RoutingModule')`
   - Ejemplo en `contenedor-routing.module.ts`:
     ```typescript
     loadRemoteModule('seis-mfe-ofertador-facturas', './OfertadorFacturasRoutingModule')
       .then(m => m.OfertadorFacturasRoutingModule)
     ```

2. **Todos → shared-utils:**
   - Portal + todos los MFEs pueden importar desde `shared-utils`
   - Ejemplo: `import { CorrelationIdInterceptor } from 'shared-utils'`

3. **MFEs entre sí (Solo via Portal):**
   - MFEs NO importan directamente entre sí en código
   - Comunicación es a través del Portal o vía servicios compartidos en `shared-utils`

### ❌ Dependencias Prohibidas

1. **MFE → MFE (directo):** ❌ NO está permitido
   ```typescript
   // ❌ INCORRECTO
   import { SomeModule } from '../../seis-mfe-dashboard-facturas/src/app/dashboard';
   ```

2. **shared-utils → MFEs:** ❌ NO está permitido
   - `shared-utils` no puede depender de ningún MFE (librería pura)

3. **Imports circulares:** ❌ NO permitidos
   - Usa servicios en `shared-utils` como intermedio si detectas ciclos

## Patrones y Convenciones

### Estructura de Directorios (por MFE)
```
projects/seis-mfe-XXXX/
├── src/
│   ├── bootstrap.ts          # Entry point (carga AppModule)
│   ├── main.ts               # Invoca bootstrap
│   ├── app/
│   │   ├── app.module.ts     # Root module
│   │   ├── app-routing.module.ts  # Internal routing
│   │   ├── app.component.*   # Root component
│   │   └── FEATURE-FOLDER/
│   │       ├── FEATURE-routing.module.ts  # Exposed module
│   │       ├── FEATURE.module.ts
│   │       └── components/
│   ├── styles.scss
│   └── index.html
├── federation.config.js      # Qué expone este MFE
└── tsconfig.*.json          # TypeScript configs
```

### Exportar desde MFE (federation.config.js)
```typescript
module.exports = withNativeFederation({
  name: 'seis-mfe-ofertador-facturas',
  exposes: {
    './OfertadorFacturasRoutingModule': 
      'projects/seis-mfe-ofertador-facturas/src/app/ofertador-facturas/ofertador-facturas-routing.module.ts',
  },
  shared: sharedConfig,
  skip: [/* libs to skip... */]
});
```

### Consumir MFE desde Portal (contenedor-routing.module.ts)
```typescript
{
  path: 'pages/factoring/ofertador-facturas',
  loadChildren: () =>
    loadRemoteModule('seis-mfe-ofertador-facturas', './OfertadorFacturasRoutingModule')
      .then(m => m.OfertadorFacturasRoutingModule)
}
```

## Instrucciones para Copilot

Cuando sugieras cambios en código:

1. **Respeta límites de MFE:**
   - No sugieras imports cruzados directos entre MFEs
   - Si necesitas compartir lógica, sugiere crear servicio en `shared-utils`

2. **Para servicios compartidos:**
   - Coloca en `projects/shared-utils/src/lib/`
   - Asegúrate de exportar desde `public-api.ts`
   - Build previo: `npm run build:shared-utils`

3. **Para cambios en Portal:**
   - Edita `contenedor-routing.module.ts` solo si agregas/cambias ruta de MFE
   - Valida que el nombre de MFE y módulo expuesto coincidan

4. **Para cambios en MFE:**
   - Asegúrate que el módulo de routing esté en la ruta especificada en `federation.config.js`
   - Usa path aliases: `import { SomeService } from 'shared-utils'` (NO rutas relativas largas)

5. **Communication entre MFEs:**
   - Usa `RxJS ReplaySubject` o `EventEmitter` en servicios en `shared-utils`
   - O usa Portal como mediador

6. **HTTP Interceptors:**
   - Actualmente en `shared-utils`: `CorrelationIdInterceptor`
   - Registra en cada MFE's `AppModule`: 
     ```typescript
     {
       provide: HTTP_INTERCEPTORS,
       useClass: CorrelationIdInterceptor,
       multi: true
     }
     ```

7. **Path Aliases:**
   - Usa `shared-utils` (no rutas relativas)
   - Resuelve a `./dist/shared-utils` en build (configurado en `tsconfig.json`)

## Comandos Útiles

### Development
```bash
npm run start                  # Portal (4200)
npm run start:mfe              # seis-mfe-gestion-usuario (4201)
npm run start:mfe:dashboard    # seis-mfe-dashboard-facturas (4202)
npm run start:mfe:publicador   # seis-mfe-publicador-facturas (4203)
npm run start:mfe:ofertador    # seis-mfe-ofertador-facturas (4204)
npm run start:all              # Todos simultáneamente
```

### Build
```bash
npm run build                  # Build todos (Portal + MFEs)
npm run build:shared-utils     # Build solo shared-utils
npm run build:all              # Equivalente a build
```

### Docker
```bash
npm run docker:build-ofertador # Build + run ofertador en Docker (puerto 8087)
npm run docker:build-mfes      # Build + run todos los MFEs en Docker
```

### CodeGraph (Análisis de Código)
```bash
npx @colbymchenry/codegraph index --force    # Reindexar proyecto
npx @colbymchenry/codegraph query 'Symbol'   # Buscar símbolo
npx @colbymchenry/codegraph status           # Ver stats
codegraph watch                              # Auto-sync en cambios (background)
```

## Arquitectura Visual

```
┌────────────────────────────────────────────────────────────┐
│                    SEIS Portal (Host)                      │
│                  localhost:4200 / /                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Contenedor Routing Module                          │  │
│  │  ├─ /pages → seis-mfe-gestion-usuario              │  │
│  │  ├─ /pages/factoring/dashboard-facturas → MFE      │  │
│  │  ├─ /pages/factoring/publicador-facturas → MFE     │  │
│  │  └─ /pages/factoring/ofertador-facturas → MFE      │  │
│  └──────────────────────────────────────────────────────┘  │
│           │           │          │           │             │
└───────────┼───────────┼──────────┼───────────┼─────────────┘
            │           │          │           │
   ┌────────▼────┐ ┌───▼──────┐ ┌─▼──────────┐ ┌──▼──────────┐
   │ MFE 4202    │ │ MFE 4201 │ │ MFE 4203  │ │ MFE 4204   │
   │ Dashboard  │ │ Gestión  │ │Publicador│ │Ofertador  │
   │            │ │ Usuario  │ │Facturas  │ │Facturas   │
   └────────────┘ └──────────┘ └──────────┘ └───────────┘

        All depend on:
        ┌──────────────────────────────────┐
        │   shared-utils (Path alias)      │
        │  • HTTP Interceptors             │
        │  • Guards & Utilities            │
        └──────────────────────────────────┘
```

## Índice CodeGraph

El proyecto está indexado con CodeGraph. Para análisis:
- **Ubicación:** `.codegraph/index.json` (todos los símbolos)
- **Stats:** ~1,049 nodos, ~1,717 edges, 100 archivos indexados
- **Actualización:** Auto-sync cada 2 segundos en cambios (si `codegraph watch` activo)

## Recursos Internos

- **Hucs (User Stories):** `HU/` carpeta (requirements)
- **Docker configs:** `dockerfile.*`, `nginx.*.conf`, `docker-compose-app-frontend.yml`
- **Shared federation config:** `shared-federation.config.js` (libs compartidas)

---

**Última actualización:** 19 May 2026
**Indexación:** CodeGraph v0.7.9
