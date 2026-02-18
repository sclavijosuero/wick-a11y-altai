import { GoogleGenAI } from "@google/genai";

import { getPrompt, normalizeModelOptions, normalizeInputs, ensureSentenceEndsWithPeriod, imageUrlToBase64, printResult } from '../utils';
import { PROMPT_ALT_TEXT_IMAGE } from '../prompts';

import { DEFAULT_IMAGE_TRANSPORT, DEFAULT_RESPONSE_MIME_TYPE } from '../constants-enum';


// Supported models for Google AI
const models = {
  googleAIGemini: {
    model: 'gemini-2.5-flash', // Relativelly fast model
    role: 'user',
    temperature: 0.2,
    maxOutputTokens: 2000,
    responseMimeType: 'application/json',

    // Gemini Models:
    //  * gemini-2.5-flash (Some times when image transport is "url" it fails and gives an error: {"error":{"code":400,"message":"Cannot fetch content from the provided URL.","status":"INVALID_ARGUMENT"}})
    //  * gemini-2.5-pro
    //  * gemini-3-flash-preview

    // Generate AI content for image:
    // - Signed URL	100MB	Images already in cloud storage (S3, Azure)
    // - Files API	2GB	Large images or files used multiple times
    // - Inline Data	20MB	Small, transient images
  },
}

// Suported inputs:
// ----------------
// getImageAltTextGoogleAI("https://my.domain.com/image.jpg")
// getImageAltTextGoogleAI("https://my.domain.com/image.jpg", overrides)
//
// getImageAltTextGoogleAI( { imageUrl: "https://my.domain.com/image.jpg"})
// getImageAltTextGoogleAI( { imageUrl: "https://my.domain.com/image.jpg" }, overrides)
//
// getImageAltTextGoogleAI( { imageUrl: "https://my.domain.com/image.jpg", context: "This is a context" })
// getImageAltTextGoogleAI( { imageUrl: "https://my.domain.com/image.jpg", context: "This is a context" }, overrides)
//
// overrides is an object with the model options: { model, role, maxOutputTokens }
//
export async function getImageAltTextGoogleAI(input, overrides = {}) {
  // AI model to use
  const aiModel = models.googleAIGemini;


  if (!overrides.apiKey) {
    return { error: 'GOOGLE AI APIKEY is required' };
  }

  // Google AI client
  const aiInstance = new GoogleGenAI({ apiKey: overrides.apiKey });

  // Normalize AI model options
  const modelOptions = normalizeModelOptions(aiModel, overrides);

  // Normalize inputs
  const normalizedInput = normalizeInputs(input);
  if (normalizedInput.error) {
    return { error: normalizedInput.error };
  }
  const { imageUrl, context, code, imageTransport = DEFAULT_IMAGE_TRANSPORT } = normalizedInput;

  // Get prompt
  const prompt = getPrompt(PROMPT_ALT_TEXT_IMAGE, context, code);

  // Start timer
  const tStart = performance.now();

  // Call AI API
  const model = modelOptions.model;
  const aiResult = await aiInstance.models.generateContent({
    model: model,
    contents: [
      {
        role: modelOptions.role,
        parts: [
          { text: prompt },
          await toGoogleImagePartFromUrl(imageUrl, imageTransport),
        ],
      }
    ],
    config: {
      temperature: modelOptions.temperature,
      maxOutputTokens: modelOptions.maxOutputTokens,
      responseMimeType: modelOptions.responseMimeType || DEFAULT_RESPONSE_MIME_TYPE,
    }
  });

  // End timer
  const tEnd = performance.now();

  // Get results
  const tokens = aiResult.usageMetadata.totalTokenCount;
  const totalTime = tEnd - tStart;

  const rawText = aiResult.text.replace(/^```(?:json)?\s*\n|\n```$/g, "");
  const info = ensureSentenceEndsWithPeriod(JSON.parse(rawText));

  const result = { model, tokens, totalTime, info, imageTransport };

  printResult(result, 'Gemini AI with Google API');

  return result;
}


async function toGoogleImagePartFromUrl(imageUrl, imageTransport) {
  if (imageTransport === "base64") {
    // Fetch image from URL and convert to base64
    const { base64Image, mimeType } = await imageUrlToBase64(imageUrl)
    return { inlineData: { data: base64Image, mimeType: mimeType } }
  }
  return { fileData: { fileUri: imageUrl } }
}
