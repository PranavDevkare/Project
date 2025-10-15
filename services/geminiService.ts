
import { GoogleGenAI, Type } from "@google/genai";
import type { HbPrediction } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // or handle error
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const validateNailbedImage = async (file: File): Promise<boolean> => {
  const imagePart = await fileToGenerativePart(file);
  const prompt = "Is this a clear, close-up image of a human finger's nailbed? Answer only with 'yes' or 'no'.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
    });
    
    const textResponse = response.text.trim().toLowerCase();
    return textResponse.includes('yes');
  } catch (error) {
    console.error("Error validating image:", error);
    return false;
  }
};


export const predictHb = async (file: File): Promise<HbPrediction> => {
  const imagePart = await fileToGenerativePart(file);
  const prompt = `
    Analyze the provided image of a human nailbed. Based on the color, pallor, and other visual indicators, estimate the hemoglobin (Hb) level in g/dL. 
    
    Provide your response in JSON format. The JSON object should have three fields:
    1. "hbValue": A floating-point number representing the estimated Hb level.
    2. "confidence": A number between 0 and 1 indicating your confidence in the estimation.
    3. "analysis": A brief, one or two-sentence analysis explaining the reasoning based on the nailbed's appearance (e.g., "The nailbed shows significant pallor, suggesting a lower Hb level," or "The nailbed has a healthy pink hue, indicative of normal Hb levels.").
    
    IMPORTANT: This is a simulation for an AI demonstration. Do not include any medical disclaimers in your JSON response. Only return the JSON object.
  `;
  
  const predictionSchema = {
    type: Type.OBJECT,
    properties: {
      hbValue: { type: Type.NUMBER, description: "Estimated Hemoglobin value in g/dL" },
      confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0" },
      analysis: { type: Type.STRING, description: "Brief analysis of the nailbed image" }
    },
    required: ["hbValue", "confidence", "analysis"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: predictionSchema,
      }
    });
    
    const textResponse = response.text;
    const parsedJson = JSON.parse(textResponse);
    
    // Basic validation of the parsed JSON
    if (typeof parsedJson.hbValue !== 'number' || typeof parsedJson.analysis !== 'string' || typeof parsedJson.confidence !== 'number') {
        throw new Error("Invalid JSON structure from API");
    }
    
    return parsedJson as HbPrediction;

  } catch (error) {
    console.error("Error predicting Hb:", error);
    throw new Error("Failed to get a valid prediction from the AI model.");
  }
};
