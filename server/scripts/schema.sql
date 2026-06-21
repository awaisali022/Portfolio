-- Enable pgcrypto for UUID generation if needed, though gen_random_uuid() is built-in in modern PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for seeding/reset purposes)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS educations CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Settings Table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "heroTitle" VARCHAR(255) DEFAULT 'Awais Ali',
  "heroSubtitle" VARCHAR(255) DEFAULT 'Full Stack Developer',
  "heroRoles" JSONB DEFAULT '[]'::jsonb,
  "aboutBio" TEXT DEFAULT '',
  "yearsExperience" INT DEFAULT 0,
  "projectsCompleted" INT DEFAULT 0,
  "happyClients" INT DEFAULT 0,
  "githubUrl" VARCHAR(255) DEFAULT '',
  "linkedinUrl" VARCHAR(255) DEFAULT '',
  "twitterUrl" VARCHAR(255) DEFAULT '',
  "instagramUrl" VARCHAR(255) DEFAULT '',
  "emailAddress" VARCHAR(255) DEFAULT '',
  "resumeUrl" VARCHAR(255) DEFAULT '',
  "seoTitle" VARCHAR(255) DEFAULT '',
  "seoDescription" TEXT DEFAULT '',
  "seoKeywords" JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Skills Table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  proficiency INT DEFAULT 0,
  icon VARCHAR(255) DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  "techStack" JSONB DEFAULT '[]'::jsonb,
  "liveLink" VARCHAR(255) DEFAULT '',
  "githubLink" VARCHAR(255) DEFAULT '',
  category VARCHAR(255) DEFAULT '',
  featured BOOLEAN DEFAULT FALSE,
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Experiences Table
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  location VARCHAR(255) DEFAULT '',
  description JSONB DEFAULT '[]'::jsonb,
  "startDate" VARCHAR(255) DEFAULT '',
  "endDate" VARCHAR(255) DEFAULT '',
  current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Educations Table
CREATE TABLE educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  "fieldOfStudy" VARCHAR(255) DEFAULT '',
  "startDate" VARCHAR(255) DEFAULT '',
  "endDate" VARCHAR(255) DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Services Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  icon VARCHAR(255) DEFAULT '',
  price VARCHAR(255) DEFAULT '',
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Testimonials Table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT '',
  company VARCHAR(255) DEFAULT '',
  message TEXT DEFAULT '',
  avatar VARCHAR(255) DEFAULT '',
  rating INT DEFAULT 5,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT DEFAULT '',
  "coverImage" VARCHAR(255) DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) DEFAULT 'No Subject',
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  "replySent" BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
