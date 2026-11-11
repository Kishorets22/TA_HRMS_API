import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import type { DataSourceOptions } from 'typeorm';

// IDs are BIGINT in the database but `number` in the code. By default the pg
// driver returns BIGINT (int8) as a string; parse it as a number instead.
// Safe while values stay below Number.MAX_SAFE_INTEGER (9,007,199,254,740,991).
pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) =>
  Number.parseInt(value, 10),
);

const SRC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const toGlob = (...segments: string[]) =>
  join(SRC_DIR, ...segments).replaceAll('\\', '/');

export const ENTITIES_GLOB = toGlob('modules', '**', 'entities', '*.entity.{ts,js}');

export const createTypeOrmConfig = (
  get: (key: string) => string | undefined,
): DataSourceOptions => ({
  type: 'postgres',
  host: get('DB_HOST'),
  port: Number(get('DB_PORT') ?? 5432),
  username: get('DB_USERNAME'),
  password: get('DB_PASSWORD'),
  database: get('DB_NAME'),
  entities: [ENTITIES_GLOB],
  synchronize: get('DB_SYNCHRONIZE') !== 'false',
  logging: ['error', 'warn'],
});