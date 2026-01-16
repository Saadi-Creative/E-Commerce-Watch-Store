
/**
 * Direct Client-Side ImgBB Upload Service
 * 
 * Uses VITE_IMGBB_API_KEY from environment variables.
 * Call this if the secure server upload fails (e.g. in local development).
 */

export const uploadToImgBBDirect = async (file: File): Promise<string | null> => {
    const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

    if (!API_KEY) {
        console.warn("Missing VITE_IMGBB_API_KEY. Cannot upload directly.");
        return null;
    }

    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success && data.data && data.data.url) {
            return data.data.url;
        } else {
            console.error("ImgBB Direct Upload Error:", data);
            return null;
        }
    } catch (error) {
        console.error("ImgBB Network Error:", error);
        return null;
    }
};
