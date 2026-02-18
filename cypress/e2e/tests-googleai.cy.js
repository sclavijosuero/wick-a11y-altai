// ***********************************************************************
// GOOGLE AI TESTS
// ***********************************************************************

import { getImageAltTextGoogleAI } from '../../src/altai.js';
const GOOGLE_AI_API_KEY = Cypress.env('GOOGLE_AI_API_KEY')

describe('Example 1: Gemini tests', () => {
  it('Example 1.1: Should access an url image and analyze it', () => {

    // Inputs
    // ------
    const imageUrl = `https://www.shutterstock.com/image-photo/sun-sets-behind-mountain-ranges-600w-2479236003.jpg`
    const context = `The images are in a web page for billing and payments.` // With this context the model will be more accurate in describing the image and might set alt="" and decorative_reason instead like "The image is a decorative landscape photo unrelated to the billing and payments context.""
    const code = ``

    // Overrides
    // ---------
    const imageTransport = "url"  // For public sites
    // const imageTransport = "base64"  // For private sites behind authentication

    const model = "gemini-2.5-flash"  // Not the fastest model and few tokens
    // const model = "gemini-3-flash-preview"


    // Call Google AI (Gemini API)
    // ---------------------------
    cy.wrap(getImageAltTextGoogleAI({ imageUrl, context, code, imageTransport }, { model, apiKey: GOOGLE_AI_API_KEY }), { timeout: 20000, log: false })
      .then((result) => {
        cy.log('*************** RESULTS FOR Google AI (Gemini API) ***************');
        cy.log('Model: "' + result.model + '"');
        cy.log('Image transport: "' + result.imageTransport + '"');
        cy.log('Tokens used: ' + result.tokens);
        cy.log('Total time (ms): ' + result.totalTime);
        cy.log('Alternative text: ' + JSON.stringify(result.info));
      });
  });
});
