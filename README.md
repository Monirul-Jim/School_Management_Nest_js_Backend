# 🏫 School Management System  

A **full-stack web application** for managing school operations, built with **NestJS (Backend)** and **Next.js (Frontend)**.  
It helps schools manage **students, teachers, classes, subjects, exams, and attendance** with role-based dashboards.  

🌐 **Live Demo** → [school-management.vercel.app](https://school-management.vercel.app)  

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



---

✨ Now the README is **corrected** for your **MongoDB + Mongoose + class-validator + JWT** backend.  

Would you like me to also **add shields.io badges** at the top (e.g., "Built with Next.js", "NestJS", "MongoDB", "MIT License") so your GitHub page looks more **professional and eye-catching**?


![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/Framework-NestJS-E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)