# wick-a11y-altai

Cypress plugin that analyzes images and their context using AI to recommend the most appropriate text alternative for screen readers—whether that is meaningful alt text or alt="" when the image is purely decorative. It supports multiple providers out of the box (Gemini, Groq, OpenAI) and can run standalone or as an add-on to wick-a11y. The first release focuses on images; the architecture leaves room to expand to other “text alternative” checks in the future.

![Animated demo of ... in action](assets/overview.gif)


## Table of Contents

- [Features](#main-features)
- [Compatibility](#compatibility)
- [Installation](#installation)
- [Configuration](#configuration)
- [API](#api)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Changelog](#changelog)


## Main Features

✔️ Multi-provider: Gemini / Groq / OpenAI

✔️ URL or base64 image input

✔️ Context-aware: decides if the image is meaningful vs decorative (alt="")

✔️ JSON output for easy automation + CI

✔️ Works standalone (integration also with wick-a11y is planned for the future)


## Compatibility

| Area | Supported |
|------|-----------|
| **Node** | 18+ |
| **AI models** | See below |
| **Cypress** | 15.7.0+ (tested with `^15.7.0`) - Only to run the Cypress test in the package|

### AI models supported (current)

- **OpenAI** — `gpt-4o-mini` (default), `gpt-4o` 
- **Google AI (Gemini)** — `gemini-2.5-flash` (default), `gemini-2.5-pro`, `gemini-3-flash-preview`
- **Groq (Llama vision)** — `meta-llama/llama-4-scout-17b-16e-instruct` (default), `meta-llama/llama-4-maverick-17b-128e-instruct`

You can override the default model via the `overrides` parameter when calling each provider’s API.

> Some other models are also supported but they were not tested,


## Installation and Configuration

1. **Install plugin** in the project:

    ```bash
    npm wick-a11y-altai
    ```

2. **Import the package** in your tests:

    ```js
    import 'wick-a11y-altai';
    ```
    
    > If you are using this in a Cypress project, you can import it in the `cypress/support/e2e.js` file or directly in your test file.

3. **Configure environment variables**:

    | Env var                       | Type                   | Default   | Description                                                         |
    |-------------------------------|------------------------|-----------|---------------------------------------------------------------------|
    | `GOOGLE_AI_API_KEY`           | `string`               |     -     | (Required) Google AI API key for LLM workflows.                     |
    | `GROQ_AI_API_KEY`             | `string`               |     -     | (Required) Groq AI API key for LLM workflows.                       |
    | `OPENAI_API_KEY`              | `string`               |     -     | (Required) OpenAI API key for LLM workflows.                        |

    > If you are using this in a Cypress project, set these keys in your `cypress.env.json` file.
    >
    >Example `cypress.env.json`:
    >
    >```json
    >{
    >  "GOOGLE_AI_API_KEY": "<Your Google AI API key>",
    >  "GROQ_AI_API_KEY": "<Your Groq AI API key>",
    >  "OPENAI_API_KEY": "<Your OpenAI API key>"
    >}
    >```


## API

These functions are the public entry points for using wick-a11y-altai as a plugin in other projects. Each returns AI-generated alt-text recommendations (or an error) and supports the same input shape.

**Import from the package:**

```js
import {
  getImageAltTextGoogleAI,
  getImageAltTextGroqAIOpenAI,
  getImageAltTextOpenAI,
} from 'wick-a11y-altai';
```

---

### `getImageAltTextGoogleAI(input, overrides?)`

Uses **Google AI (Gemini)** to analyze an image and suggest alt text. Requires `GOOGLE_AI_API_KEY` in your environment (e.g. Cypress `env` or `process.env`).

| Parameter   | Type   | Required | Description |
|------------|--------|----------|-------------|
| `input`    | `string` or `object` | Yes | Image URL string, or an object (see [Input shape](#input-shape)). |
| `overrides`| `object` | No  | Optional model options: `model`, `role`, `temperature`, `maxOutputTokens`, `responseMimeType`. |

**Returns:** `Promise<AltTextResult>` — On success: `{ model, tokens, totalTime, info, imageTransport }`. On validation error: `{ error: string }`.

---

### `getImageAltTextGroqAIOpenAI(input, overrides?)`

Uses **Groq** (OpenAI-compatible API) to analyze an image and suggest alt text. Requires `GROQ_AI_API_KEY` in your environment.

| Parameter   | Type   | Required | Description |
|------------|--------|----------|-------------|
| `input`    | `string` or `object` | Yes | Image URL string, or an object (see [Input shape](#input-shape)). |
| `overrides`| `object` | No  | Optional model options: `model`, `role`, `temperature`, `max_completion_tokens`, `response_format`, `baseURL`. |

**Returns:** `Promise<AltTextResult>` — Same shape as `getImageAltTextGoogleAI`.

> ⚠️ In this initial version, the OpenAI instance is created with `dangerouslyAllowBrowser: true` enabled.

---

### `getImageAltTextOpenAI(input, overrides?)`

Uses **OpenAI** to analyze an image and suggest alt text. Requires `OPENAI_API_KEY` in your environment.

| Parameter   | Type   | Required | Description |
|------------|--------|----------|-------------|
| `input`    | `string` or `object` | Yes | Image URL string, or an object (see [Input shape](#input-shape)). |
| `overrides`| `object` | No  | Optional model options: `model`, `role`, `temperature`, `max_completion_tokens`, `response_format`. |

**Returns:** `Promise<AltTextResult>` — Same shape as `getImageAltTextGoogleAI`.

> ⚠️ In this initial version, the OpenAI instance is created with `dangerouslyAllowBrowser: true` enabled.

---

### Input shape

`input` can be:

- **String:** A single image URL.  
  Example: `"https://example.com/image.jpg"`

- **Object:** More control over context and transport:
  - `imageUrl` (string, required) — Image URL.
  - `context` (string, optional) — Surrounding page/section context for the model.
  - `code` (string, optional) — HTML/snippet context (e.g. the `<img>` or parent markup).
  - `imageTransport` (`'url'` \| `'base64'`, optional) — Send the image by URL or as base64; default is provider-specific.

Example:

```js
await getImageAltTextOpenAI({
  imageUrl: 'https://example.com/hero.png',
  context: 'Hero banner on the pricing page',
  code: '<img src="hero.png" />',
});
```

---

### Result shape

- **Success:** `{ info, model, tokens, totalTime, imageTransport }`
  - **`info`** — Parsed JSON from the model, matching the shape requested by the alt-text prompt:
    - **`alt`** (string, required) — Recommended alternative text. May be `""` for decorative images.
    - **`decorative_reason`** (string, optional) — Short explanation when the image is decorative (present when `alt === ""`).
    - **`long_description`** (array of strings, optional) — For complex images (chart, infographic, map, diagram): 3–8 bullet-style strings summarizing key data, trends, or labels.
    - **`confidence`** (string, optional) — One of `"low"`, `"medium"`, or `"high"`. Indicates how confident the model is in the recommendation; if purpose is unclear, the model returns a descriptive alt and `confidence: "low"`.
  - **`model`** (string) — Identifier of the AI model used (e.g. `gpt-4o-mini`, `gemini-2.5-flash`).
  - **`tokens`** (number) — Total tokens consumed for the request (input + output).
  - **`totalTime`** (number) — Elapsed time in milliseconds from request start to response.
  - **`imageTransport`** (`'url'` | `'base64'`) — How the image was sent to the API (URL or base64).
- **Error (e.g. invalid input):** `{ error: "<message>" }`


## Usage

wick-a11y-altai is a **framework-agnostic** package: each API function returns a **Promise**, so you can use it from Cypress, Node scripts, or any other tool that supports async/await or Promises. The examples below show Cypress (e2e) and standalone usage.

---

### In Cypress (e2e)

Import the provider you need, call it with an image URL (or an input object), and wrap the Promise in `cy.wrap()` so Cypress waits for the result. Use a generous timeout because the AI call can take several seconds.

**Example: Google AI (Gemini)**

```js
import { getImageAltTextGoogleAI } from 'wick-a11y-altai';

it('gets alt text for an image', () => {
  const imageUrl = 'https://example.com/image.jpg';
  const context = 'Hero image on the billing page';
  const imageTransport = 'url'; // or 'base64'

  cy.wrap(
    getImageAltTextGoogleAI(
      { imageUrl, context, imageTransport },
      { model: 'gemini-2.5-flash' }
    ),
    { timeout: 20000, log: false }
  ).then((result) => {
    if (result.error) throw new Error(result.error);
    cy.log('Alt recommendation:', JSON.stringify(result.info));
    // result: { model, tokens, totalTime, info, imageTransport }
  });
});
```

**Example: Groq AI (OpenAI-compatible API)**

```js
import { getImageAltTextGroqAIOpenAI } from 'wick-a11y-altai';

cy.wrap(
  getImageAltTextGroqAIOpenAI(
    { imageUrl, context, code, imageTransport },
    { model: 'meta-llama/llama-4-scout-17b-16e-instruct' }
  ),
  { timeout: 20000, log: false }
).then((result) => {
  if (result.error) throw new Error(result.error);
  cy.log('Alt recommendation:', JSON.stringify(result.info));
});
```

**Example: OpenAI**

```js
import { getImageAltTextOpenAI } from 'wick-a11y-altai';

cy.wrap(getImageAltTextOpenAI(imageUrl), { timeout: 20000, log: false })
  .then((result) => {
    if (result.error) throw new Error(result.error);
    cy.log('Alt recommendation:', result.info);
  });
```

In Cypress, set `GOOGLE_AI_API_KEY`, `GROQ_AI_API_KEY`, and/or `OPENAI_API_KEY` in `cypress.env.json` (see [Configuration](#installation-and-configuration)).

---

### Standalone (Node or other tools)

Use the same imports and call the functions with `await`. Ensure the required API key(s) are set in your environment (e.g. `process.env`) for the provider(s) you use.

```js
import {
  getImageAltTextGoogleAI,
  getImageAltTextGroqAIOpenAI,
  getImageAltTextOpenAI,
} from 'wick-a11y-altai';

// Simple: URL only
const result = await getImageAltTextOpenAI('https://example.com/photo.jpg');
if (result.error) console.error(result.error);
else console.log(result.info);

// With context and model override
const result2 = await getImageAltTextGoogleAI(
  {
    imageUrl: 'https://example.com/banner.png',
    context: 'Decorative banner on the pricing page',
    imageTransport: 'base64',
  },
  { model: 'gemini-2.5-pro' }
);
console.log(result2.info);
```

You can use these functions in Node scripts, CI jobs, or other test runners (e.g. Jest, Mocha) the same way.


## License

Released under the [MIT License](LICENSE).


## Contributing

Contributions are welcome! If you find a bug or want to propose an improvement:

1. Open an issue describing the motivation and expected behavior.
2. Fork the repo and create a branch: `git checkout -b feat/my-improvement`.
3. Run the Cypress suite you care about with the audit enabled to validate changes.
4. Submit a PR referencing the issue. Please include screenshots of the report if the UI changes.


## Changelog

- **1.0.0** – Initial release.

