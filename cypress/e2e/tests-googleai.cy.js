// ***********************************************************************
// GOOGLE AI TESTS
// ***********************************************************************
// Uses cy.task() so the API call runs in Node (avoids CORS/connection errors in browser).

const GOOGLE_AI_API_KEY = Cypress.env('GOOGLE_AI_API_KEY');

describe('SUITE 1: Google AI (Gemini) tests', () => {
  it('Example 1 (Google AI - Gemini) - Should analyze an image and provide an alt text', () => {

    // Inputs
    const imageUrl = `https://www.shutterstock.com/image-photo/sun-sets-behind-mountain-ranges-600w-2479236003.jpg`;
    const context = `The images are in a web page for billing and payments.`;
    const code = ``;

    const imageTransport = "url";
    // const imageTransport = "base64"

    const model = "gemini-2.5-flash";
    // const model = "gemini-2.5-flash-lite";

    const input = { imageUrl, context, code, imageTransport };
    const overrides = { model, apiKey: GOOGLE_AI_API_KEY };

    cy.task('getImageAltText', { provider: 'getImageAltTextGoogleAI', input, overrides }, { timeout: 30000 })
    
      .then((result) => {
        cy.logAltTextResultsForImage(result);
      });
  });
});


// For ORIGINAL PROMPT and image example https://www.shutterstock.com/image-photo/sun-sets-behind-mountain-ranges-600w-2479236003.jpg
// Gemini 2.5 Flash-Lite: DO NOY DETECT IS DECORATIVE - 545 tokens/ 7 secs - {alt: 'A serene mountain landscape at sunset with rolling hills covered in wildflowers.', confidence: 'high.'}
// Gemini 2.5 Flash: DETECTS IS DECORATIVE - 683 tokens/ 6.1 SECS - {alt: '', decorative_reason: 'This image of a sunset over mountains with a field…nal information relevant to billing and payments.', confidence: 'high.'}
// Gemini 2.5 Pro (gemini-2.5-pro): GET MESSAGE ERROR QUOTA EXCEED
// Gemini 2.5 Flash Image (gemini-2.5-flash-image): GET MESSAGE ERROR QUOTA EXCEED
// Gemini 2.0 Flash (gemini-2.0-flash): : GET MESSAGE ERROR QUOTA EXCEED
