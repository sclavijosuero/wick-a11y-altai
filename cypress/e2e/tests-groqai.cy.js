// ***********************************************************************
// GROQ AI TESTS
// ***********************************************************************
// Uses cy.task() so the API call runs in Node (avoids CORS/connection errors in browser).

const GROQ_AI_API_KEY = Cypress.env('GROQ_AI_API_KEY');

describe('SUITE 2: Groq AI with OpenAI compatible tests', () => {
  it('Example 2 (Groq AI - OpenAI compatible) - Should analyze an image and provide an alt text', () => {
    
    // Inputs
    const imageUrl = `https://www.shutterstock.com/image-photo/sun-sets-behind-mountain-ranges-600w-2479236003.jpg`;
    const context = `The images are in a web page for billing and payments.`;
    const code = ``;

    const imageTransport = "url";
    // const imageTransport = "base64"

    const model = "meta-llama/llama-4-scout-17b-16e-instruct";
    // const model = "meta-llama/llama-4-maverick-17b-128e-instruct";

    const input = { imageUrl, context, code, imageTransport };
    const overrides = { model, apiKey: GROQ_AI_API_KEY };

    cy.task('getImageAltText', { provider: 'getImageAltTextGroqAIOpenAI', input, overrides }, { timeout: 30000 })
      .then((result) => {
        cy.logAltTextResultsForImage(result);
      });
  });
});
