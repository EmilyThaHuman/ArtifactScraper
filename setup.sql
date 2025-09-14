-- Initialize ArtifactScraper production database
-- Create tables
CREATE TABLE IF NOT EXISTS api_key (
    uuid text PRIMARY KEY NOT NULL,
    key text NOT NULL UNIQUE,
    user text,
    name text DEFAULT 'default',
    is_active integer DEFAULT 1 NOT NULL,
    created_by integer DEFAULT -1,
    credits integer DEFAULT 0 NOT NULL,
    created_at integer NOT NULL,
    last_used_at integer,
    expires_at integer
);

CREATE UNIQUE INDEX IF NOT EXISTS api_key_key_unique ON api_key (key);

CREATE TABLE IF NOT EXISTS request_log (
    uuid text PRIMARY KEY NOT NULL,
    api_key_id text,
    path text NOT NULL,
    method text NOT NULL,
    status_code integer NOT NULL,
    processing_time_ms real NOT NULL,
    credits_used integer DEFAULT 0 NOT NULL,
    ip_address text,
    user_agent text,
    request_payload text,
    request_header text,
    response_body text,
    response_header text,
    success integer DEFAULT 1 NOT NULL,
    created_at integer NOT NULL,
    FOREIGN KEY (api_key_id) REFERENCES api_key(uuid) ON UPDATE no action ON DELETE no action
);

-- Insert API key (only if none exist)
INSERT OR IGNORE INTO api_key (uuid, key, name, is_active, created_by, credits, created_at)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'sk-prod-artifactscraper-12345678901234567890abcdef', 'production-key', 1, -1, 5000, strftime('%s', 'now') * 1000);

-- Show all API keys
.headers on
.mode column
SELECT 'API Keys:' as info;
SELECT uuid, key, name, credits, is_active FROM api_key;