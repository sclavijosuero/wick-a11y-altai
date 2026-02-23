// ***********************************************************************
// Public Constants
// ***********************************************************************

export const IMAGE_TRANSPORT = Object.freeze({
    URL: "url",
    BASE64: "base64"
});

export const DEFAULT_IMAGE_TRANSPORT = IMAGE_TRANSPORT.URL;

export const DEFAULT_RESPONSE_MIME_TYPE = "application/json";

// ***********************************************************************
// Public Helper Functions - Generic
// ***********************************************************************

// Get prompt for image alt text adding context and code
export const getPrompt = (prompt, context, code) => {
    prompt = addContextToPrompt(prompt, context);
    return addCodeToPrompt(prompt, code);
}

// Ensure each sentence ends with a period (easier to read for screen readers)
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

// Print result to terminal console
export const printResult = (result, title) => {
    const resultTitle = '-------------- RESULTS FOR ' + title + ' --------------'

    console.log(resultTitle);
    console.log(result);
}



// ***********************************************************************
// Public Helper Functions - Image related
// ***********************************************************************

// Normalize inputs: convert string to object with imageUrl and imageTransport
export const normalizeInputs = (input) => {
    if (typeof input === "string" && input.trim() !== "") {
        return { imageUrl: input, imageTransport: DEFAULT_IMAGE_TRANSPORT };
    } else if (input && typeof input === "object" && Object.keys(input).length > 0 && input.imageUrl && input.imageUrl.trim() !== "") {
        return { ...input };
    }
    return { error: "Invalid input" };
}

// Normalize model options: combine all keys from aiModel and overrides
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

// Convert image URL to base64
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

// Add context to prompt
const addContextToPrompt = (prompt, context) => {
    const CONTEXT = (typeof context === "string" && context.trim())
        ? `Context:
  ${context.trim()}`
        : "";
    return prompt.replace("{{CONTEXT}}", CONTEXT);
}

// Add code to prompt
const addCodeToPrompt = (prompt, code) => {
    const CODE = (typeof code === "string" && code.trim())
        ? `Code:
  ${code.trim()}`
        : "";
    return prompt.replace("{{CODE}}", CODE);
}


// Get MIME type from image URL extension
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
