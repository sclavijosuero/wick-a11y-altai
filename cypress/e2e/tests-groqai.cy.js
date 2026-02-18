// ***********************************************************************
// GROQ AI TESTS
// ***********************************************************************

import { getImageAltTextGroqAIOpenAI, getImageAltTextOpenAI } from '../../src/altai.js'; //  Groq AI using OpenAI API compatible with Groq
const GROQ_AI_API_KEY = Cypress.env('GROQ_AI_API_KEY')

describe('Example 2: Groq AI with OpenAI compatible tests', () => {
  it('Example 2.1: Should access an url image and analyze it', () => {

    // Inputs
    // ------
    const imageUrl = `https://www.shutterstock.com/image-photo/sun-sets-behind-mountain-ranges-600w-2479236003.jpg`
    const context = `The images are in a web page for billing and payments.` // With this context the model will be more accurate in describing the image and might set alt="" and decorative_reason instead like "The image is a decorative landscape photo unrelated to the billing and payments context.""
    const code = ``

    // Overrides
    // ---------
    const imageTransport = "url"  // For public sites
    // const imageTransport = "base64"  // For private sites behind authentication

    const model = "meta-llama/llama-4-scout-17b-16e-instruct"  // Faster and few tokens
    // const model = "meta-llama/llama-4-maverick-17b-128e-instruct"


    // Call Groq AI (Using OpenAI API)
    // -------------------------------
    cy.wrap(getImageAltTextGroqAIOpenAI({ imageUrl, context, code, imageTransport }, { model, apiKey: GROQ_AI_API_KEY }), { timeout: 20000, log: false })
      .then((result) => {
        cy.log('*************** RESULTS FOR Groq AI (using OpenAI API) ***************');
        cy.log('Model: "' + result.model + '"');
        cy.log('Image transport: "' + result.imageTransport + '"');
        cy.log('Tokens used: ' + result.tokens);
        cy.log('Total time (ms): ' + result.totalTime);
        cy.log('Alternative text: ' + JSON.stringify(result.info));
      });
  });
});
