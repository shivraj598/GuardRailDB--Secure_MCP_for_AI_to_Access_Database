import pg from "pg";

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    throw new Error(
      "Database pool not initialized. Call connectPool(connectionString) first."
    );
  }
  return pool;
}

export async function connectPool(connectionString: string): Promise<pg.Pool> {
  if (pool) {
    await pool.end();
  }
  pool = new pg.Pool({ connectionString, max: 5 });
  pool.on("error", (err) => {
    console.error("Unexpected pool error:", err);
  });
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
