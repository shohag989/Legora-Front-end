# 🎨 Legora - Premium Design Marketplace Frontend

A premium and responsive creative design marketplace where companies and product teams can search, hire, and collaborate with verified independent UI/UX designers with ease.

---

## 🌐 Live Site

🔗 **Live URL:** [Legora Live Site](https://legoraaa.vercel.app/)

---

## 📂 GitHub Repository

🔗 **Repository:** [Legora Frontend Repo](https://github.com/shohag989/Legora-Front-end.git)

---

## 📸 Preview

![Project Preview](./public/Project%20Cover.png)

---

## 🎯 Project Purpose

**Legora** is a comprehensive creative design marketplace designed to simplify the process of hiring UI/UX and product design talent. Clients can browse a verified network of designers, filter by specialized tools and pricing, securely initiate milestone orders, and manage project terms. Designers receive a dedicated dashboard to manage their profiles, rates, active gig listings, and action inbound order requests, all wrapped in a premium, glassmorphic, and highly-polished user interface.

---

## 🚀 Key Features

- **Responsive Design:** Optimized for mobile, tablet, and desktop devices.
- **Designer Directory:** Browse, search, and filter designers by specialization, tools, rate, and location.
- **Role-Based Experience Dashboards:** Dedicated experiences for Visitors (Clients), Designers (Sellers), and Administrators.
- **Authentication System:** Secure login and registration using JWT tokens and Google Social Auth.
- **Full-Stack Ordering System:** Seamless project lifecycle ordering with status triggers (Pending, Placed/Accepted, Declined).
- **Contact Inquiry Management:** Frontend inbox connected to the admin console.
- **Modern UI/UX Design:** Built with Next.js 15, Tailwind CSS 3, Framer Motion, and Glassmorphism aesthetics.
- **Robust Form Validation:** Complete form schema validation using React Hook Form and Zod resolver.
- **Real-time Feedback Notifications:** Instant transaction feedback using react-hot-toast alerts.
- **Responsive Navigation Drawer:** Interactive mobile drawer with profile dropdown menus.

---

## 🛠️ Tech Stack

<p align="left">
  <img src="https://skillicons.dev/icons?i=nextjs" alt="Next.js" />
  <img src="https://skillicons.dev/icons?i=react" alt="React" />
  <img src="https://skillicons.dev/icons?i=tailwind" alt="Tailwind CSS" />
  <img src="https://skillicons.dev/icons?i=typescript" alt="TypeScript" />
  <img src="https://skillicons.dev/icons?i=vercel" alt="Vercel" />
</p>

---

## 📦 NPM Packages Used

| Package | Purpose |
|--------|---------|
| `next` | React framework for production-grade web applications |
| `axios` | Promise-based HTTP client for API endpoints calls |
| `react-icons` | Beautifully simple pixel-perfect vector icons |
| `framer-motion` | Smooth transition animation and motion library for React components |
| `react-hot-toast` | Custom notification toast alerts for success, error, and info triggers |
| `react-hook-form` | Performant, flexible, and extensible forms with clean validations |
| `zod` | TypeScript-first schema declaration and validation library |
| `@hookform/resolvers` | React Hook Form resolver wrappers for Zod |
| `jwt-decode` | Browser decoder for JWT token payloads |
| `next-themes` | Dynamic dark/light theme management |
| `recharts` | Composable charting library built on React components |

---

## 📄 Main Pages

| Page | Description |
|------|-------------|
| Home | Landing page with hero, practice categories, testimonials, workflow steps, FAQ, and email inquiries |
| Browse Designers | Explore the directory with filter drawers, keywords search, and listing cards |
| Service Details | Full view of a gig with description, rate card, location, and checkout order buttons |
| Login / Register | Secure user session management |
| Client Dashboard | Track order progress, deliverables, and invoices |
| Designer Dashboard | Manage profile, active gigs, and inbound requests (Accept/Decline triggers) |
| Admin Dashboard | Platform registry, search users, update roles, delete accounts, and resolve contact inquiries |

---

## 🔐 Authentication Features

- **Social Sign-In:** Direct integration with Google Authentication.
- **Credential Auth:** Email and password registration, authentication, and session handling.
- **Protected Routes:** Automatic role checks using `<ProtectedRoute>` (e.g. restricting admin panels or checkout pages to authorized users).
- **State Hydration:** Persistent sessions verified against the backend server on initialization.

---

## 🔒 Environment Variables

To run this project locally, create a `.env.local` file in the root directory and add your configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

---

## ⚙️ Local Installation

Follow these steps to run the project locally:

```bash
# Clone the repository
git clone https://github.com/shohag989/Legora-Front-end.git

# Navigate to the project directory
cd Legora-Front-end

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🚀 Deployment

The client-side is deployed using **Vercel** connected directly to the repository branch, supporting automatic environment variables resolution.

---

## 👨💻 Author

**Shohag**

* GitHub: [@shohag989](https://github.com/shohag989)
* LinkedIn: [shohag](https://www.linkedin.com/in/dev-shohag/)
* Email: [contact.devshohag@gmail.com](mailto:contact.devshohag@gmail.com)

---

## 📜 License

This project is created for educational purposes as part of a programming assignment.
