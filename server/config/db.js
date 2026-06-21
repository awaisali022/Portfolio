import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import dotenv from 'dotenv';
import localSupabase from './localdb.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const databaseUrl = process.env.DATABASE_URL;

// Helper to validate URL structure
const isValidHttpUrl = (string) => {
  if (!string) return false;
  return string.startsWith('http://') || string.startsWith('https://');
};

// Determine if we have valid Supabase credentials
const hasValidSupabase = isValidHttpUrl(supabaseUrl) && supabaseKey && supabaseKey !== 'your_supabase_service_role_key';
const isPlaceholderDbUrl = !databaseUrl || databaseUrl.includes('your_supabase_postgresql_connection_string');

// Initialize Supabase REST API client (or use local fallback)
let supabase;
if (hasValidSupabase) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('🔗 Using Supabase cloud client.');
} else {
  supabase = localSupabase;
  console.log('📁 Using local JSON-file database (no Supabase credentials configured).');
  console.log('   Data is stored in server/data/*.json — fully functional offline mode.');
}

// Initialize Postgres connection pool (for seeding, raw SQL operations)
let pool;
if (!isPlaceholderDbUrl) {
  pool = new pg.Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false // Required for hosted databases like Supabase
    }
  });
} else {
  pool = new pg.Pool(); // Empty pool that will fail on connect
}

export const query = async (text, params) => {
  if (isPlaceholderDbUrl) {
    throw new Error('DATABASE_URL is missing. Cannot execute SQL query.');
  }
  return pool.query(text, params);
};

const connectDB = async () => {
  if (hasValidSupabase && !isPlaceholderDbUrl) {
    try {
      const client = await pool.connect();
      console.log('✅ PostgreSQL / Supabase Database Connected successfully via pg pool.');
      client.release();
    } catch (error) {
      console.error('❌ PostgreSQL / Supabase Connection Error:', error.message);
    }
  } else if (!hasValidSupabase) {
    console.log('✅ Local JSON database is ready. No external connection needed.');
  } else {
    console.log('Database URL not configured yet. Server is running but raw SQL queries will fail.');
  }
};

export const mapId = (obj) => {
  if (!obj) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => mapId(item));
  }
  const { id, ...rest } = obj;
  return { _id: id, id, ...rest };
};

export { supabase, pool };
export default connectDB;
