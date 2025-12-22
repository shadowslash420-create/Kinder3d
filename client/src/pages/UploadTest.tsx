import ImageUpload from "@/components/sections/ImageUpload";

export default function UploadTest() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Image Upload Test</h1>
        <p className="text-center text-muted-foreground mb-12">
          Upload images to imgbb using the API endpoint
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUpload />
          
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">API Documentation</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Endpoint</h3>
                <code className="block bg-background p-2 rounded border border-border">
                  POST /api/upload
                </code>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Request</h3>
                <code className="block bg-background p-2 rounded border border-border text-xs">
                  FormData with "image" field
                </code>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Response (Success)</h3>
                <pre className="block bg-background p-2 rounded border border-border text-xs overflow-auto">
{`{
  "url": "https://...",
  "display_url": "https://...",
  "deleteUrl": "https://...",
  "thumbnail": "https://..."
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Response (Error)</h3>
                <pre className="block bg-background p-2 rounded border border-border text-xs overflow-auto">
{`{
  "error": "Error message"
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Max file size: 4 MB</li>
                  <li>Accepted formats: JPG, PNG, GIF, WebP</li>
                  <li>API key configured via IMGBB_API_KEY</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
