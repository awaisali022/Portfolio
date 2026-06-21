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

-- Seed Data Inserts

-- 1. Seed Admin User (password: admin12345)
INSERT INTO users (username, email, password) VALUES 
('admin', 'admin@portfolio.com', '$2a$10$svk2/mIyUC0dWX3CWWsHkeAV95v5eLDgUAdu3trQT0GiMDyYFChEO');

-- 2. Seed Settings
INSERT INTO settings (
  "heroTitle", "heroSubtitle", "heroRoles", "aboutBio", "yearsExperience", 
  "projectsCompleted", "happyClients", "githubUrl", "linkedinUrl", "twitterUrl", 
  "instagramUrl", "emailAddress", "resumeUrl", "seoTitle", "seoDescription", "seoKeywords"
) VALUES (
  'Awais Ali',
  'Full Stack Developer',
  '["Full Stack Developer", "React & Node Architect", "3D UI Designer", "MERN Specialist"]'::jsonb,
  'I am a highly motivated Full Stack Developer with 4+ years of professional experience in crafting responsive, visually engaging, and high-performance web applications. Specializing in React, Node.js, and Three.js, I bridge the gap between creative visual designs and powerful backend logic.',
  4,
  25,
  15,
  'https://github.com/awais-ali',
  'https://linkedin.com/in/awais-ali',
  'https://twitter.com/awais_ali',
  'https://instagram.com/awais_ali',
  'awais.ali@example.com',
  '',
  'Awais Ali | Full Stack MERN Developer',
  'Professional portfolio of Awais Ali, featuring interactive 3D elements, animations, and custom dashboard services.',
  '["MERN Stack", "React", "Three.js", "Node.js", "Express", "Portfolio", "Web Developer"]'::jsonb
);

-- 3. Seed Skills
INSERT INTO skills (name, category, proficiency, icon) VALUES
('React.js', 'Frontend', 95, 'ReactIcon'),
('JavaScript / ES6', 'Frontend', 90, 'JsIcon'),
('Tailwind CSS', 'Frontend', 90, 'TailwindIcon'),
('Three.js / React Three Fiber', 'Frontend', 80, 'ThreeIcon'),
('HTML5 & CSS3', 'Frontend', 95, 'HtmlIcon'),
('Node.js & Express', 'Backend', 88, 'NodeIcon'),
('MongoDB & Mongoose', 'Backend', 85, 'MongoIcon'),
('REST APIs & GraphQL', 'Backend', 90, 'ApiIcon'),
('Git & GitHub', 'Tools', 90, 'GitIcon'),
('Docker', 'Tools', 70, 'DockerIcon'),
('Figma', 'Design', 75, 'FigmaIcon');

-- 4. Seed Projects
INSERT INTO projects (title, description, images, "techStack", "liveLink", "githubLink", category, featured, "order") VALUES
(
  '3D Interactive Portfolio',
  'A stunning MERN portfolio displaying 3D particle animations, hover-tilt systems, dynamic timelines, and a robust admin dashboard built using R3F and Framer Motion.',
  '["https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600"]'::jsonb,
  '["React", "Three.js", "GSAP", "Node.js", "MongoDB", "Tailwind"]'::jsonb,
  'https://awais-ali-portfolio.example.com',
  'https://github.com/awais-ali/3d-portfolio',
  'Frontend & 3D',
  TRUE,
  1
),
(
  'E-Commerce Platform with Dashboard',
  'A fully-featured e-commerce platform incorporating secure Stripe payments, cart state management, product filtering, and a separate vendor overview panel.',
  '["https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600"]'::jsonb,
  '["React", "Redux", "Node.js", "Express", "MongoDB", "Stripe"]'::jsonb,
  'https://awais-store.example.com',
  'https://github.com/awais-ali/mern-store',
  'Full Stack',
  TRUE,
  2
),
(
  'AI Collaborative Canvas',
  'Real-time collaborative drawing and design application powered by Socket.io, integrating OpenAI APIs to suggest graphic themes and autogenerate vectors.',
  '["https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600"]'::jsonb,
  '["Vite", "Socket.io", "Node.js", "OpenAI API", "Tailwind CSS"]'::jsonb,
  'https://ai-canvas.example.com',
  'https://github.com/awais-ali/ai-canvas',
  'Web Sockets',
  FALSE,
  3
);

