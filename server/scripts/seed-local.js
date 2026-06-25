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
    heroTitle: 'Awais Ali',
    heroSubtitle: 'Full Stack Developer',
    heroRoles: ['Full Stack Developer', 'React & Node Architect', '3D UI Designer', 'MERN Specialist'],
    aboutBio: 'I am a highly motivated Full Stack Developer with 4+ years of professional experience in crafting responsive, visually engaging, and high-performance web applications. Specializing in React, Node.js, and Three.js, I bridge the gap between creative visual designs and powerful backend logic.',
    aboutImage: 'https://raw.githubusercontent.com/awaisali022/Projects-picsk-/main/personal%20picks_01.png',
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
    seoKeywords: ['MERN Stack', 'React', 'Three.js', 'Node.js', 'Express', 'Portfolio', 'Web Developer'],
    created_at: now,
    updated_at: now,
  }]);
  console.log('   ✅ Settings seeded.');

  // ── 3. Skills ───────────────────────────────────────────────────
  console.log('🛠️  Creating skills...');
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
    { name: 'Figma', category: 'Design', proficiency: 75, icon: 'FigmaIcon' },
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
      title: '3D Interactive Portfolio',
      description: 'A stunning MERN portfolio displaying 3D particle animations, hover-tilt systems, dynamic timelines, and a robust admin dashboard built using R3F and Framer Motion.',
      techStack: ['React', 'Three.js', 'GSAP', 'Node.js', 'MongoDB', 'Tailwind'],
      liveLink: 'https://awais-ali-portfolio.example.com',
      githubLink: 'https://github.com/awais-ali/3d-portfolio',
      category: 'Frontend & 3D',
      featured: true,
      order: 1,
      images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600'],
    },
    {
      title: 'E-Commerce Platform with Dashboard',
      description: 'A fully-featured e-commerce platform incorporating secure Stripe payments, cart state management, product filtering, and a separate vendor overview panel.',
      techStack: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
      liveLink: 'https://awais-store.example.com',
      githubLink: 'https://github.com/awais-ali/mern-store',
      category: 'Full Stack',
      featured: true,
      order: 2,
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600'],
    },
    {
      title: 'AI Collaborative Canvas',
      description: 'Real-time collaborative drawing and design application powered by Socket.io, integrating OpenAI APIs to suggest graphic themes and autogenerate vectors.',
      techStack: ['Vite', 'Socket.io', 'Node.js', 'OpenAI API', 'Tailwind CSS'],
      liveLink: 'https://ai-canvas.example.com',
      githubLink: 'https://github.com/awais-ali/ai-canvas',
      category: 'Web Sockets',
      featured: false,
      order: 3,
      images: ['https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600'],
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
      company: 'Vertex Tech Solutions',
      role: 'Senior Full Stack Developer',
      location: 'Remote / Islamabad',
      description: [
        'Led a squad of 4 developers to re-engineer an enterprise ERP platform, improving page speeds by 40%.',
        'Integrated complex R3F interactive asset visualizers into client marketing landing experiences.',
        'Built microservices handling PDF generation and file processing, boosting throughput by 30%.',
      ],
      startDate: 'Jan 2024',
      endDate: 'Present',
      current: true,
    },
    {
      company: 'PixelForge Studios',
      role: 'Full Stack Developer',
      location: 'Lahore, Pakistan',
      description: [
        'Developed responsive single-page applications using React, Context API, and Tailwind CSS.',
        'Designed Mongoose database architectures and integrated third-party payment gateways (Stripe, Paypal).',
        'Optimized REST APIs reducing server processing times from 400ms to under 150ms.',
      ],
      startDate: 'Aug 2022',
      endDate: 'Dec 2023',
      current: false,
    },
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
      institution: 'National University of Sciences and Technology (NUST)',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: 'Sep 2018',
      endDate: 'Jul 2022',
      description: 'Graduated with Honors. Specialized in Software Engineering, Web Design, and Database Management Systems.',
    },
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
