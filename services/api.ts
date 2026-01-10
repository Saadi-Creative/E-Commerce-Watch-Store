// src/services/api.ts

/**
 * Frontend API Service
 * Dispatches requests to the Node.js backend to keep keys secure.
 * Uses relative paths for Vercel Serverless Functions.
 */

/**
 * Upload image to secure backend
 * @param file - File object to upload
 * @param token - Optional Admin Secret for authorized uploads
 * @returns Promise with URL string
 */
export const uploadImageSecure = async (file: File, token?: string): Promise<string | null> => {
    try {
        // 1. Convert File to Base64
        const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                let encoded = reader.result?.toString() || '';
                const base64Content = encoded.split(',')[1];
                resolve(base64Content);
            };
            reader.onerror = error => reject(error);
        });

        const imageBase64 = await toBase64(file);

        // 2. Send to Backend
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = token;
        }

        const response = await fetch(`/api/upload-image`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ imageBase64 }),
        });

        const data = await response.json();

        if (data.success && data.data && data.data.url) {
            return data.data.url;
        } else {
            console.error('Upload failed:', data.error);
            return null;
        }

    } catch (error) {
        console.error('Secure upload error:', error);
        return null;
    }
};

/**
 * Send chat message to secure backend
 */
export const sendChatMessage = async (message: string): Promise<string> => {
    try {
        const response = await fetch(`/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        return data.reply || "No response";
    } catch (err) {
        return "Error connecting to AI server";
    }
};
