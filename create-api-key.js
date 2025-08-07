#!/usr/bin/env node

/**
 * Script to create an API key for ArtifactScraper
 * Usage: node create-api-key.js [key-name] [credits]
 */

import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import { randomBytes } from 'crypto';
import path from 'path';

// Default configuration
const DEFAULT_KEY_NAME = 'test-key';
const DEFAULT_CREDITS = 1000;
const DB_PATH = process.env.ANYCRAWL_API_DB_CONNECTION || '/usr/src/app/db/database.db';

// Generate a secure API key
function generateApiKey() {
    return 'sk-' + randomBytes(32).toString('hex');
}

// Get command line arguments
const keyName = process.argv[2] || DEFAULT_KEY_NAME;
const credits = parseInt(process.argv[3]) || DEFAULT_CREDITS;

try {
    console.log('🔑 Creating API key for ArtifactScraper...');
    console.log(`📁 Database path: ${DB_PATH}`);
    
    // Connect to SQLite database
    const db = new Database(DB_PATH);
    
    // Generate new API key
    const uuid = randomUUID();
    const apiKey = generateApiKey();
    const now = Date.now();
    
    // Insert API key into database
    const stmt = db.prepare(`
        INSERT INTO api_key (uuid, key, name, is_active, created_by, credits, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(uuid, apiKey, keyName, 1, -1, credits, now);
    
    console.log('✅ API key created successfully!');
    console.log('');
    console.log('🔑 API Key Details:');
    console.log(`   UUID: ${uuid}`);
    console.log(`   Key:  ${apiKey}`);
    console.log(`   Name: ${keyName}`);
    console.log(`   Credits: ${credits}`);
    console.log(`   Active: true`);
    console.log('');
    console.log('📝 Usage Example:');
    console.log(`   curl -H "Authorization: Bearer ${apiKey}" \\`);
    console.log(`        -H "Content-Type: application/json" \\`);
    console.log(`        -d '{"url": "https://example.com"}' \\`);
    console.log(`        https://artifactscraper-production.up.railway.app/api/v1/scrape`);
    console.log('');
    
    db.close();
    
} catch (error) {
    console.error('❌ Error creating API key:', error.message);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   - Make sure the database exists and is accessible');
    console.error('   - Check that the database path is correct');
    console.error('   - Ensure database migrations have been run');
    process.exit(1);
}