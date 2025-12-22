import { useState } from "react";
import { Upload, X } from "lucide-react";

interface UploadResponse {
  url?: string;
  display_url?: string;
  error?: string;
}

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size (4 MB max)
    if (selectedFile.size > 4 * 1024 * 1024) {
      setError("File size must be under 4 MB");
      return;
    }

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setFile(selectedFile);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      let data: UploadResponse;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setError("Server returned an invalid response. Please try again.");
        return;
      }

      if (!response.ok || data.error) {
        setError(data.error || "Upload failed");
        return;
      }

      setResult(data);
      setFile(null);
      setPreview("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  };

  const clearUpload = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg border border-border">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Upload Image</h2>

      {/* Upload Area */}
      <div className="mb-6">
        <label className="block">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to select an image or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max 4 MB • JPG, PNG, GIF, WebP
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </label>
      </div>

      {/* Preview */}
      {preview && (
        <div className="mb-6">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto rounded-lg border border-border max-h-64 object-contain"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {file?.name} • {(file!.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Upload Result */}
      {result?.url && (
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-primary/10 border border-primary rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">
              Upload Successful!
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Image URL</p>
                <input
                  type="text"
                  value={result.url}
                  readOnly
                  className="w-full text-xs p-2 bg-background border border-border rounded"
                  onClick={(e) => e.currentTarget.select()}
                />
              </div>
              {result.display_url && (
                <div>
                  <p className="text-xs text-muted-foreground">Display URL</p>
                  <input
                    type="text"
                    value={result.display_url}
                    readOnly
                    className="w-full text-xs p-2 bg-background border border-border rounded"
                    onClick={(e) => e.currentTarget.select()}
                  />
                </div>
              )}
            </div>
          </div>
          <img
            src={result.display_url || result.url}
            alt="Uploaded"
            className="w-full h-auto rounded-lg border border-border max-h-64 object-contain"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        {preview && !result?.url && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload
              </>
            )}
          </button>
        )}
        {(preview || result) && (
          <button
            onClick={clearUpload}
            className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
