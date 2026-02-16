import { DEFAULT_IMAGE_TRANSPORT, DEFAULT_RESPONSE_MIME_TYPE } from './constants-enum';
    
// ***********************************************************************
// Public Helper Functions - Generic
// ***********************************************************************


export const getPrompt = (prompt, context, code) => {
    prompt = addContextToPrompt(prompt, context);
    return addCodeToPrompt(prompt, code);
}

export const ensureSentenceEndsWithPeriod = (info) => {
    if (!info || typeof info !== "object") return info;
    for (const key of Object.keys(info)) {
        if (typeof info[key] === "string" && info[key] !== "") {
            const s = info[key];
            if (s[s.length - 1] !== ".") {
                info[key] = s + ".";
            }
        }
    }
    return info;
}

export const printResult = (result, title) => {
    const resultTitle = '-------------- RESULTS FOR ' + title + ' --------------'
    
    console.log(resultTitle);
    console.log(result);
  
    // cy.log(resultTitle);
    // cy.log('Model: "' + result.model + '"');
    // cy.log('Image transport: "' + result.imageTransport + '"');
    // cy.log('Tokens used: ' + result.tokens);
    // cy.log('Total time (ms): ' + result.totalTime);
    // cy.log('Alternative text: ' + JSON.stringify(result.info));
  }
  


// ***********************************************************************
// Public Helper Functions - Image related
// ***********************************************************************

export const normalizeInputs = (input) => {
    if (typeof input === "string" && input.trim() !== "") {
        return { imageUrl: input, imageTransport: DEFAULT_IMAGE_TRANSPORT };
    } else if (input && typeof input === "object" && Object.keys(input).length > 0 && input.imageUrl && input.imageUrl.trim() !== "") {
        return { ...input };
    }
    return { error: "Invalid input" };
}

export const normalizeModelOptions = (aiModel, overrides = {}) => {
    const result = {};
    // Combine all keys from aiModel and overrides
    const keys = new Set([
        ...Object.keys(aiModel || {}),
        ...Object.keys(overrides || {}),
    ]);
    // For each key, use override if present, otherwise default from aiModel
    for (const key of keys) {
        if (overrides[key] !== undefined) {
            result[key] = overrides[key];
        } else if (aiModel[key] !== undefined) {
            result[key] = aiModel[key];
        }
    }
    return result;
}

export async function imageUrlToBase64(imageUrl) {
    const response = await fetch(imageUrl);
    const imageArrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageArrayBuffer).toString('base64');
    const mimeType = getMimeTypeFromUrl(imageUrl);

    return { base64Image, mimeType };
}


// ***********************************************************************
// Private Helper functions
// ***********************************************************************

const addContextToPrompt = (prompt, context) => {
    const CONTEXT = (typeof context === "string" && context.trim())
        ? `Context:
  ${context.trim()}`
        : "";
    return prompt.replace("{{CONTEXT}}", CONTEXT);
}

const addCodeToPrompt = (prompt, code) => {
    const CODE = (typeof code === "string" && code.trim())
        ? `Code:
  ${code.trim()}`
        : "";
    return prompt.replace("{{CODE}}", CODE);
}

const getMimeTypeFromUrl = (imageUrl) => {
    const extension = imageUrl.split('.').pop().toLowerCase().split(/\#|\?/)[0];
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'webp':
            return 'image/webp';
        case 'svg':
        case 'svgz':
            return 'image/svg+xml';
        case 'tiff':
        case 'tif':
            return 'image/tiff';
        case 'bmp':
            return 'image/bmp';
        case 'ico':
        case 'cur':
            return 'image/x-icon';
        default:
            return 'application/octet-stream';
    }
}
