# 🍽️ TheDailyFood — Full-Stack Food Blog

A modern, full-featured food blogging platform inspired by TheDailyFoodOfficial. Built with **React**, **Spring Boot**, and **MySQL**.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Blog Posts** | Title, image, rich HTML content, excerpt, categories |
| **Categories** | Street Food 🌮 · Recipes 👨‍🍳 · Healthy 🥗 · Desserts 🍰 |
| **Like System** | Toggle likes per post (authenticated users only) |
| **Comment System** | Post, view, and delete comments |
| **Admin Dashboard** | Stats, post management, category CRUD, user management |
| **Auth** | JWT-based register / login with role-based access (USER / ADMIN) |
| **Search & Filter** | Full-text search + category filter on blog page |
| **Pagination** | Server-side pagination on blog & admin |
| **Responsive** | Mobile-first with hamburger nav |

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite, Vanilla CSS, Lucide Icons, React Hot Toast, date-fns
- **Backend**: Spring Boot 3.2, Spring Security, JPA/Hibernate, JWT (jjwt)
- **Database**: MySQL 8
- **Build**: Maven (backend), npm (frontend)

---

## ⚡ Prerequisites

Make sure the following are installed:

| Tool | Version | Download |
|---|---|---|
| Java | 17+ | https://adoptium.net |
| Maven | 3.8+ | https://maven.apache.org |
| Node.js | 18+ | https://nodejs.org |
| MySQL | 8.0+ | https://dev.mysql.com/downloads |

---

## 🗄️ Database Setup

MySQL database is **auto-created** on first run via the connection string. Just ensure MySQL is running:

```bash
# Start MySQL service (Windows)
net start MySQL80

# Or via MySQL Workbench / any GUI client
```

Default credentials used in `application.properties`:
- Host: `localhost:3306`
- Database: `foodblog_db` (auto-created)
- Username: `root`
- Password: `root`

> **To change credentials**, edit: `backend/src/main/resources/application.properties`

---

## 🚀 Running the Project

### 1. Start the Backend

```powershell
cd backend
mvn spring-boot:run
```

The backend starts at **http://localhost:8080**

On first run, it auto-seeds:
- 4 categories (Street Food, Recipes, Healthy, Desserts)
- 6 sample blog posts
- 2 users (admin + regular)

**Default credentials:**
```
Admin:  admin@foodblog.com  /  admin123
User:   chef@foodblog.com   /  password123
```

---

### 2. Start the Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend starts at **http://localhost:5173**

> The Vite dev server proxies all `/api` calls to `http://localhost:8080` automatically.

---

## 📁 Project Structure

```
TDF/
├── backend/
│   └── src/main/java/com/foodblog/
│       ├── config/         # SecurityConfig, DataSeeder
│       ├── controller/     # REST controllers
│       ├── dto/            # Request/Response DTOs
│       ├── model/          # JPA entities
│       ├── repository/     # Spring Data repositories
│       ├── security/       # JWT filter + utils
│       └── service/        # Business logic
│
└── frontend/
    └── src/
        ├── components/     # Navbar, Footer, PostCard
        ├── context/        # AuthContext (JWT state)
        ├── pages/
        │   ├── admin/      # Dashboard, Posts, Categories, Users
        │   ├── HomePage.jsx
        │   ├── BlogPage.jsx
        │   ├── PostDetailPage.jsx
        │   ├── LoginPage.jsx
        │   └── RegisterPage.jsx
        ├── services/       # Axios API client
        ├── App.jsx         # Routes
        └── index.css       # Design system (all styles)
```

---

## 🔗 API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT token |
| GET | `/api/posts?page=0&size=9&category=&search=` | Get paginated posts |
| GET | `/api/posts/{slug}` | Get single post |
| GET | `/api/categories` | Get all categories |
| GET | `/api/posts/{id}/comments` | Get comments for post |

### Authenticated (Bearer token required)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/posts/{id}/like` | Toggle like on post |
| POST | `/api/posts/{postId}/comments` | Add comment |
| DELETE | `/api/comments/{id}` | Delete own comment |

### Admin only (`ADMIN` role required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Stats overview |
| GET/POST | `/api/admin/posts` | List / create posts |
| PUT/DELETE | `/api/admin/posts/{id}` | Update / delete post |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/{id}/toggle-role` | Promote / demote user |
| DELETE | `/api/admin/users/{id}` | Delete user |
| GET/POST | `/api/admin/categories` | List / create categories |
| PUT/DELETE | `/api/admin/categories/{id}` | Update / delete category |

---

## 🎨 Design System

All styles are in `frontend/src/index.css` using CSS custom properties:

```css
--brand-primary:   #e8572a   /* Orange-red */
--brand-secondary: #f4a94e   /* Amber */
--brand-accent:    #2dd4bf   /* Teal */
--bg-dark:         #0d0d0f   /* Main background */
--bg-card:         #141418   /* Card background */
--font-display:    'Playfair Display'
--font-body:       'Inter'
```

---

## 🐛 Common Issues

**Backend won't start — DB connection error**
> Check MySQL is running and credentials in `application.properties` match your MySQL setup.

**Frontend shows "Network Error"**
> Ensure backend is running on port 8080 before starting the frontend.

**"Email already in use" on register**
> The seed data already created `admin@foodblog.com` and `chef@foodblog.com`. Use a different email or log in.

**Admin panel not accessible**
> Log in with `admin@foodblog.com / admin123`. Regular users are redirected to the home page.

---

## 📸 Pages Overview

| Page | Route | Access |
|---|---|---|
| Home | `/` | Public |
| Blog | `/blog` | Public |
| Post Detail | `/blog/:slug` | Public (like/comment requires login) |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Admin Dashboard | `/admin` | Admin only |
| Admin Posts | `/admin/posts` | Admin only |
| Admin Categories | `/admin/categories` | Admin only |
| Admin Users | `/admin/users` | Admin only |

---

## 🔒 Security Notes

- Passwords are hashed with **BCrypt**
- JWT tokens expire after **24 hours** (configurable via `app.jwt.expiration`)
- Admin routes are protected both in the backend (`@PreAuthorize`) and frontend (`ProtectedRoute`)
- CORS is configured to allow `localhost:5173` and `localhost:3000`

---

*Built with ❤️ for food lovers*
