const fs = require('fs');

// Create database directory
const dbDir = './db';
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('✅ Created database directory');
}

// Try to use the app's database initialization
try {
    process.chdir('./apps/api');
    const { initializeDatabase, schemas } = require('./dist/db/index.js');
    const { randomUUID } = require('crypto');
    
    async function setupDatabase() {
        console.log('🔧 Initializing database...');
        const db = await initializeDatabase();
        console.log('✅ Database initialized');
        
        const uuid = randomUUID();
        const apiKey = 'sk-test-artifactscraper-12345678901234567890abcdef';
        const now = Date.now();
        
        await db.insert(schemas.apiKey).values({
            uuid: uuid,
            key: apiKey,
            name: 'test-key',
            isActive: true,
            createdBy: -1,
            credits: 1000,
            createdAt: new Date(now)
        });
        
        console.log('✅ API key created successfully!');
        console.log('🔑 API Key:', apiKey);
        console.log('📊 Credits: 1000');
        
        // Verify the key was created
        const eq = require('drizzle-orm').eq;
        const result = await db.select().from(schemas.apiKey).where(eq(schemas.apiKey.key, apiKey));
        console.log('✅ Verification:', result.length > 0 ? 'SUCCESS' : 'FAILED');
        
        if (result.length > 0) {
            console.log('');
            console.log('🎉 Database setup complete!');
            console.log('🔗 Test your API key with:');
            console.log('curl -H "Authorization: Bearer ' + apiKey + '" \\');
            console.log('     -H "Content-Type: application/json" \\');
            console.log('     -d \'{"url": "https://example.com"}\' \\');
            console.log('     https://artifactscraper-production.up.railway.app/api/v1/scrape');
        }
        
        process.exit(0);
    }
    
    setupDatabase().catch(error => {
        console.error('❌ Error setting up database:', error.message);
        console.error(error.stack);
        process.exit(1);
    });
    
} catch (error) {
    console.error('❌ Failed to load database modules:', error.message);
    console.log('💡 The app modules might not be built or available');
    process.exit(1);
}