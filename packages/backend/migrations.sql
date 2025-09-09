-- Migration: Add developers table and extend voice_assistants
-- Date: 2025-09-09

-- 1. Create developers table
CREATE TABLE IF NOT EXISTS developers (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add developer_id column to voice_assistants (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'voice_assistants' 
        AND column_name = 'developer_id'
    ) THEN
        ALTER TABLE voice_assistants 
        ADD COLUMN developer_id VARCHAR(255) REFERENCES developers(id);
    END IF;
END $$;

-- 3. Update status column default value to 'pending' (if needed)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'voice_assistants' 
        AND column_name = 'status'
        AND column_default = '''draft''::character varying'
    ) THEN
        ALTER TABLE voice_assistants 
        ALTER COLUMN status SET DEFAULT 'pending';
    END IF;
END $$;

-- 4. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_voice_assistants_developer_id ON voice_assistants(developer_id);
CREATE INDEX IF NOT EXISTS idx_voice_assistants_status ON voice_assistants(status);
CREATE INDEX IF NOT EXISTS idx_developers_email ON developers(email);

-- 5. Insert sample developer for testing
INSERT INTO developers (id, name, email) 
VALUES ('dev-001', 'Max Dev', 'max@example.com')
ON CONFLICT (email) DO NOTHING;
