// Simple client-side image classification
// Since external APIs have CORS issues, we'll use a smart manual selector

export async function classifyImage(imageFile) {
  console.log('📸 Image uploaded, ready for classification');
  
  // Return null to indicate user should select category manually
  // We'll add a smart category selector in the UI
  return null;
}

// Helper: Convert file to base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
