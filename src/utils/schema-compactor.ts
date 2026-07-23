import { getPool } from "../db/pool.js";

interface TableInfo {
  schema: string;
  name: string;
  type: "TABLE" | "VIEW";
  columns: ColumnInfo[];
}

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  defaultValue: string | null;
}

export async function getCompactSchema(schemaFilter?: string): Promise<string> {
  const pool = getPool();

  const schemaCondition = schemaFilter
    ? `AND t.table_schema = $1`
    : `AND t.table_schema NOT IN ('pg_catalog', 'information_schema')`;

  const tablesResult = await pool.query(
    `
    SELECT
      t.table_schema,
      t.table_name,
      t.table_type
    FROM information_schema.tables t
    WHERE t.table_type IN ('BASE TABLE', 'VIEW')
      ${schemaCondition}
    ORDER BY t.table_schema, t.table_name
  `,
    schemaFilter ? [schemaFilter] : []
  );

  const tables: TableInfo[] = [];

  for (const row of tablesResult.rows) {
    const columnsResult = await pool.query(
      `
      SELECT
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END AS is_primary_key
      FROM information_schema.columns c
      LEFT JOIN (
        SELECT ku.table_schema, ku.table_name, ku.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage ku
          ON tc.constraint_name = ku.constraint_name
          AND tc.table_schema = ku.table_schema
          AND tc.table_name = ku.table_name
        WHERE tc.constraint_type = 'PRIMARY KEY'
      ) pk
        ON pk.table_schema = c.table_schema
        AND pk.table_name = c.table_name
        AND pk.column_name = c.column_name
      WHERE c.table_schema = $1 AND c.table_name = $2
      ORDER BY c.ordinal_position
    `,
      [row.table_schema, row.table_name]
    );

    const columns: ColumnInfo[] = columnsResult.rows.map((col: any) => ({
      name: col.column_name,
      type: col.data_type,
      nullable: col.is_nullable === "YES",
      isPrimaryKey: col.is_primary_key,
      defaultValue: col.column_default,
    }));

    tables.push({
      schema: row.table_schema,
      name: row.table_name,
      type: row.table_type === "VIEW" ? "VIEW" : "TABLE",
      columns,
    });
  }

  return formatCompactSchema(tables);
}

function formatCompactSchema(tables: TableInfo[]): string {
  const lines: string[] = [];

  for (const table of tables) {
    const prefix = table.type === "VIEW" ? "VIEW" : "TABLE";
    lines.push(`### ${prefix}: ${table.schema}.${table.name}`);

    const header = `| Column | Type | Nullable | PK | Default |`;
    const separator = `|--------|------|----------|----|---------|`;
    lines.push(header);
    lines.push(separator);

    for (const col of table.columns) {
      const pk = col.isPrimaryKey ? "✓" : "";
      const nullable = col.nullable ? "YES" : "NO";
      const def = col.defaultValue ?? "";
      lines.push(`| ${col.name} | ${col.type} | ${nullable} | ${pk} | ${def} |`);
    }

    lines.push("");
  }

  return lines.join("\n").trim();
}
