import { OpenAI } from "openai";

import { computeAltTextOpenAI } from '../openai/core';
import { printResult } from '../utils';


const models = {
    groqAIOpenAI: { // Groq Compatible API with OpenAI
        baseURL: 'https://api.groq.com/openai/v1',
        model: 'meta-llama/llama-4-scout-17b-16e-instruct', // Super fast model for images (Also fast 'meta-llama/llama-4-maverick-17b-128e-instruct')
        role: 'user',
        temperature: 0.2,
        max_completion_tokens: 2000,
        response_format: { type: "json_object" },

        // Groq Llama Vision Models (new):
        //  * meta-llama/llama-4-scout-17b-16e-instruct
        //  * meta-llama/llama-4-maverick-17b-128e-instruct
    },
}

// Groq AI Using OpenAI API
export async function getImageAltTextGroqAIOpenAI(input, overrides = {}) {
    // AI model to use
    const aiModel = models.groqAIOpenAI;

    if (!overrides.apiKey) {
        return { error: 'GROQ AI APIKEY is required' };
    }

    // Google AI client
    const aiInstance = new OpenAI({
        baseURL: aiModel.baseURL,
        apiKey: overrides.apiKey,
        // dangerouslyAllowBrowser: true, // Enable. Disabled by default, as it risks exposing your secret API credentials to attackers (https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
    });

    const result = await computeAltTextOpenAI(aiModel, aiInstance, input, overrides);
    
    printResult(result, 'Groq AI with OpenAI API');
    return result;
}
