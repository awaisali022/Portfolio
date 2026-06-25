/**
 * Local Seed Script — Populates the server/data/*.json files with initial
 * portfolio data. This works without any external database connection.
 * 
 * Usage: node scripts/seed-local.js
 */

import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveTable, generateUUID } from '../config/localdb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const now = new Date().toISOString();

const seedLocalData = async () => {
  console.log('🌱 Seeding local JSON database...\n');

  // ── 1. Admin User ───────────────────────────────────────────────
  console.log('👤 Creating admin user...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin12345', salt);

  saveTable('users', [{
    id: generateUUID(),
    username: 'admin',
    email: 'admin@portfolio.com',
    password: hashedPassword,
    created_at: now,
    updated_at: now,
  }]);
  console.log('   ✅ Admin → email: admin@portfolio.com, password: admin12345');

  // ── 2. Settings ─────────────────────────────────────────────────
  console.log('⚙️  Creating site settings...');
  saveTable('settings', [{
    id: generateUUID(),
        heroTitle: 'Muhammad Awais Ali',
    heroSubtitle: 'Software Engineer / Full Stack Developer',
    heroRoles: ['Full Stack Developer', 'Software Engineer', 'MERN Stack Developer', 'React Specialist'],
    aboutBio: 'I am a results-driven Full Stack Web Developer with practical experience in building scalable web applications using the MERN stack. I specialize in developing dynamic user interfaces, designing RESTful APIs, and managing efficient database architectures. Having developed and deployed multiple real-world applications, including SaaS-based systems, I focus on performance optimization, clean code architecture, and seamless user experience. I am committed to pushing technical boundaries and contributing to high-quality, production-ready software solutions. Contact: +923054737765',
    aboutImage: 'https://raw.githubusercontent.com/awaisali022/Projects-picsk-/main/personal%20picks_01.png',
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
    seoKeywords: ['MERN Stack', 'React', 'Three.js', 'Node.js', 'Express', 'Portfolio', 'Web Developer'],
    created_at: now,
    updated_at: now,
  }]);
  console.log('   ✅ Settings seeded.');

  // ── 3. Skills ───────────────────────────────────────────────────
  console.log('🛠️  Creating skills...');
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
  saveTable('skills', skills.map(s => ({
    id: generateUUID(),
    ...s,
    created_at: now,
    updated_at: now,
  })));
  console.log(`   ✅ ${skills.length} skills seeded.`);

  // ── 4. Projects ─────────────────────────────────────────────────
  console.log('📂 Creating projects...');
    const projects = [
    {
      title: 'AdFlow Pro – SaaS Web Application',
      description: 'Architected and developed a full-stack SaaS platform for advertisement workflow management. Implemented secure and scalable REST APIs using Node.js and Express.js. Designed real-time interactive dashboards using React. Structured MongoDB database for efficient data storage and retrieval. Deployed production-ready application on Vercel.',
      techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Vercel'],
      liveLink: '',
      githubLink: '',
      category: 'Full Stack',
      featured: true,
      order: 1,
      images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600'],
    },
    {
      title: 'Full-Stack Portfolio / Resume Platform',
      description: 'Developed a modern, responsive portfolio platform with reusable component architecture. Integrated smooth navigation, animations, and optimized UI/UX design. Ensured cross-device compatibility and performance optimization.',
      techStack: ['React', 'CSS', 'JavaScript'],
      liveLink: '',
      githubLink: '',
      category: 'Frontend',
      featured: true,
      order: 2,
      images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600'],
    },
    {
      title: 'GitHub UI Clone',
      description: 'Engineered a pixel-perfect GitHub interface clone using React. Applied component-based architecture and responsive design principles. Focused on UI accuracy, performance, and maintainable code structure.',
      techStack: ['React', 'CSS'],
      liveLink: '',
      githubLink: '',
      category: 'Frontend',
      featured: false,
      order: 3,
      images: ['https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600'],
    },
  ];
  saveTable('projects', projects.map(p => ({
    id: generateUUID(),
    ...p,
    created_at: now,
    updated_at: now,
  })));
  console.log(`   ✅ ${projects.length} projects seeded.`);

  // ── 5. Experiences ──────────────────────────────────────────────
  console.log('💼 Creating experiences...');
    const experiences = [
    {
      company: 'Full Stack Developer (Student Level)',
      role: 'Software Engineer',
      location: 'Multan, Pakistan',
      description: [
        'Engineered full-stack web applications using React, Node.js, and Express.js with modular and scalable architecture.',
        'Designed and implemented RESTful APIs for efficient client-server communication.',
        'Developed dynamic dashboards and interactive UI components using modern frontend practices.',
        'Managed databases using MongoDB, ensuring optimized queries and structured data handling.',
        'Deployed and maintained applications on Vercel and cloud platforms for production access.',
        'Utilized Git-based workflows for version control, collaboration, and code management.',
        'Focused on performance optimization, debugging, and improving application scalability.'
      ],
      startDate: '2023',
      endDate: 'Present',
      current: true,
    }
  ];
  saveTable('experiences', experiences.map(e => ({
    id: generateUUID(),
    ...e,
    created_at: now,
    updated_at: now,
  })));
  console.log(`   ✅ ${experiences.length} experiences seeded.`);

  // ── 6. Educations ───────────────────────────────────────────────
  console.log('🎓 Creating educations...');
    const educations = [
    {
      institution: 'COMSATS University Islamabad, Pakistan',
      degree: 'Bachelors of Computer Science (BSCS)',
      fieldOfStudy: 'Computer Science',
      startDate: '2023',
      endDate: 'Present',
      description: 'Pursuing Bachelors in Computer Science.',
    },
    {
      institution: 'Post Graduate College, Pakistan',
      degree: 'Intermediate of Computer Science (ICS)',
      fieldOfStudy: 'Computer Science',
      startDate: '2021',
      endDate: '2023',
      description: 'Completed ICS with a focus on core computer science subjects.',
    }
  ];
  saveTable('educations', educations.map(e => ({
    id: generateUUID(),
    ...e,
    created_at: now,
    updated_at: now,
  })));
  console.log(`   ✅ ${educations.length} education entries seeded.`);

  // ── 7. Services ─────────────────────────────────────────────────
  console.log('🛎️  Creating services...');
  const services = [
    {
      title: 'Full Stack Web Development',
      description: 'End-to-end development of dynamic, database-driven web applications. I design responsive frontend UI layouts and construct secure RESTful server systems.',
      icon: 'Code',
      price: 'Starting from $800',
      order: 1,
    },
    {
      title: '3D Web Experiences',
      description: 'Interactive web layouts rendering real-time animated 3D assets, particles, and custom environments using React Three Fiber to make your business stand out.',
      icon: 'Box',
      price: 'Starting from $1200',
      order: 2,
    },
    {
      title: 'API Development & Integration',
      description: 'Building fast, secure, and documented REST APIs. Linking frontend interfaces with payment gateways, email nodes, analytics trackers, and other third-party APIs.',
      icon: 'Server',
      price: 'Starting from $400',
      order: 3,
    },
  ];
  saveTable('services', services.map(s => ({
    id: generateUUID(),
    ...s,
    created_at: now,
    updated_at: now,
  })));
  console.log(`   ✅ ${services.length} services seeded.`);

  // ── 8. Testimonials ─────────────────────────────────────────────
  console.log('💬 Creating testimonials...');
  const testimonials = [
    {
      name: 'Sarah Connor',
      role: 'Product Manager',
      company: 'Skynet Tech',
      message: 'Awais built our entire dashboard backend and three-dimensional landing page. His engineering skills are top-notch, and he delivered the codebase ahead of schedule.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
      rating: 5,
      approved: true,
    },
    {
      name: 'John Doe',
      role: 'CTO',
      company: 'Nova Digital',
      message: 'Working with Awais was a fantastic experience. His proficiency in the MERN stack and ability to create beautiful 3D animations made our product debut a massive success.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
      rating: 5,
      approved: true,
    },
  ];
  saveTable('testimonials', testimonials.map(t => ({
    id: generateUUID(),
    ...t,
    created_at: now,
    updated_at: now,
  })));
  console.log(`   ✅ ${testimonials.length} testimonials seeded.`);

  // ── 9. Blog Posts ───────────────────────────────────────────────
  console.log('✍️  Creating blog posts...');
  const blogPosts = [
    {
      title: 'Getting Started with React Three Fiber (3D on the Web)',
      slug: 'getting-started-react-three-fiber',
      content: '<p>Three.js is an amazing library that enables 3D graphics on the web, but using it inside React can sometimes feel verbose. That is where <strong>React Three Fiber (R3F)</strong> shines. In this guide, we will cover how to initialize an R3F Canvas, create simple geometries, add lighting, and implement basic mouse controls using <code>@react-three/drei</code>.</p><h3>Why R3F?</h3><p>React Three Fiber compiles standard React components into Three.js nodes. This allows developers to use state hooks, conditional rendering, and context directly inside 3D graphics.</p>',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600',
      tags: ['React', 'Three.js', '3D Graphics', 'Web Development'],
      status: 'published',
    },
    {
      title: 'Optimizing MERN Stack Application Performance',
      slug: 'optimizing-mern-performance',
      content: '<p>Performance is key to retaining users on your website. In MERN stack development, optimization spans databases, API design, bundle sizes, and image delivery. In this post, we discuss practical tips such as database indexing in Mongoose, server-side caching, image compression, and dynamic route loading in Vite/React.</p>',
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600',
      tags: ['MERN', 'Performance', 'Node.js', 'MongoDB'],
      status: 'published',
    },
  ];
  saveTable('blog_posts', blogPosts.map(b => ({
    id: generateUUID(),
    ...b,
    created_at: now,
    updated_at: now,
  })));
  console.log(`   ✅ ${blogPosts.length} blog posts seeded.`);

  // ── 10. Messages (empty) ────────────────────────────────────────
  saveTable('messages', []);

  console.log('\n🎉 Local database seeded successfully!');
  console.log('   Data files are in: server/data/');
  console.log('   Admin login: admin@portfolio.com / admin12345\n');
};

seedLocalData().catch(err => {
  console.error('❌ Local seed error:', err);
  process.exit(1);
});
