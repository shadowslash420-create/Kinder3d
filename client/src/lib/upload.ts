export async function uploadToImgBB(file: File): Promise<string> {
  // Use VITE_ prefix for client-side environment variables in Vite
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  
  if (!apiKey) {
    throw new Error("ImgBB API key is not configured. Please set VITE_IMGBB_API_KEY in your environment.");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse ImgBB response:", text);
      throw new Error("ImgBB returned an invalid response.");
    }

    if (!response.ok || !result.success) {
      throw new Error(result?.error?.message || "ImgBB upload failed");
    }

    return result.data.url;
  } catch (error) {
    console.error("ImgBB client-side upload error:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image to ImgBB");
  }
}
