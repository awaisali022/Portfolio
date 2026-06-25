# MERN Stack 3D Animated Portfolio Website

This is a production-ready, highly animated, and fully responsive MERN stack portfolio website designed for **Awais Ali** (Full Stack Developer). 

The platform features stunning 3D particle animations using **React Three Fiber (Three.js)**, scroll reveals powered by **Framer Motion**, a dark/light mode toggle with premium glassmorphism visuals, and a complete administrative control panel (`/admin`) to manage all portfolios and inbox inquiries dynamically.

## Screenshots

![Portfolio Preview](https://raw.githubusercontent.com/awaisali022/Projects-picsk-/main/personal%20picks_01.png)

---

## Repository Structure

```text
/
├── server/             # Node.js + Express.js + Mongoose backend
│   ├── config/         # Database connections
│   ├── middleware/     # Auth checks, file-handling limits
│   ├── models/         # Mongoose Schemas (Users, Projects, Skills, etc.)
│   ├── routes/         # REST API routes
│   ├── scripts/        # Seeding scripts
│   ├── uploads/        # Local static image storage
│   └── server.js       # Main server entrypoint
│
└── client/             # Vite + React + Tailwind CSS frontend
    ├── public/         # Icons and static assets
    └── src/
        ├── components/
        │   ├── 3D/     # R3F WebGL backgrounds
        │   └── UX/     # Navbar, Loader, Custom Cursor
        ├── context/    # Theme and Auth State Providers
        ├── pages/      # Home, BlogPost, Login, and Dashboard Panels
        └── main.jsx    # React bundle entrypoint
```

---

## Technology Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS, React Three Fiber, Drei, Framer Motion, GSAP, Recharts, React-Quill, Axios.
- **Backend**: Node.js, Express.js, Mongoose, JWT authentication, bcryptjs, Multer file parsing, Nodemailer notifications, Express-rate-limit, Helmet header protections.
- **Database**: MongoDB.

---

## Environment Variables

### Backend Server (`server/.env`)
Create a `.env` file under the `/server` folder matching these keys:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=portfolio-super-secret-key-12345
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Email Configurations for Contact Form notifications
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password
EMAIL_FROM="Awais Ali Portfolio" <portfolio@example.com>
ADMIN_EMAIL=awais.ali@example.com
```

### Frontend Client (`client/.env`)
Create a `.env` file under the `/client` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation & Setup

### Prerequisites
- Node.js installed (v18+ recommended)
- MongoDB running locally (default port `27017`) or a MongoDB Atlas cloud URI.

### 1. Set Up Backend
```bash
cd server
npm install
npm run seed     # Populate database with admin account & default records
npm run dev      # Start Nodemon developer listener on port 5000
```

### 2. Set Up Frontend
```bash
cd client
npm install
npm run dev      # Start Vite client on port 5173
```

Open `http://localhost:5173` in your browser.

---

## Default Administrative Credentials

Run the database seed script (`npm run seed` in the `/server` folder) to create this default administrator account:
- **Email**: `admin@portfolio.com`
- **Password**: `admin12345`

Log in via `http://localhost:5173/admin/login` to access the admin panel.

---

## API Endpoints List

### Public Coordinates
- `GET /api/settings` — Get dynamic site-wide variables and copywriting.
- `GET /api/projects` — Get list of portfolio showcase cards (ordered).
- `GET /api/skills` — Get categorized tech capabilities.
- `GET /api/experience` — Retrieve career experience timelines.
- `GET /api/education` — Retrieve academic degree timelines.
- `GET /api/services` — List dynamic services offered.
- `GET /api/testimonials` — Fetch approved testimonials marquee lists.
- `GET /api/blog` — List published blog posts.
- `GET /api/blog/:slug` — Get a single article by URL slug.
- `POST /api/contact` — Submit a message (rate-limited, saves to DB and logs email notifications).

### Protected Coordinates (JWT Bearer Token Required)
- `PUT /api/settings` — Save site layouts, PDF resume path, titles.
- `POST/PUT/DELETE /api/projects` — Create, update, or remove projects.
- `POST/PUT/DELETE /api/skills` — Create, update, or remove skills.
- `POST/PUT/DELETE /api/experience` — CRUD work experience items.
- `POST/PUT/DELETE /api/education` — CRUD academic timeline slots.
- `POST/PUT/DELETE /api/services` — CRUD service lists.
- `PUT/DELETE /api/testimonials` — Approve, decline, or delete client testimonials.
- `POST/PUT/DELETE /api/blog` — CRUD blog posts rich contents.
- `GET /api/contact` — View message inbox list.
- `POST /api/contact/:id/reply` — Send reply emails to inquiries via SMTP server.
- `DELETE /api/contact/:id` — Remove message inbox items.
- `POST /api/media/upload` — Single file uploader for images and PDF resumes.
- `PUT /api/auth/profile` — Adjust admin username, email, or hash a new password.
