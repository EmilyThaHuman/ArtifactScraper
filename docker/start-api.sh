#!/bin/sh
set -e

# Set default environment variables if not provided
export ANYCRAWL_API_DB_TYPE=${ANYCRAWL_API_DB_TYPE:-sqlite}
export ANYCRAWL_API_DB_CONNECTION=${ANYCRAWL_API_DB_CONNECTION:-/usr/src/app/storage/artifactscraper.db}
export ANYCRAWL_API_PORT=${ANYCRAWL_API_PORT:-8080}
export ANYCRAWL_API_AUTH_ENABLED=${ANYCRAWL_API_AUTH_ENABLED:-false}

# Create storage directory and any subdirectories if they don't exist
mkdir -p /usr/src/app/storage
mkdir -p "$(dirname "$ANYCRAWL_API_DB_CONNECTION")"

echo "Starting API server with database type: $ANYCRAWL_API_DB_TYPE"
echo "Database connection: $ANYCRAWL_API_DB_CONNECTION"
echo "API port: $ANYCRAWL_API_PORT"

# Initialize SQLite database if it doesn't exist or is empty
if [ "$ANYCRAWL_API_DB_TYPE" = "sqlite" ]; then
    echo "🗄️ Checking SQLite database initialization..."
    
    # Check if database exists and has tables
    if [ ! -f "$ANYCRAWL_API_DB_CONNECTION" ] || [ ! -s "$ANYCRAWL_API_DB_CONNECTION" ] || ! sqlite3 "$ANYCRAWL_API_DB_CONNECTION" ".tables" | grep -q "api_key"; then
        echo "🚀 Initializing SQLite database with required tables..."
        
        # Run the setup SQL script
        sqlite3 "$ANYCRAWL_API_DB_CONNECTION" << 'EOF'
-- Create API key table
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

-- Create request log table
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

-- Insert production API key (only if none exist)
INSERT OR IGNORE INTO api_key (uuid, key, name, is_active, created_by, credits, created_at)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'sk-prod-artifactscraper-12345678901234567890abcdef', 'production-key', 1, -1, 5000, strftime('%s', 'now') * 1000);
EOF

        if [ $? -eq 0 ]; then
            echo "✅ Database initialized successfully"
            # Verify the setup
            echo "📋 Tables created:"
            sqlite3 "$ANYCRAWL_API_DB_CONNECTION" ".tables"
            echo "🔑 API keys:"
            sqlite3 "$ANYCRAWL_API_DB_CONNECTION" "SELECT uuid, key, name, credits, is_active FROM api_key;"
        else
            echo "❌ Failed to initialize database"
            exit 1
        fi
    else
        echo "✅ Database already initialized"
    fi
fi

# Start the API server
exec node ./dist/index.js 