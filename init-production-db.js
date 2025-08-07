// Production database initialization script
const sqlite3 = require('sqlite3');
const { randomUUID } = require('crypto');

const DB_PATH = process.env.ANYCRAWL_API_DB_CONNECTION || '/usr/src/app/db/database.db';

console.log('🔧 Initializing production database...');
console.log('📁 Database path:', DB_PATH);

// Open database
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    }
    console.log('✅ Database connection established');
});

// Function to run SQL commands
function runSQL(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

// Function to get data
function getSQL(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function initializeDatabase() {
    try {
        console.log('🏗️ Creating tables...');
        
        // Create api_key table
        await runSQL(`
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
            )
        `);
        
        // Create unique index
        await runSQL(`CREATE UNIQUE INDEX IF NOT EXISTS api_key_key_unique ON api_key (key)`);
        
        // Create request_log table
        await runSQL(`
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
            )
        `);
        
        console.log('✅ Tables created successfully');
        
        // Check if API key already exists
        const existingKeys = await getSQL('SELECT COUNT(*) as count FROM api_key');
        
        if (existingKeys[0].count === 0) {
            console.log('🔑 Creating API key...');
            
            const uuid = randomUUID();
            const apiKey = 'sk-prod-artifactscraper-12345678901234567890abcdef';
            const now = Date.now();
            
            await runSQL(`
                INSERT INTO api_key (uuid, key, name, is_active, created_by, credits, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [uuid, apiKey, 'production-key', 1, -1, 5000, now]);
            
            console.log('✅ API key created successfully!');
            console.log('🔑 API Key:', apiKey);
            console.log('📊 Credits: 5000');
        } else {
            console.log('ℹ️ API keys already exist, skipping creation');
        }
        
        // Show all API keys
        const allKeys = await getSQL('SELECT uuid, key, name, credits, is_active FROM api_key');
        console.log('📋 All API keys:');
        allKeys.forEach(key => {
            console.log(`   - ${key.name}: ${key.key} (${key.credits} credits, active: ${key.is_active})`);
        });
        
        console.log('');
        console.log('🎉 Database initialization complete!');
        console.log('🔗 Test with:');
        console.log('curl -H "Authorization: Bearer sk-prod-artifactscraper-12345678901234567890abcdef" \\');
        console.log('     -H "Content-Type: application/json" \\');
        console.log('     -d \'{"url": "https://example.com"}\' \\');
        console.log('     https://artifactscraper-production.up.railway.app/api/v1/scrape');
        
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        process.exit(1);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('✅ Database connection closed');
            }
            process.exit(0);
        });
    }
}

initializeDatabase();