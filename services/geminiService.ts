import { GoogleGenAI } from "@google/genai";

export const generateVeoVideo = async (
  imageFile: File,
  prompt: string | undefined,
  aspectRatio: '16:9' | '9:16'
): Promise<string> => {
  // 1. Convert file to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  // 2. Initialize Gemini with API Key from env
  // Note: For Veo, the user must select a key via window.aistudio.openSelectKey() in the UI first.
  // We assume process.env.API_KEY is populated by the time this runs if the environment supports it,
  // or we rely on the injected key handling.
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  // 3. Start Video Generation Operation
  // Using 'veo-3.1-fast-generate-preview' as requested
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || 'Animate this scene naturally',
    image: {
      imageBytes: base64Data,
      mimeType: imageFile.type,
    },
    config: {
      numberOfVideos: 1,
      aspectRatio: aspectRatio,
      // Resolution is implicitly handled by the model/config defaults for preview
    }
  });

  // 4. Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  // 5. Get Download URI
  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!videoUri) {
    throw new Error("Failed to generate video: No URI returned.");
  }

  // 6. Return the full fetchable URL (Client needs to fetch this with the key appended)
  // We return just the URI, the component will handle fetching/blob creation or appending key
  return videoUri; 
};