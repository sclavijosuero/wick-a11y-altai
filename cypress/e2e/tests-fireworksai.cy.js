// ***********************************************************************
// FIREWORKS AI TESTS
// ***********************************************************************
// Uses cy.task() so the API call runs in Node (avoids CORS/APIConnectionError in browser).

const FIREWORKS_AI_API_KEY = Cypress.env('FIREWORKS_AI_API_KEY');

describe('SUITE 3: Fireworks AI with OpenAI compatible tests', () => {
  it('Example 3 (Fireworks AI - OpenAI compatible) - Should analyze an image and provide an alt text', () => {
    
    // Inputs
    const imageUrl = `https://www.shutterstock.com/image-photo/sun-sets-behind-mountain-ranges-600w-2479236003.jpg`;
    const context = `The images are in a web page for billing and payments.`;
    const code = ``;

    const imageTransport = "url";
    // const imageTransport = "base64"

    const model = "accounts/fireworks/models/kimi-k2p5";
    // const model = "accounts/fireworks/models/qwen2p5-vl-7b-instruct";
    // const model = "accounts/fireworks/models/phi-3-vision-128k-instruct";

    const input = { imageUrl, context, code, imageTransport };
    const overrides = { model, apiKey: FIREWORKS_AI_API_KEY };

    cy.task('getImageAltText', { provider: 'getImageAltTextFireworksAIOpenAI', input, overrides }, { timeout: 30000 })
      .then((result) => {
        cy.logAltTextResultsForImage(result);
      });
  });
});