-- 5. Seed Experiences
INSERT INTO experiences (company, role, location, description, "startDate", "endDate", current) VALUES
(
  'Vertex Tech Solutions',
  'Senior Full Stack Developer',
  'Remote / Islamabad',
  '["Led a squad of 4 developers to re-engineer an enterprise ERP platform, improving page speeds by 40%.", "Integrated complex R3F interactive asset visualizers into client marketing landing experiences.", "Built microservices handling PDF generation and file processing, boosting throughput by 30%."]'::jsonb,
  'Jan 2024',
  'Present',
  TRUE
),
(
  'PixelForge Studios',
  'Full Stack Developer',
  'Lahore, Pakistan',
  '["Developed responsive single-page applications using React, Context API, and Tailwind CSS.", "Designed Mongoose database architectures and integrated third-party payment gateways (Stripe, Paypal).", "Optimized REST APIs reducing server processing times from 400ms to under 150ms."]'::jsonb,
  'Aug 2022',
  'Dec 2023',
  FALSE
);

-- 6. Seed Educations
INSERT INTO educations (institution, degree, "fieldOfStudy", "startDate", "endDate", description) VALUES
(
  'National University of Sciences and Technology (NUST)',
  'Bachelor of Science',
  'Computer Science',
  'Sep 2018',
  'Jul 2022',
  'Graduated with Honors. Specialized in Software Engineering, Web Design, and Database Management Systems.'
);

-- 7. Seed Services
INSERT INTO services (title, description, icon, price, "order") VALUES
(
  'Full Stack Web Development',
  'End-to-end development of dynamic, database-driven web applications. I design responsive frontend UI layouts and construct secure RESTful server systems.',
  'Code',
  'Starting from $800',
  1
),
(
  '3D Web Experiences',
  'Interactive web layouts rendering real-time animated 3D assets, particles, and custom environments using React Three Fiber to make your business stand out.',
  'Box',
  'Starting from $1200',
  2
),
(
  'API Development & Integration',
  'Building fast, secure, and documented REST APIs. Linking frontend interfaces with payment gateways, email nodes, analytics trackers, and other third-party APIs.',
  'Server',
  'Starting from $400',
  3
);

-- 8. Seed Testimonials
INSERT INTO testimonials (name, role, company, message, avatar, rating, approved) VALUES
(
  'Sarah Connor',
  'Product Manager',
  'Skynet Tech',
  'Awais built our entire dashboard backend and three-dimensional landing page. His engineering skills are top-notch, and he delivered the codebase ahead of schedule.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
  5,
  TRUE
),
(
  'John Doe',
  'CTO',
  'Nova Digital',
  'Working with Awais was a fantastic experience. His proficiency in the MERN stack and ability to create beautiful 3D animations made our product debut a massive success.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
  5,
  TRUE
);

-- 9. Seed Blogs
INSERT INTO blog_posts (title, slug, content, "coverImage", tags, status) VALUES
(
  'Getting Started with React Three Fiber (3D on the Web)',
  'getting-started-react-three-fiber',
  '<p>Three.js is an amazing library that enables 3D graphics on the web, but using it inside React can sometimes feel verbose. That is where <strong>React Three Fiber (R3F)</strong> shines. In this guide, we will cover how to initialize an R3F Canvas, create simple geometries, add lighting, and implement basic mouse controls using <code>@react-three/drei</code>.</p><h3>Why R3F?</h3><p>React Three Fiber compiles standard React components into Three.js nodes. This allows developers to use state hooks, conditional rendering, and context directly inside 3D graphics.</p>',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600',
  '["React", "Three.js", "3D Graphics", "Web Development"]'::jsonb,
  'published'
),
(
  'Optimizing MERN Stack Application Performance',
  'optimizing-mern-performance',
  '<p>Performance is key to retaining users on your website. In MERN stack development, optimization spans databases, API design, bundle sizes, and image delivery. In this post, we discuss practical tips such as database indexing in Mongoose, server-side caching, image compression, and dynamic route loading in Vite/React.</p>',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600',
  '["MERN", "Performance", "Node.js", "MongoDB"]'::jsonb,
  'published'
);
