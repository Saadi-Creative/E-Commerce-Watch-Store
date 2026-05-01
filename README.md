<div align="center">
  <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop" alt="Luxury Watch E-Commerce Store Template Banner" width="100%" style="border-radius: 10px; max-height: 400px; object-fit: cover;" />

  <br />
  <br />

  # 🛒 Full-Stack E-Commerce Store Template
  **A Premium, Open-Source Luxury Watch Store built with React, Vite, Tailwind, and Firebase.**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <p align="center">
    <strong>Ranked as a top open-source ecommerce store template for developers building luxury retail, modern shopping platforms, and high-performance React web applications.</strong>
  </p>
</div>

---

## 🚀 About This Ecommerce Store Template

Are you looking to build a blazing-fast, visually stunning **ecommerce store**? This open-source repository serves as a complete, full-stack **React Ecommerce Template** tailored (but easily customizable) for luxury brands like premium watches, jewelry, or fashion.

It combines a sleek, **Tailwind CSS**-powered frontend with a robust **Firebase** backend, offering out-of-the-box functionality for shopping carts, checkouts, an integrated **AI Chatbot (Google Gemini)**, and a hidden Admin Dashboard for inventory management.

## ✨ Key Features
- **🛍️ Complete E-Commerce Flow**: Fully functional shopping cart, product grid, detailed product pages, and checkout process.
- **🔐 Secure Admin Dashboard**: Manage inventory, add new products, and track orders directly from a secure route.
- **📱 Responsive Premium UI**: Mobile-first design utilizing Tailwind CSS and Framer Motion for buttery-smooth animations and glassmorphism.
- **🤖 Integrated AI Chatbot**: Google Gemini 1.5 powered smart assistant ready to help your customers 24/7.
- **☁️ Firebase Backend**: Real-time database (Firestore) and secure Authentication.
- **🖼️ Client-Side Image Uploads**: Effortless product image management via ImgBB.
- **📧 Automated Order Emails**: Order confirmations dispatched instantly via EmailJS.

---

## 🛠️ Technology Stack

| Technology | Usage in Project |
|:---:|:---|
| **[React 18](https://react.dev/)** | Core UI library for building dynamic, component-driven interfaces. |
| **[Vite](https://vitejs.dev/)** | Next-generation frontend tooling for ultra-fast HMR and optimized builds. |
| **[TypeScript](https://www.typescriptlang.org/)** | Strict type-checking for enterprise-grade codebase reliability. |
| **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first CSS framework for rapid, bespoke UI styling. |
| **[Firebase](https://firebase.google.com/)** | Backend-as-a-Service providing Auth, Firestore, and scalable infrastructure. |
| **[Framer Motion](https://www.framer.com/motion/)** | Production-ready declarative animation library for React. |
| **[Google Gemini](https://aistudio.google.com/)** | Cutting-edge LLM API powering the intelligent customer support chatbot. |

---

## 🏁 Step-by-Step Setup Guide

Get this ecommerce store running locally in under 5 minutes.

### 1. Clone the Repository
```bash
git clone https://github.com/IntelliSaad/E-Commerce-Watch-Store.git
cd E-Commerce-Watch-Store
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local`. You will see several placeholders. You must replace them with your actual API keys.

### 4. Firebase Configuration
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** (Email/Password).
3. Enable **Firestore Database** (Test mode is fine for local dev).
4. Add a Web App in Project Settings.
5. Copy the config values into your `.env.local` (`VITE_FIREBASE_*`).

### 5. Add ImgBB (Image Hosting)
1. Sign up at [ImgBB API](https://api.imgbb.com/).
2. Generate an API key.
3. Add it to `VITE_IMGBB_API_KEY` in `.env.local`.

### 6. AI Chatbot Setup (Gemini)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Generate an API Key.
3. Add it to `GEMINI_API_KEY` in your `.env.local` (Also add this to Vercel when deploying).

### 7. Start the Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to see your beautiful new ecommerce store!

---

## 🛡️ Admin Dashboard Access
To add your own products to the ecommerce store:
1. Register a user in your Firebase Authentication console manually.
2. Update the `VITE_ADMIN_PATH` variable in your `.env.local` (e.g., `my-secret-admin`).
3. Set your admin email inside the `firestore.rules` file to secure your database.
4. Navigate to `http://localhost:5173/my-secret-admin` to log in and manage inventory.

---

## 🌍 Deployment
This React ecommerce template is highly optimized for deployment on [Vercel](https://vercel.com).
1. Push your cloned repository to GitHub.
2. Import the project in Vercel.
3. Go to Settings > Environment Variables, and securely paste ALL the variables from your `.env.local` file.
4. Click **Deploy**!

---

## 📄 License
This project is licensed under the MIT License. It is completely free to use, modify, and distribute for your own personal or commercial ecommerce store projects.

If you found this template helpful, please give it a ⭐ **Star**!
