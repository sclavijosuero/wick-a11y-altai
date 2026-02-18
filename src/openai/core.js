import { OpenAI } from "openai";

import { getPrompt, normalizeModelOptions, normalizeInputs, ensureSentenceEndsWithPeriod, imageUrlToBase64, printResult } from '../utils';
import { PROMPT_ALT_TEXT_IMAGE } from '../prompts';

import { DEFAULT_IMAGE_TRANSPORT } from '../constants-enum';


const models = {
    openAI: {
        model: "gpt-4o-mini", // or "gpt-4o"
        role: "user",
        temperature: 0.2,
        max_completion_tokens: 2000,
        response_format: { type: "json_object" },
    },
}


export async function getImageAltTextOpenAI(input, overrides = {}) {
    const aiModel = models.openAI;

    if (!overrides.apiKey) {
        return { error: 'OPENAI APIKEY is required' };
    }

    const aiInstance = new OpenAI({
        apiKey: overrides.apiKey,
        dangerouslyAllowBrowser: true,
    });

    const result = await computeAltTextOpenAI(aiModel, aiInstance, input, overrides);

    printResult(result, 'OpenAI API');
    return result;
}


// To be used by getImageAltTextOpenAI and getImageAltTextGroqAIOpenAI
export async function computeAltTextOpenAI(aiModel, aiInstance, input, overrides = {}) {
    // Normalize AI model options
    const modelOptions = normalizeModelOptions(aiModel, overrides);

    // Normalize inputs
    const normalizedInput = normalizeInputs(input);
    if (normalizedInput.error) return { error: normalizedInput.error };
    const { imageUrl, context, code, imageTransport = DEFAULT_IMAGE_TRANSPORT } = normalizedInput;

    // Get  prompt
    const prompt = getPrompt(PROMPT_ALT_TEXT_IMAGE, context, code);

    // Start timer
    const tStart = performance.now();

    // Call AI API
    const model = modelOptions.model;
    const response = await aiInstance.chat.completions.create({
        model: model,
        messages: [
            {
                role: modelOptions.role,
                content: [
                    { type: "text", text: prompt },
                    await toOpenAIImagePartFromUrl(imageUrl, imageTransport),
                ],
            },
        ],
        temperature: modelOptions.temperature,
        max_completion_tokens: modelOptions.max_completion_tokens,
        response_format: modelOptions.response_format || { type: "json_object" },
    });

    // End timer
    const tEnd = performance.now();

    // Get results
    const tokens = response.usage.total_tokens;
    const totalTime = tEnd - tStart; // Although OpenAI API returns total_time, to be consistent with the other providers, we use performance.now()
    // const totalTime = response.usage.total_time * 1000; // From seconds to milliseconds

    const rawText = response.choices?.[0]?.message?.content ?? "";
    const rawJson = JSON.parse(rawText.replace(/^```(?:json)?\s*\n|\n```$/g, ""));
    const info = ensureSentenceEndsWithPeriod(rawJson);

    return { model, tokens, totalTime, info, imageTransport };

}


async function toOpenAIImagePartFromUrl(imageUrl, imageTransport) {
    if (imageTransport === "base64") {
        // Fetch image from URL and convert to base64
        const { base64Image, mimeType } = await imageUrlToBase64(imageUrl);
        return { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } };
    }

    // URL directly
    return { type: "image_url", image_url: { url: imageUrl } };
}

