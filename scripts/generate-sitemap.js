import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BASE_URL = "https://wristhub.pk";

const generateSitemap = async () => {
    console.log("Generating Sitemap...");

    // Static Pages
    const staticPages = [
        "",
        "/shop",
        "/about",
        "/contact",
        "/faq",
        "/reviews"
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add Static Pages
    staticPages.forEach((page) => {
        sitemap += `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`;
    });

    // Add Product Pages
    try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        productsSnapshot.forEach((doc) => {
            sitemap += `
  <url>
    <loc>${BASE_URL}/product/${doc.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
        });

        sitemap += `
</urlset>`;

        fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap);
        console.log("✅ Sitemap generated successfully at public/sitemap.xml");
    } catch (error) {
        console.error("❌ Error generating sitemap:", error);
    }
};

generateSitemap();
