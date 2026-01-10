import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { imageBase64 } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ success: false, error: 'No image provided' });
        }

        // Mock mode support (if key is missing in Vercel)
        if (!process.env.IMGBB_API_KEY) {
            console.warn('Real ImgBB Key missing, returning mock response');
            return res.status(200).json({
                success: true,
                data: {
                    url: 'https://i.ibb.co/wzn25hP/placeholder-watch.jpg'
                }
            });
        }

        const formData = new URLSearchParams();
        formData.append('image', imageBase64);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        interface ImgBBResponse {
            success: boolean;
            data: {
                url: string;
            };
            error?: {
                message: string;
            };
        }

        const data = await response.json() as ImgBBResponse;

        if (data.success) {
            res.status(200).json({ success: true, data });
        } else {
            console.error('ImgBB Error:', data);
            res.status(500).json({ success: false, error: 'Failed to upload image' });
        }
    } catch (err: any) {
        console.error('Upload Error:', err);
        res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
}
