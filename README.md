# Nexus Analytics API

Esta es la API backend para el proyecto Nexus Analytics, diseñada para servir datos relacionados con estadísticas de juegos de League of Legends desde una base de datos PostgreSQL. La API está construida con Hono y se despliega en Cloudflare Workers, optimizada para un rendimiento rápido y un bajo "cold start".

## Características

-   **API RESTful**: Proporciona endpoints para acceder a datos de partidos, equipos, jugadores y estadísticas detalladas.
-   **Paginación**: Los endpoints de listado soportan paginación para manejar grandes volúmenes de datos de manera eficiente.
-   **Health Check**: Un endpoint simple para verificar el estado de la API.
-   **Documentación OpenAPI**: Todas las rutas están documentadas con OpenAPI 3.0, accesible a través de Swagger UI.
-   **Conectividad PostgreSQL**: Utiliza el cliente `pg` para interactuar con la base de datos PostgreSQL.

## Tecnologías Utilizadas

-   **Hono**: Framework web ligero y rápido para Edge.
-   **Cloudflare Workers**: Plataforma serverless para desplegar la API.
-   **TypeScript**: Lenguaje de programación para un código robusto y tipado.
-   **`pg`**: Cliente PostgreSQL para Node.js.
-   **`@hono/zod-openapi`**: Para la generación automática de documentación OpenAPI con Zod.
-   **`@hono/swagger-ui`**: Para la interfaz de usuario interactiva de Swagger.
-   **Wrangler**: CLI de Cloudflare para desarrollo y despliegue de Workers.

## Configuración del Proyecto

1.  **Clonar el repositorio** (si aún no lo has hecho):
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd nexus-analytics-api
    ```

2.  **Instalar dependencias**: Asegúrate de tener Node.js y npm instalados.
    ```bash
    npm install
    ```

3.  **Configurar la Base de Datos PostgreSQL**: La API se conecta a una base de datos PostgreSQL. Necesitas proporcionar la URL de conexión.

    Abre el archivo `wrangler.toml` en la raíz del proyecto y configura la variable `DATABASE_URL` en la sección `[env.development.vars]` para tu entorno local. Si tu base de datos está en Xata, usa la cadena de conexión de PostgreSQL que Xata te proporciona.

    ```toml
    # wrangler.toml
    [env.development.vars]
    DATABASE_URL = "postgresql://user:password@host:port/database_name?sslmode=require"
    ```
    **Importante**: Reemplaza `user`, `password`, `host`, `port` y `database_name` con los detalles de tu base de datos. Si tu base de datos requiere SSL (como Xata), asegúrate de incluir `?sslmode=require`.

## Ejecutar la API Localmente

Una vez configurada la `DATABASE_URL` en `wrangler.toml` y con tu base de datos PostgreSQL accesible, puedes iniciar el servidor de desarrollo:

```bash
npm run start
```

Esto iniciará la API en `http://127.0.0.1:8787` (o un puerto similar). Los logs de la API se mostrarán en tu terminal.

## Documentación de la API (Swagger UI)

La API está completamente documentada con OpenAPI. Puedes acceder a la interfaz interactiva de Swagger UI en tu navegador:

```
http://127.0.0.1:8787/swagger-ui
```

Aquí podrás ver todos los endpoints disponibles, sus parámetros, esquemas de respuesta y probar las solicitudes directamente.

## Endpoints Principales

-   `GET /health`: Verifica el estado de la API.
-   `GET /matches`: Obtiene una lista paginada de partidos. Soporta `limit` y `offset` como parámetros de consulta.
-   `GET /matches/{gameid}`: Obtiene los detalles de un partido específico por su ID.
-   `GET /teams`: Obtiene una lista de equipos.
-   `GET /teams/{teamid}`: Obtiene los detalles de un equipo específico por su ID.
-   `GET /players`: Obtiene una lista de jugadores.
-   `GET /players/{playerid}`: Obtiene los detalles de un jugador específico por su ID.
-   `GET /team-match-stats`: Obtiene estadísticas de partidos por equipo.
-   `GET /team-match-stats/{gameid}`: Obtiene estadísticas de partidos por equipo para un ID de juego específico.
-   `GET /player-match-stats`: Obtiene estadísticas de partidos por jugador.
-   `GET /player-match-stats/{gameid}`: Obtiene estadísticas de partidos por jugador para un ID de juego específico.
-   `GET /dashboard/summary`: Proporciona un resumen de métricas clave a nivel global.
-   `GET /champions/meta-tier-list`: Devuelve una lista de campeones clasificados por su rendimiento en el meta actual (Tier List).
-   `GET /news/recent-activity`: Proporciona un feed de actividades y eventos recientes relevantes.
-   `GET /champions/{champion_name}/stats`: Obtiene estadísticas detalladas para un campeón específico.
-   `GET /champions/{champion_name}/power-timeline`: Muestra la evolución del poder (Win Rate) de un campeón a lo largo de la duración de la partida.
-   `GET /players/{player_id}/stats`: Proporciona estadísticas detalladas de un jugador para una temporada específica.
-   `GET /players/compare`: Compara las estadísticas de múltiples jugadores.
-   `GET /draft/analysis`: Proporciona análisis sobre la fase de selección y bloqueo de campeones.
-   `GET /team-compositions/winning`: Lista las composiciones de equipo más exitosas.
-   `GET /leagues/meta-comparison`: Compara las características del meta entre diferentes ligas.
-   `GET /patches/{patch_number}/evolution`: Muestra la evolución del meta de campeones a lo largo de las semanas dentro de un parche.
-   `GET /champions/{champion_name}/historical-performance`: Proporciona el rendimiento histórico de un campeón a lo largo de las temporadas.
-   `POST /predictions/match`: Predice el resultado de una partida basándose en los equipos y, opcionalmente, las alineaciones de jugadores.
-   `POST /recommendations/champion`: Recomienda campeones basados en una situación de draft específica.
-   `GET /alerts/meta-shifts`: Proporciona alertas sobre cambios significativos en el meta.
-   `GET /alerts/player-performance`: Alertas personalizadas sobre el rendimiento de los jugadores.

## Despliegue en Cloudflare Workers

Para desplegar la API en tu cuenta de Cloudflare Workers, asegúrate de haber iniciado sesión con Wrangler y de tener los permisos adecuados. También deberás configurar la variable de entorno `DATABASE_URL` en tu entorno de producción de Cloudflare Workers.

```bash
npm run deploy
```

## Esquema de la Base de Datos y Características

Para entender la estructura de la base de datos y las funcionalidades que esta API soporta, puedes consultar los siguientes documentos:

-   `docs/xata_schema.json`: Define el esquema de la base de datos utilizada.
-   `docs/FeaturesNexusAnalytics.pdf`: Describe las características y visualizaciones que la API está diseñada para soportar en el frontend.
