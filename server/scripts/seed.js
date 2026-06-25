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
            heroTitle: 'Muhammad Awais Ali',
      heroSubtitle: 'Software Engineer / Full Stack Developer',
      heroRoles: JSON.stringify(['Full Stack Developer', 'Software Engineer', 'MERN Stack Developer', 'React Specialist']),
      aboutBio: 'I am a results-driven Full Stack Web Developer with practical experience in building scalable web applications using the MERN stack. I specialize in developing dynamic user interfaces, designing RESTful APIs, and managing efficient database architectures. Having developed and deployed multiple real-world applications, including SaaS-based systems, I focus on performance optimization, clean code architecture, and seamless user experience. I am committed to pushing technical boundaries and contributing to high-quality, production-ready software solutions. Contact: +923054737765',
      yearsExperience: 4,
      projectsCompleted: 25,
      happyClients: 15,
      githubUrl: 'https://github.com/awais-ali',
      linkedinUrl: 'https://linkedin.com/in/awais-ali',
      twitterUrl: 'https://twitter.com/awais_ali',
      instagramUrl: 'https://instagram.com/awais_ali',
      emailAddress: 'fa23-bcs-022@cuivehari.edu.pk',
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
      { name: 'React', category: 'Frontend', proficiency: 90, icon: 'ReactIcon' },
      { name: 'JavaScript', category: 'Frontend', proficiency: 90, icon: 'JsIcon' },
      { name: 'HTML5 & CSS3', category: 'Frontend', proficiency: 95, icon: 'HtmlIcon' },
      { name: 'Bootstrap 5', category: 'Frontend', proficiency: 85, icon: 'BootstrapIcon' },
      { name: 'Node.js & Express', category: 'Backend', proficiency: 85, icon: 'NodeIcon' },
      { name: 'PHP (Laravel)', category: 'Backend', proficiency: 75, icon: 'PhpIcon' },
      { name: 'Supabase', category: 'Backend', proficiency: 80, icon: 'SupabaseIcon' },
      { name: 'MongoDB', category: 'Databases', proficiency: 85, icon: 'MongoIcon' },
      { name: 'MySQL', category: 'Databases', proficiency: 85, icon: 'MysqlIcon' },
      { name: 'PostgreSQL', category: 'Databases', proficiency: 80, icon: 'PostgresIcon' },
      { name: 'Git & GitHub', category: 'Tools', proficiency: 90, icon: 'GitIcon' },
      { name: 'Vercel, Netlify', category: 'Platforms', proficiency: 85, icon: 'VercelIcon' }
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
        title: 'AdFlow Pro – SaaS Web Application',
        description: 'Architected and developed a full-stack SaaS platform for advertisement workflow management. Implemented secure and scalable REST APIs using Node.js and Express.js. Designed real-time interactive dashboards using React. Structured MongoDB database for efficient data storage and retrieval. Deployed production-ready application on Vercel.',
        techStack: JSON.stringify(['React', 'Node.js', 'Express.js', 'MongoDB', 'Vercel']),
        liveLink: '',
        githubLink: '',
        category: 'Full Stack',
        featured: true,
        order: 1,
        images: JSON.stringify(['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600'])
      },
      {
        title: 'Full-Stack Portfolio / Resume Platform',
        description: 'Developed a modern, responsive portfolio platform with reusable component architecture. Integrated smooth navigation, animations, and optimized UI/UX design. Ensured cross-device compatibility and performance optimization.',
        techStack: JSON.stringify(['React', 'CSS', 'JavaScript']),
        liveLink: '',
        githubLink: '',
        category: 'Frontend',
        featured: true,
        order: 2,
        images: JSON.stringify(['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600'])
      },
      {
        title: 'GitHub UI Clone',
        description: 'Engineered a pixel-perfect GitHub interface clone using React. Applied component-based architecture and responsive design principles. Focused on UI accuracy, performance, and maintainable code structure.',
        techStack: JSON.stringify(['React', 'CSS']),
        liveLink: '',
        githubLink: '',
        category: 'Frontend',
        featured: false,
        order: 3,
        images: JSON.stringify(['https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600'])
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
        company: 'Full Stack Developer (Student Level)',
        role: 'Software Engineer',
        location: 'Multan, Pakistan',
        description: JSON.stringify([
          'Engineered full-stack web applications using React, Node.js, and Express.js with modular and scalable architecture.',
          'Designed and implemented RESTful APIs for efficient client-server communication.',
          'Developed dynamic dashboards and interactive UI components using modern frontend practices.',
          'Managed databases using MongoDB, ensuring optimized queries and structured data handling.',
          'Deployed and maintained applications on Vercel and cloud platforms for production access.',
          'Utilized Git-based workflows for version control, collaboration, and code management.',
          'Focused on performance optimization, debugging, and improving application scalability.'
        ]),
        startDate: '2023',
        endDate: 'Present',
        current: true
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
        institution: 'COMSATS University Islamabad, Pakistan',
        degree: 'Bachelors of Computer Science (BSCS)',
        fieldOfStudy: 'Computer Science',
        startDate: '2023',
        endDate: 'Present',
        description: 'Pursuing Bachelors in Computer Science.'
      },
      {
        institution: 'Post Graduate College, Pakistan',
        degree: 'Intermediate of Computer Science (ICS)',
        fieldOfStudy: 'Computer Science',
        startDate: '2021',
        endDate: '2023',
        description: 'Completed ICS with a focus on core computer science subjects.'
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
