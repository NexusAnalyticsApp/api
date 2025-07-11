import { Pool } from 'pg';

interface Env {
  DATABASE_URL: string;
}

let pool: Pool | null = null;

export const getDbClient = (env: Env) => {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set in environment variables.');
  }
  if (!pool) {
    pool = new Pool({ connectionString: env.DATABASE_URL });
  }
  return pool;
};