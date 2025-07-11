import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

import { getDbClient } from './db';
import { setupRoutes } from './routes';

// Define a custom Env interface for Hono
interface CustomEnv {
  Variables: {
    db: ReturnType<typeof getDbClient>;
  };
  Bindings: {
    DATABASE_URL: string;
  };
}

const app = new OpenAPIHono<CustomEnv>();

// Middlewares
app.use('*', logger());
app.use('*', prettyJSON());

// OpenAPI Docs
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Nexus Analytics API',
  },
});

app.get('/swagger-ui', swaggerUI({ url: '/doc' }));

// Database Client
app.use('*', async (c, next) => {
  const db = getDbClient(c.env);
  c.set('db', db);
  await next();
});

// Setup routes
setupRoutes(app);

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.text('Internal Server Error', 500);
});

export default app;
