export default async function uploadImage(image) {
    if (!image) {
        return null;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();

        if (data.success) {
            return data.data.display_url;
        } else {
            throw new Error(data.error?.message || 'Failed to upload image');
        }
    } catch (error) {
        console.error('Image Upload Error:', error);
        throw error;
    }
}