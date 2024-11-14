# 🚗 Car Management Application

A full-stack application for managing car listings. Users can register, log in, and create, update, view, and delete car items. The app features search functionality with filters and is built using the **MERN stack**.

## 📋 Table of Contents
- [Introduction](#introduction)
- [Demo](#demo)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Backend API Documentation](#backend-api-documentation)
- [Frontend Documentation](#frontend-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 Introduction
The Car Management Application allows users to manage car listings with features like creating, updating, viewing, and deleting car records. The app is secured with JWT-based authentication and provides a user-friendly interface built using React.

## 🎥 Demo
Check out the live demo of the application:
- [Frontend (Vercel)](https://your-vercel-url.com)
- [Backend (Render)](https://your-render-url.com)

---

## 🌟 Features
- User Authentication (Register, Login)
- Create, Read, Update, Delete (CRUD) car items
- Search and filter car listings
- JWT-based secure authentication
- Password hashing with bcryptjs
- Responsive UI with MaterialUI
- Error handling and validation

---

## 🏗️ System Architecture
The application follows a client-server architecture:
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (using Mongoose)
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 💻 Technologies Used
- **Frontend**: React.js, Axios, React Router, MaterialUI
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Tools**: Postman, Swagger (API documentation), Git for version control
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 🚀 Installation

### Prerequisites
- Node.js
- MongoDB (Local or Atlas)
- Git

### Clone the Repository
```bash
git clone https://github.com/kkr-97/spyne.git
cd spyne
```


#Backend Setup
###Navigate to the backend folder:
```bash
cd backend
```


###Install dependencies:
```bash
npm install
```


###Start the server:
```bash
npm run start
```



#Frontend Setup

###Navigate to the frontend folder:
```bash
cd clent
```


###Install dependencies:
```bash
npm install
```


###Start the development server:
```bash
npm run dev
```



#🛠️ Environment Variables

##Create a .env file in both backend and frontend folders and configure the following:

###Backend .env file:
```
PORT=3001
MONGODB_URI=your-mongodb-connection-string
SECRET_KEY=your-secret-key
```

