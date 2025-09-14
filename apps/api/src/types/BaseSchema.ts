import { z } from "zod";
import { AVAILABLE_ENGINES } from "@artifactscraper/scrape/managers/EngineQueue";

// Define the recursive JSON Schema type
export const jsonSchemaType: z.ZodType<any> = z.lazy(() =>
    z.object({
        type: z.enum(["object", "array", "string", "number", "boolean", "null"]).optional(),
        properties: z.record(jsonSchemaType).optional(),
        items: jsonSchemaType.optional(), // For array types
        required: z.array(z.string()).optional(),
        additionalProperties: z.boolean().optional(),
        enum: z.array(z.any()).optional(),
        description: z.string().optional(),
        minimum: z.number().optional(),
        maximum: z.number().optional(),
        minItems: z.number().optional(),
        maxItems: z.number().optional(),
        // Allow any additional properties to support full JSON Schema spec
    }).passthrough() // This allows additional properties not explicitly defined
);

// define json options schema
export const jsonOptionsSchema = z.object({
    /**
     * The JSON schema to be used for extracting structured data
     */
    schema: jsonSchemaType.optional(),

    /**
     * The user prompt to be used for extracting structured data
     */
    user_prompt: z.string().optional(),
    schema_name: z.string().optional(),
    schema_description: z.string().optional(),
}).strict();

// define base schema
export const baseSchema = z.object({
    /**
     * The URL to be processed
     */
    url: z.string().url(),

    /**
     * The engine to be used
     */
    engine: z.enum(AVAILABLE_ENGINES).default("cheerio"),

    /**
     * The proxy to be used
     */
    proxy: z.string().url().optional(),

    /**
     * The formats to be used
     */
    formats: z.array(z.enum(["markdown", "html", "text", "screenshot", "screenshot@fullPage", "rawHtml", "json"])).default(["markdown"]),

    /**
     * The timeout to be used
     */
    timeout: z.number().min(1000).max(600_000).default(60_000),

    /**
     * The wait for to be used
     */
    wait_for: z.number().min(1).max(60_000).optional(),

    /**
     * The retry to be used
     */
    retry: z.boolean().default(false),

    /**
     * The include tags to be used
     */
    include_tags: z.array(z.string()).optional(),

    /**
     * The exclude tags to be used
     */
    exclude_tags: z.array(z.string()).optional(),

    /**
     * The JSON schema to be used for extracting structured data
     */
    json_schema: jsonSchemaType.optional(),

    /**
     * The JSON options to be used for extracting structured data
     */
    json_options: jsonOptionsSchema.optional(),
});

export type BaseSchema = z.infer<typeof baseSchema>;

export type JsonSchemaType = z.infer<typeof jsonSchemaType>;