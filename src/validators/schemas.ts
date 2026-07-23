import { z } from "zod";

export const GetSchemaArgs = z.object({
  schema: z.string().optional().describe("Optional schema filter (defaults to public)"),
});

export const ExecuteQueryArgs = z.object({
  query: z
    .string()
    .min(1, "Query must not be empty")
    .describe("SELECT SQL query to execute"),
  params: z
    .array(z.unknown())
    .optional()
    .describe("Query parameter values"),
  limit: z
    .number()
    .int()
    .positive()
    .max(50)
    .optional()
    .describe("Max rows (capped at 50)"),
});

export const SimulateQueryArgs = z.object({
  query: z
    .string()
    .min(1, "Query must not be empty")
    .describe("SQL query to simulate (will be rolled back)"),
  params: z
    .array(z.unknown())
    .optional()
    .describe("Query parameter values"),
});

export type GetSchemaArgs = z.infer<typeof GetSchemaArgs>;
export type ExecuteQueryArgs = z.infer<typeof ExecuteQueryArgs>;
export type SimulateQueryArgs = z.infer<typeof SimulateQueryArgs>;
