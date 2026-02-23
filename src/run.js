import path from "path";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Run any altai provider in Node (framework-agnostic).
 * Use from Playwright, Cypress, or any JS package.
 *
 * @param {string} provider - Name of the function exported from altai.js (e.g. 'getImageAltTextGoogleAI')
 * @param {object} input - { imageUrl, context?, code?, imageTransport? }
 * @param {object} [overrides] - Provider options (e.g. { model, apiKey })
 * @returns {Promise<object>} Result from the provider or { error: string }
 *
 * @example
 * const result = await getImageAltText('getImageAltTextGoogleAI', { imageUrl, context, code }, { apiKey, model });
 */
export async function getImageAltText(provider, input, overrides = {}) {
  const altaiPath = pathToFileURL(path.join(__dirname, "altai.js")).href;
  const altai = await import(altaiPath);
  const fn = altai[provider];
  if (typeof fn !== "function") {
    return {
      error: `Unknown provider: "${provider}". Export the function from altai.js and use its name as provider.`,
    };
  }
  return fn(input, overrides);
}
