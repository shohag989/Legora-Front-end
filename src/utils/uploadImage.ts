import axios from 'axios';

/**
 * Uploads a local file to ImgBB and returns the direct hosting URL.
 * @param file The file object from a file input or drag-and-drop event.
 * @returns Promise resolving to the hosted image URL string.
 */
export async function uploadImage(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is not configured in environment variables.");
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.data && response.data.success) {
    return response.data.data.url;
  } else {
    throw new Error(response.data?.error?.message || "Failed to upload image to ImgBB.");
  }
}
