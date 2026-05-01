import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'placeholder_key_here') {
            console.warn("Gemini API Key missing or invalid.");
            return res.status(200).json({
                reply: "I am currently in maintenance mode. Please add a valid GEMINI_API_KEY to the Vercel variables to enable my AI brain! 🧠"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using newer model name if available, or stick to what worked

        const contextPrompt = `
        You are an AI assistant for YourStoreName, a premium watch store.
        
        CRITICAL RULES:
        1. **Price Range Queries**:
           - If a user asks for watches under a specific price (e.g., "under 15000"), **DO NOT invent specific watch names**.
           - Instead, say: "We have excellent options in that range."
           - **IMMEDIATELY tell them to visit the Shop page** to see the full collection sorted by price.
        2. **Call to Action**:
           - **Shop Page**: Always mention "You can view our full collection on the Shop page."
           - **WhatsApp**: For specific stock or video inquiries, say: "For live videos or specific availability, please **WhatsApp us directly** via the Contact page."
        3. **Conciseness**: Keep answers under 3 sentences.
        4. **Formatting**: Use Markdown bullet points.
        5. **Pricing Fact**: We have watches starting from PKR 3,000.

        Store Info:
        - Name: YourStoreName
        - Policies: Cash on Delivery, 7-day returns.
        - Contact: your-email@example.com, +1234567890.
        
        User Message: ${message}
        `;

        const result = await model.generateContent(contextPrompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error: any) {
        console.error("Gemini API Error:", error);

        if (error.message?.includes('429') || (error as any).status === 429) {
            return res.status(200).json({
                reply: "Brain overload! 🤯 I'm receiving too many messages right now. Please wait 30 seconds and try again."
            });
        }

        if (error.message?.includes('404')) {
            return res.status(200).json({
                reply: "System Upgrade: My AI model is currently updating. Please check back later."
            });
        }

        res.status(500).json({ error: 'Failed to process AI response' });
    }
}
