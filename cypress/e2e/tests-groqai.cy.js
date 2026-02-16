import { getImageAltTextGroqAIOpenAI, getImageAltTextOpenAI } from '../../src/altai.js'; //  Groq AI using OpenAI API compatible with Groq

// ***********************************************************************
// GROQ AI TESTS
// ***********************************************************************

describe('Example 2: Groq AI with OpenAI compatible tests', () => {
  it('Example 2.1: Should access an url image and analyze it', () => {
    const imageUrl = `https://www.shutterstock.com/image-photo/sun-sets-behind-mountain-ranges-600w-2479236003.jpg`
    const context = `The images are in a web page for billing and payments.` // With this context the model will be more accurate in describing the image and might set alt="" and decorative_reason instead like "The image is a decorative landscape photo unrelated to the billing and payments context.""
    const code = ``

    const model = "meta-llama/llama-4-scout-17b-16e-instruct"
    // const model = "meta-llama/llama-4-maverick-17b-128e-instruct"

    const imageTransport = "url"

    // Groq AI Using OpenAI API
    cy.wrap(getImageAltTextGroqAIOpenAI({ imageUrl, context, code, imageTransport }, { model }), { timeout: 20000, log: false })
      .then((result) => {
        cy.log('-------------- RESULTS FOR Groq AI with OpenAI API --------------');
        cy.log('Model: "' + result.model + '"');
        cy.log('Image transport: "' + result.imageTransport + '"');
        cy.log('Tokens used: ' + result.tokens);
        cy.log('Total time (ms): ' + result.totalTime);
        cy.log('Alternative text: ' + JSON.stringify(result.info));
      });
  });
});
