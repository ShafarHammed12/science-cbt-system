# Interactive Basic Science E-Learning and CBT System

A web-based E-Learning and Computer-Based Testing (CBT) system designed for Junior Secondary School (JSS) students, focusing on Basic Science education.

## Features

### Student Features
- **Authentication** — Register and login as a student
- **Dashboard** — Overview of available topics, test scores, and progress
- **Topics & Lessons** — Browse topics by class (JSS1–JSS3), read lessons, watch video content
- **CBT Engine** — Timed multiple-choice tests with automatic grading
- **Results** — View all test scores and performance history
- **Progress Tracking** — Track completed lessons and overall learning progress

### Admin Features
- **Admin Dashboard** — Overview stats: students, topics, lessons, tests taken
- **Topic Management** — Create, edit, and delete topics per class
- **Lesson Management** — Create lessons with content and video uploads
- **Question Management** — Add multiple-choice questions per topic with difficulty levels
- **Results View** — View all student test results
- **Reports** — Generate class-level performance reports

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Auth:** JWT (JSON Web Tokens)
- **File Upload:** Multer (video uploads)

## Project Structure

```
science-cbt-system/
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── topicController.js
│   │   ├── lessonController.js
│   │   ├── questionController.js
│   │   ├── resultController.js
│   │   ├── progressController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Topic.js
│   │   ├── Lesson.js
│   │   ├── Question.js
│   │   ├── Result.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── topicRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── resultRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── reportRoutes.js
│   │   └── uploadRoutes.js
│   ├── uploads/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── topics.html
│   ├── lessons.html
│   ├── lesson-view.html
│   ├── cbt.html
│   ├── my-results.html
│   ├── my-progress.html
│   ├── admin-dashboard.html
│   ├── admin-topics.html
│   ├── admin-lessons.html
│   ├── admin-questions.html
│   ├── admin-results.html
│   ├── admin-reports.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── login.js
│       ├── register.js
│       └── dashboard.js
└── README.md
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShafarHammed12/science-cbt-system.git
   cd science-cbt-system
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/science_cbt
   JWT_SECRET=your_secret_key_here
   ```

4. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

5. **Open the app:**
   Visit `http://localhost:5000` in your browser.

### Creating an Admin Account

To create an admin user, you can use the API directly:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

Or use a tool like Postman to send a POST request to `/api/auth/register` with the above body.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get user profile |

### Topics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/topics` | Get all topics |
| POST | `/api/topics` | Create topic (admin) |
| PUT | `/api/topics/:id` | Update topic (admin) |
| DELETE | `/api/topics/:id` | Delete topic (admin) |

### Lessons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lessons` | Get all lessons |
| POST | `/api/lessons` | Create lesson (admin) |
| PUT | `/api/lessons/:id` | Update lesson (admin) |
| DELETE | `/api/lessons/:id` | Delete lesson (admin) |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | Get all questions |
| GET | `/api/questions/cbt/:topicId` | Get CBT questions for topic |
| POST | `/api/questions` | Create question (admin) |
| PUT | `/api/questions/:id` | Update question (admin) |
| DELETE | `/api/questions/:id` | Delete question (admin) |

### Results
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/results/submit` | Submit CBT answers |
| GET | `/api/results/my` | Get my results |
| GET | `/api/results/all` | Get all results (admin) |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/progress/complete` | Mark lesson complete |
| GET | `/api/progress/my` | Get my progress |
| GET | `/api/progress/topic/:topicId` | Get topic progress |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/dashboard` | Admin dashboard stats |
| GET | `/api/reports/my` | Student self-report |
| GET | `/api/reports/student/:id` | Student report (admin) |
| GET | `/api/reports/class/:className` | Class report (admin) |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/video` | Upload video file (admin) |

## Deployment (Free Hosting)

You can deploy this app for free using **Render** (server) + **MongoDB Atlas** (database).

### Step 1: Set Up MongoDB Atlas (Free Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account
2. Create a **free cluster** (M0 Sandbox — free forever)
3. Under **Database Access**, create a database user with a username and password
4. Under **Network Access**, click "Allow Access from Anywhere" (add `0.0.0.0/0`)
5. Click **Connect** → **Connect your application** → Copy the connection string
6. It will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/science_cbt`

### Step 2: Deploy to Render (Free Web Hosting)

1. Go to [Render](https://render.com/) and sign up with your GitHub account
2. Click **New** → **Web Service**
3. Connect your GitHub repo `science-cbt-system`
4. Render will auto-detect the `render.yaml` config. If not, set manually:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
5. Add the environment variable:
   - `MONGODB_URI` = your MongoDB Atlas connection string from Step 1
6. Click **Deploy**

Your app will be live at `https://science-cbt-system.onrender.com` (or similar URL).

> **Note:** On Render's free tier, the server "sleeps" after 15 minutes of inactivity. The first request after sleeping takes ~30 seconds to wake up. This is fine for a final year project demo.

### Running Locally (Alongside the Deployed Version)

Even after deploying, you can always run the app locally:

```bash
# Clone the repo
git clone https://github.com/ShafarHammed12/science-cbt-system.git
cd science-cbt-system

# Install dependencies
cd backend
npm install

# Set up environment
cp .env.example .env
# Edit .env — use localhost MongoDB for local dev, or Atlas URI for cloud DB

# Start the server
npm start
# Visit http://localhost:5000
```

Your local version and deployed version are completely independent. You can:
- Use **local MongoDB** (`mongodb://localhost:27017/science_cbt`) for local development
- Use **MongoDB Atlas** for the deployed version
- Or point both to the same Atlas database if you want shared data

## License

This project was developed as a final year project.
