# E-Commerce Premium Watch Store Template

A full-stack, premium e-commerce template built with **React, TypeScript, Vite, Tailwind CSS**, and powered by **Firebase** for backend services. It features an integrated AI Chatbot (Google Gemini), secure admin dashboard, and image hosting (ImgBB).

## Features
- 🛒 Full e-commerce functionality (Cart, Checkout, Orders)
- 🔐 Secure Admin Dashboard for inventory management
- 📱 Mobile-responsive, high-end premium UI with Tailwind & Framer Motion
- 🤖 Integrated AI Chatbot powered by Google Gemini 1.5
- ☁️ Firebase Authentication and Firestore Database
- 🖼️ Client-side image uploads via ImgBB
- 📧 Order notifications via EmailJS

## Prerequisites
Before you begin, ensure you have:
- Node.js installed (v18+)
- A [Firebase](https://firebase.google.com/) account
- An [ImgBB](https://api.imgbb.com/) account for image uploads
- A [Google AI Studio](https://aistudio.google.com/) account for the Gemini API key
- An [EmailJS](https://www.emailjs.com/) account (Optional, for order emails)

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ecommerce-watch-store-template.git
cd ecommerce-watch-store-template
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Configuration
1. In the root of the project, copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and you will see several placeholders. You need to fill these in with your own API keys.

### 4. Firebase Setup (Database & Auth)
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable **Authentication** (Email/Password provider).
4. Enable **Firestore Database** (Start in test mode or set up proper security rules).
5. Go to Project Settings > General > "Your apps" and add a Web App.
6. Copy the configuration values and paste them into your `.env.local` file under the `VITE_FIREBASE_*` variables.

### 5. ImgBB Setup (Image Hosting)
1. Go to [ImgBB API](https://api.imgbb.com/) and sign in.
2. Create an API key.
3. Add the key to `VITE_IMGBB_API_KEY` in your `.env.local`.

### 6. AI Chatbot Setup (Gemini)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Generate an API Key.
3. Add it to `GEMINI_API_KEY` in your `.env.local` (and add it to your Vercel Environment Variables when deploying).

### 7. Start the Development Server
```bash
npm run dev
```
Your app should now be running on `http://localhost:5173`.

## Admin Dashboard Access
To access the admin dashboard:
1. Register a user in your Firebase Authentication console manually, or use the `Add User` button in Firebase.
2. Ensure you have the `VITE_ADMIN_PATH` set in your `.env.local` (e.g., `my-secret-admin`).
3. Navigate to `http://localhost:5173/my-secret-admin` to log in.

## Deployment
This project is optimized for deployment on [Vercel](https://vercel.com).
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. In the Vercel dashboard, go to Settings > Environment Variables, and add ALL the variables from your `.env.local` file.
4. Deploy!

## License
MIT License. Free to use and modify for your own projects!
