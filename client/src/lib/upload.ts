export async function uploadToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    let result: any;
    try {
      result = JSON.parse(text);
    } catch {
      console.error("Upload proxy returned non-JSON:", text);
      throw new Error("Image upload returned an invalid response.");
    }

    if (!response.ok || !result?.url) {
      throw new Error(result?.error || "Image upload failed");
    }

    return result.url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image");
  }
}
