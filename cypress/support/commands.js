// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('logAltTextResultsForImage', (result) => {
    if (result?.error) {
        throw new Error(result.error);
    }
    // Cypress log
    cy.log('*************** ALT TEXT RESULTS FPR IMAGE ***************');
    cy.log('Model: "' + result.model + '"');
    cy.log('Image transport: "' + result.imageTransport + '"');
    cy.log('Tokens used: ' + result.tokens);
    cy.log('Total time (ms): ' + result.totalTime);
    cy.log('Alternative text: ' + JSON.stringify(result.info));

    // Browser Console
    console.log('*************** ALT TEXT RESULTS FPR IMAGE ***************');
    console.log('Model: "' + result.model + '"');
    console.log('Image transport: "' + result.imageTransport + '"');
    console.log('Tokens used: ' + result.tokens);
    console.log('Total time (ms): ' + result.totalTime);
    console.log('Alternative text: ' + JSON.stringify(result.info));
});