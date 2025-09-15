# 🏫 School Management System

[![Built with NestJS](https://img.shields.io/badge/Backend-NestJS-blue?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Built with Next.js](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16.x-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Swagger](https://img.shields.io/badge/API-Swagger-blue?logo=swagger&logoColor=white)](https://swagger.io/)




## 📄 API Documentation (Swagger)

The backend uses **Swagger** for API documentation, which is **only available in development**.

- **Local Development:**  
  Run the backend server: http://localhost:5000/api/docs

  ```bash
  npm run start:dev
Swagger is disabled in production because Vercel serverless functions cannot serve static assets required by Swagger UI.


# 🏫 School Management System  

A **full-stack web application** for managing school operations, built with **NestJS (Backend)** and **Next.js (Frontend)**.  
It helps schools manage **students, teachers, classes, subjects, exams, and attendance** with role-based dashboards.  

🌐 **Live Demo** → [school-management-frontend-omega.vercel.app/](https://school-management-frontend-omega.vercel.app/)  

---

## 📂 Project Structure  

- **Frontend (Next.js)** → [/School_Management_Nest_js_Nextjs_Frontend](https://github.com/Monirul-Jim/School_Management_Nest_js_Nextjs_Frontend)  
- **Backend (NestJS)** → [/School_Management_Nest_js_Backend](https://github.com/Monirul-Jim/School_Management_Nest_js_Backend)  

---

## ✨ Features  

- 🔐 **Authentication & Authorization** (JWT)  
- 👨‍💼 **Role-based Access** → Admin, Teacher, Student  
- 🏫 Manage **Students, Teachers, Classes, Subjects**  
- 📝 Attendance tracking & exam results  
- 📊 School-wide **Reports & Analytics Dashboard**  
- 🎨 **Modern Responsive UI** (Next.js + TailwindCSS)  
- 🗄️ **PostgreSQL Database** with TypeORM  
- 📑 **Swagger API Documentation**  

---

## 👥 User Roles & Permissions  

### 👨‍💼 Admin  
Admins have **full system control**:  
- Manage Teachers (add, edit, delete)  
- Manage Students (enroll, update, remove)  
- Create and assign Classes & Subjects  
- Handle Exams & Attendance  
- View Reports & Statistics  
- Assign User Roles  

---

### 👩‍🏫 Teacher  
Teachers can:  
- Manage students in assigned classes  
- Take Attendance  
- Add / Update Exam Results  
- View assigned Classes & Subjects  
- Communicate with Students  

---

### 👩‍🎓 Student  
Students can:  
- View Profile & Class details  
- See Attendance records  
- Check Exam Results & Progress Reports  
- Access Subjects  
- Interact with Teachers  

---

## 🛠️ Tech Stack  

**Frontend**  
- ⚛️ Next.js (React Framework)  
- 🎨 TailwindCSS  
- 🔗 Redux  
- 📝 React Hook Form  

**Backend**  
- 🚀 NestJS  
- 🗄️ Mongoose  
- 🐘 MongoDB  
- 🔐 JWT Authentication  
- 📑 Swagger  

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone Repositories  

```bash
# Frontend
git clone https://github.com/Monirul-Jim/School_Management_Nest_js_Nextjs_Frontend.git

# Backend
git clone https://github.com/Monirul-Jim/School_Management_Nest_js_Backend.git

2️⃣ Backend Setup
cd School_Management_Nest_js_Backend

# Install dependencies
npm install

# Copy env file
cp .env.example .env


# Start backend server
npm run start:dev

📌 Runs at → http://localhost:5000

3️⃣ Frontend Setup

cd School_Management_Nest_js_Nextjs_Frontend

# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Start frontend server
npm run dev


🏗️ System Architecture

Frontend (Next.js + TailwindCSS)
          |
          | REST API (Axios)
          v
Backend (NestJS + Mongoose + class-validator + JWT)
          |
          v
        MongoDB



📜 License

This project is licensed under the MIT License.