import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, 'scripts', 'seed.js');

const settingsBlock = `      heroTitle: 'Muhammad Awais Ali',
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
      emailAddress: 'fa23-bcs-022@cuivehari.edu.pk',`;

const projectsBlock = `    const projects = [
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
    ];`;

const experiencesBlock = `    const experiences = [
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
    ];`;

const educationsBlock = `    const educations = [
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
    ];`;

const skillsBlock = `    const skills = [
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
    ];`;

function updateSeed() {
  let content = fs.readFileSync(seedPath, 'utf8');

  content = content.replace(/heroTitle: 'Awais Ali',[\s\S]*?emailAddress: '.*?',/, settingsBlock);
  content = content.replace(/const projects = \[[\s\S]*?\];/m, projectsBlock);
  content = content.replace(/const experiences = \[[\s\S]*?\];/m, experiencesBlock);
  content = content.replace(/const educations = \[[\s\S]*?\];/m, educationsBlock);
  content = content.replace(/const skills = \[[\s\S]*?\];/m, skillsBlock);

  fs.writeFileSync(seedPath, content, 'utf8');
}

updateSeed();
console.log('Done replacing seed.js');
