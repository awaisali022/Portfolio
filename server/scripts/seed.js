import pg from 'pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL environment variable is missing in server/.env.');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

const seedData = async () => {
  try {
    console.log('🔄 Connecting to PostgreSQL/Supabase Database...');
    const client = await pool.connect();
    console.log('✅ Connected.');

    // 1. Read and execute schema.sql
    console.log('📊 Initializing database schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Schema tables created successfully.');

    // 2. Seed Admin User
    console.log('👤 Seeding admin user...');
    const adminEmail = 'admin@portfolio.com';
    const adminUsername = 'admin';
    const rawPassword = 'admin12345';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [adminUsername, adminEmail, hashedPassword]
    );
    console.log(`✅ Admin user seeded: email: ${adminEmail}, password: ${rawPassword}`);

    // 3. Seed Settings
    console.log('⚙️ Seeding settings...');
    const settings = {
      heroTitle: 'Awais Ali',
      heroSubtitle: 'Full Stack Developer',
      heroRoles: JSON.stringify(['Full Stack Developer', 'React & Node Architect', '3D UI Designer', 'MERN Specialist']),
      aboutBio: 'I am a highly motivated Full Stack Developer with 4+ years of professional experience in crafting responsive, visually engaging, and high-performance web applications. Specializing in React, Node.js, and Three.js, I bridge the gap between creative visual designs and powerful backend logic.',
      yearsExperience: 4,
      projectsCompleted: 25,
      happyClients: 15,
      githubUrl: 'https://github.com/awais-ali',
      linkedinUrl: 'https://linkedin.com/in/awais-ali',
      twitterUrl: 'https://twitter.com/awais_ali',
      instagramUrl: 'https://instagram.com/awais_ali',
      emailAddress: 'awais.ali@example.com',
      resumeUrl: '',
      seoTitle: 'Awais Ali | Full Stack MERN Developer',
      seoDescription: 'Professional portfolio of Awais Ali, featuring interactive 3D elements, animations, and custom dashboard services.',
      seoKeywords: JSON.stringify(['MERN Stack', 'React', 'Three.js', 'Node.js', 'Express', 'Portfolio', 'Web Developer'])
    };

    await client.query(
      `INSERT INTO settings (
        "heroTitle", "heroSubtitle", "heroRoles", "aboutBio", "yearsExperience", 
        "projectsCompleted", "happyClients", "githubUrl", "linkedinUrl", "twitterUrl", 
        "instagramUrl", "emailAddress", "resumeUrl", "seoTitle", "seoDescription", "seoKeywords"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        settings.heroTitle, settings.heroSubtitle, settings.heroRoles, settings.aboutBio, settings.yearsExperience,
        settings.projectsCompleted, settings.happyClients, settings.githubUrl, settings.linkedinUrl, settings.twitterUrl,
        settings.instagramUrl, settings.emailAddress, settings.resumeUrl, settings.seoTitle, settings.seoDescription, settings.seoKeywords
      ]
    );
    console.log('✅ Settings seeded.');

    // 4. Seed Skills
    console.log('🛠️ Seeding skills...');
    const skills = [
      { name: 'React.js', category: 'Frontend', proficiency: 95, icon: 'ReactIcon' },
      { name: 'JavaScript / ES6', category: 'Frontend', proficiency: 90, icon: 'JsIcon' },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 90, icon: 'TailwindIcon' },
      { name: 'Three.js / React Three Fiber', category: 'Frontend', proficiency: 80, icon: 'ThreeIcon' },
      { name: 'HTML5 & CSS3', category: 'Frontend', proficiency: 95, icon: 'HtmlIcon' },
      { name: 'Node.js & Express', category: 'Backend', proficiency: 88, icon: 'NodeIcon' },
      { name: 'MongoDB & Mongoose', category: 'Backend', proficiency: 85, icon: 'MongoIcon' },
      { name: 'REST APIs & GraphQL', category: 'Backend', proficiency: 90, icon: 'ApiIcon' },
      { name: 'Git & GitHub', category: 'Tools', proficiency: 90, icon: 'GitIcon' },
      { name: 'Docker', category: 'Tools', proficiency: 70, icon: 'DockerIcon' },
      { name: 'Figma', category: 'Design', proficiency: 75, icon: 'FigmaIcon' }
    ];

    for (const skill of skills) {
      await client.query(
        'INSERT INTO skills (name, category, proficiency, icon) VALUES ($1, $2, $3, $4)',
        [skill.name, skill.category, skill.proficiency, skill.icon]
      );
    }
    console.log('✅ Skills seeded.');

    // 5. Seed Projects
    console.log('📂 Seeding projects...');
    const projects = [
      {
        title: '3D Interactive Portfolio',
        description: 'A stunning MERN portfolio displaying 3D particle animations, hover-tilt systems, dynamic timelines, and a robust admin dashboard built using R3F and Framer Motion.',
        techStack: JSON.stringify(['React', 'Three.js', 'GSAP', 'Node.js', 'MongoDB', 'Tailwind']),
        liveLink: 'https://awais-ali-portfolio.example.com',
        githubLink: 'https://github.com/awais-ali/3d-portfolio',
        category: 'Frontend & 3D',
        featured: true,
        order: 1,
        images: JSON.stringify(['https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600'])
      },
      {
        title: 'E-Commerce Platform with Dashboard',
        description: 'A fully-featured e-commerce platform incorporating secure Stripe payments, cart state management, product filtering, and a separate vendor overview panel.',
        techStack: JSON.stringify(['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Stripe']),
        liveLink: 'https://awais-store.example.com',
        githubLink: 'https://github.com/awais-ali/mern-store',
        category: 'Full Stack',
        featured: true,
        order: 2,
        images: JSON.stringify(['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600'])
      },
      {
        title: 'AI Collaborative Canvas',
        description: 'Real-time collaborative drawing and design application powered by Socket.io, integrating OpenAI APIs to suggest graphic themes and autogenerate vectors.',
        techStack: JSON.stringify(['Vite', 'Socket.io', 'Node.js', 'OpenAI API', 'Tailwind CSS']),
        liveLink: 'https://ai-canvas.example.com',
        githubLink: 'https://github.com/awais-ali/ai-canvas',
        category: 'Web Sockets',
        featured: false,
        order: 3,
        images: JSON.stringify(['https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600'])
      }
    ];

    for (const project of projects) {
      await client.query(
        'INSERT INTO projects (title, description, images, "techStack", "liveLink", "githubLink", category, featured, "order") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [project.title, project.description, project.images, project.techStack, project.liveLink, project.githubLink, project.category, project.featured, project.order]
      );
    }
    console.log('✅ Projects seeded.');

    // 6. Seed Experiences
    console.log('💼 Seeding experiences...');
    const experiences = [
      {
        company: 'Vertex Tech Solutions',
        role: 'Senior Full Stack Developer',
        location: 'Remote / Islamabad',
        description: JSON.stringify([
          'Led a squad of 4 developers to re-engineer an enterprise ERP platform, improving page speeds by 40%.',
          'Integrated complex R3F interactive asset visualizers into client marketing landing experiences.',
          'Built microservices handling PDF generation and file processing, boosting throughput by 30%.'
        ]),
        startDate: 'Jan 2024',
        endDate: 'Present',
        current: true
      },
      {
        company: 'PixelForge Studios',
        role: 'Full Stack Developer',
        location: 'Lahore, Pakistan',
        description: JSON.stringify([
          'Developed responsive single-page applications using React, Context API, and Tailwind CSS.',
          'Designed Mongoose database architectures and integrated third-party payment gateways (Stripe, Paypal).',
          'Optimized REST APIs reducing server processing times from 400ms to under 150ms.'
        ]),
        startDate: 'Aug 2022',
        endDate: 'Dec 2023',
        current: false
      }
    ];

    for (const exp of experiences) {
      await client.query(
        'INSERT INTO experiences (company, role, location, description, "startDate", "endDate", current) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [exp.company, exp.role, exp.location, exp.description, exp.startDate, exp.endDate, exp.current]
      );
    }
    console.log('✅ Experiences seeded.');

    // 7. Seed Educations
    console.log('🎓 Seeding educations...');
    const educations = [
      {
        institution: 'National University of Sciences and Technology (NUST)',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: 'Sep 2018',
        endDate: 'Jul 2022',
        description: 'Graduated with Honors. Specialized in Software Engineering, Web Design, and Database Management Systems.'
      }
    ];

    for (const edu of educations) {
      await client.query(
        'INSERT INTO educations (institution, degree, "fieldOfStudy", "startDate", "endDate", description) VALUES ($1, $2, $3, $4, $5, $6)',
        [edu.institution, edu.degree, edu.fieldOfStudy, edu.startDate, edu.endDate, edu.description]
      );
    }
    console.log('✅ Educations seeded.');

    // 8. Seed Services
    console.log('🛎️ Seeding services...');
    const services = [
      {
        title: 'Full Stack Web Development',
        description: 'End-to-end development of dynamic, database-driven web applications. I design responsive frontend UI layouts and construct secure RESTful server systems.',
        icon: 'Code',
        price: 'Starting from $800',
        order: 1
      },
      {
        title: '3D Web Experiences',
        description: 'Interactive web layouts rendering real-time animated 3D assets, particles, and custom environments using React Three Fiber to make your business stand out.',
        icon: 'Box',
        price: 'Starting from $1200',
        order: 2
      },
      {
        title: 'API Development & Integration',
        description: 'Building fast, secure, and documented REST APIs. Linking frontend interfaces with payment gateways, email nodes, analytics trackers, and other third-party APIs.',
        icon: 'Server',
        price: 'Starting from $400',
        order: 3
      }
    ];

    for (const svc of services) {
      await client.query(
        'INSERT INTO services (title, description, icon, price, "order") VALUES ($1, $2, $3, $4, $5)',
        [svc.title, svc.description, svc.icon, svc.price, svc.order]
      );
    }
    console.log('✅ Services seeded.');

    // 9. Seed Testimonials
    console.log('💬 Seeding testimonials...');
    const testimonials = [
      {
        name: 'Sarah Connor',
        role: 'Product Manager',
        company: 'Skynet Tech',
        message: 'Awais built our entire dashboard backend and three-dimensional landing page. His engineering skills are top-notch, and he delivered the codebase ahead of schedule.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
        rating: 5,
        approved: true
      },
      {
        name: 'John Doe',
        role: 'CTO',
        company: 'Nova Digital',
        message: 'Working with Awais was a fantastic experience. His proficiency in the MERN stack and ability to create beautiful 3D animations made our product debut a massive success.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
        rating: 5,
        approved: true
      }
    ];

    for (const test of testimonials) {
      await client.query(
        'INSERT INTO testimonials (name, role, company, message, avatar, rating, approved) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [test.name, test.role, test.company, test.message, test.avatar, test.rating, test.approved]
      );
    }
    console.log('✅ Testimonials seeded.');

    // 10. Seed Blogs
    console.log('✍️ Seeding blogs...');
    const blogs = [
      {
        title: 'Getting Started with React Three Fiber (3D on the Web)',
        slug: 'getting-started-react-three-fiber',
        content: '<p>Three.js is an amazing library that enables 3D graphics on the web, but using it inside React can sometimes feel verbose. That is where <strong>React Three Fiber (R3F)</strong> shines. In this guide, we will cover how to initialize an R3F Canvas, create simple geometries, add lighting, and implement basic mouse controls using <code>@react-three/drei</code>.</p><h3>Why R3F?</h3><p>React Three Fiber compiles standard React components into Three.js nodes. This allows developers to use state hooks, conditional rendering, and context directly inside 3D graphics.</p>',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600',
        tags: JSON.stringify(['React', 'Three.js', '3D Graphics', 'Web Development']),
        status: 'published'
      },
      {
        title: 'Optimizing MERN Stack Application Performance',
        slug: 'optimizing-mern-performance',
        content: '<p>Performance is key to retaining users on your website. In MERN stack development, optimization spans databases, API design, bundle sizes, and image delivery. In this post, we discuss practical tips such as database indexing in Mongoose, server-side caching, image compression, and dynamic route loading in Vite/React.</p>',
        coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600',
        tags: JSON.stringify(['MERN', 'Performance', 'Node.js', 'MongoDB']),
        status: 'published'
      }
    ];

    for (const blog of blogs) {
      await client.query(
        'INSERT INTO blog_posts (title, slug, content, "coverImage", tags, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [blog.title, blog.slug, blog.content, blog.coverImage, blog.tags, blog.status]
      );
    }
    console.log('✅ Blog posts seeded.');

    client.release();
    console.log('🎉 Supabase PostgreSQL Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
