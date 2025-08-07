-- Create a test API key for ArtifactScraper
-- This inserts a test API key with 1000 credits

INSERT INTO api_key (
    uuid, 
    key, 
    name, 
    is_active, 
    created_by, 
    credits, 
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',  -- Test UUID
    'sk-test-artifactscraper-12345678901234567890abcdef',  -- Test API key
    'test-key',  -- Key name
    1,  -- Active (true)
    -1,  -- Created by system
    1000,  -- Credits
    strftime('%s', 'now') * 1000  -- Current timestamp in milliseconds
);

-- Verify the key was created
SELECT 
    uuid,
    key,
    name,
    is_active,
    credits,
    datetime(created_at/1000, 'unixepoch') as created_at_readable
FROM api_key 
WHERE key = 'sk-test-artifactscraper-12345678901234567890abcdef';