import { OpenAI } from "openai";

import { computeAltTextOpenAI } from '../openai/core';
import { printResult } from '../utils';


const models = {
    fireworksAIOpenAI: { // Fireworks AI Compatible API with OpenAI
        baseURL: 'https://api.fireworks.ai/inference/v1',
        model: 'accounts/fireworks/models/qwen2p5-vl-7b-instruct', // Super fast model for images
        role: 'user',
        temperature: 0.2,
        max_tokens: 2000,
        response_format: { type: "json_object" },

        // Fireworks AI Vision Models (new):
        //  * accounts/fireworks/models/qwen2p5-vl-7b-instruct | Qwen2.5-VL 7B Instruct (Best balance: quality + speed)
        //  * accounts/fireworks/models/qwen2p5-vl-32b-instruct | Qwen2.5-VL 32B Instruct (Slower, more expensive)
        //  * accounts/fireworks/models/qwen2p5-vl-72b-instruct | Qwen2.5-VL 72B Instruct (Slower, more expensive)
        //  * accounts/fireworks/models/phi-3-vision-128k-instruct | Phi-3.5 Vision (Fastest, good enough quality)
    },
}

// Groq AI Using OpenAI API
export async function getImageAltTextFireworksAIOpenAI(input, overrides = {}) {
    console.log('----------------------------------------------------------');
    console.log(input)
    console.log(overrides)
    console.log('----------------------------------------------------------');
    // AI model to use
    const aiModel = models.fireworksAIOpenAI;

    if (!overrides.apiKey) {
        return { error: 'FIREWORKS AI APIKEY is required' };
    }

    // Google AI client
    const aiInstance = new OpenAI({
        baseURL: aiModel.baseURL,
        apiKey: overrides.apiKey,
        // dangerouslyAllowBrowser: true, // Enable. Disabled by default, as it risks exposing your secret API credentials to attackers (https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
    });

    const result = await computeAltTextOpenAI(aiModel, aiInstance, input, overrides);
    
    printResult(result, 'Fireworks AI with OpenAI API');
    return result;
}
