# BizFlow – Small Business Workflow Management Platform

> **"One Workspace. Every Task. Zero Confusion."**

BizFlow is a modern, software-only SaaS MVP designed for small businesses to centralize daily task creation, employee task assignments, deadline tracking, automatic overdue task detection, and team productivity analytics.

---

## 📋 Problem Statement

Small businesses often manage their daily operations through a chaotic mix of:
* **WhatsApp messages** and informal group chats
* **Unstructured spreadsheets** that quickly become outdated
* **Phone calls and voice notes** leading to miscommunication
* **Physical notebooks and verbal commands** resulting in lost accountability

This fragmentation causes dropped tasks, missed customer deadlines, zero operational visibility for owners/managers, and unmeasurable employee performance.

---

## 💡 Solution

**BizFlow** solves operational chaos by providing a single, unified digital workspace where business owners can:
1. Instantly create and assign tasks with priority levels and firm deadlines.
2. Track task progress across visual **Table** and **Kanban** board views.
3. Automatically identify **overdue tasks** without relying on manual updates.
4. Measure employee workload and completion rates through dynamic **Recharts analytics**.
5. Offer a 100% demo-ready hackathon experience with pre-populated realistic sample data and zero backend setup requirements.

---

## ✨ Key Features

* **Instant Demo Mode**: Evaluators can click "Try Demo" to immediately access a fully populated dashboard with 8 employees and 18 realistic small business tasks.
* **Automatic Overdue Detection**: Tasks whose deadline is past the current date and status is not `Completed` are automatically tagged with `OVERDUE ⚠️` badges and alerted on the dashboard.
* **Dynamic KPI Dashboard**: Real-time KPI metrics for Total Tasks, Pending, In Progress, Completed (% rate), and Overdue items with smart business insights.
* **Dual Task Views**: Switch seamlessly between a detailed **Data Table** and a responsive **Kanban Board**.
* **Comprehensive Search & Filters**: Filter tasks by Status, Priority, Assigned Employee, or Overdue status; sort by deadline or priority.
* **Employee Directory & Profiles**: Track individual completion rates, assigned workloads, roles, and contact details.
* **Rich Productivity Analytics**: Interactive Recharts donut charts for task statuses, priority distributions, and employee completion bar charts.
* **Firebase & Offline Local Fallback**: Uses Firebase Firestore when configured via `.env`, or seamlessly falls back to LocalStorage persistence.

---

## 🛠️ Tech Stack

* **Frontend Framework**: React 19 + Vite
* **Styling**: Tailwind CSS v4 + Lucide React Icons
* **Routing**: React Router v7
* **Database & Auth**: Firebase Firestore & Firebase Auth (with LocalStorage fallback)
* **Data Visualization**: Recharts
* **Containerization**: Docker (Multi-stage build)
* **Cloud Infrastructure**: Google Cloud Run

---

## 🖼️ Screenshots

*(Add your application screenshots here)*

| Login & Demo Landing | Dashboard Overview |
| :---: | :---: |
| ![Login](/screenshots/login.png) | ![Dashboard](/screenshots/dashboard.png) |

| Task Board (Kanban & Table) | Productivity Analytics |
| :---: | :---: |
| ![Tasks](/screenshots/tasks.png) | ![Analytics](/screenshots/analytics.png) |

---

## 🚀 Local Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/TaskForge.git
cd TaskForge
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env` if connecting to Firebase:
```bash
cp .env.example .env
```
*(If left unconfigured, BizFlow automatically runs in local demo mode with sample data).*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 📦 Production Build

To build the static production bundle:
```bash
npm run build
```
The optimized production output will be generated in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 🐳 Docker Containerization

BizFlow includes a multi-stage Docker setup equipped with dynamic `PORT` environment variable handling required by Cloud Run.

### 1. Build the Docker Image
```bash
docker build -t bizflow-app .
```

### 2. Run the Container Locally
```bash
docker run -p 8080:8080 -e PORT=8080 bizflow-app
```
Access the application at `http://localhost:8080`.

---

## ☁️ Google Cloud Run Deployment

Deploy BizFlow to Google Cloud Run in minutes:

### 1. Set Google Cloud Project
```bash
gcloud config set project YOUR_PROJECT_ID
```

### 2. Build and Submit Container to Google Container Registry / Artifact Registry
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/bizflow-app
```

### 3. Deploy to Cloud Run
```bash
gcloud run deploy bizflow-app \
  --image gcr.io/YOUR_PROJECT_ID/bizflow-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🔮 Future Scope & Roadmap

* 💬 **WhatsApp Business API Integration**: Automatic task reminders and dispatch alerts directly over WhatsApp.
* 📧 **Email Digest Notifications**: Daily overdue summary emails sent to business managers.
* 🤖 **AI Task Prioritization**: Automated priority and workload balancing using Gemini AI.
* 🔄 **Recurring Tasks**: Weekly & monthly recurring maintenance / invoice generation schedules.
* ⏱️ **Employee Attendance Integration**: Clock-in / clock-out tracking connected with task assignments.
* 📱 **Native Mobile Application**: Dedicated iOS/Android app built with React Native.
* 🔒 **Role-Based Access Control (RBAC)**: Custom permissions for Admins, Managers, and Staff members.

---

## 📄 License

MIT License © 2026 BizFlow Team
