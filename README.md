# wick-a11y-altai

Framework-agnostic library that analyzes images and their context using AI to recommend the most appropriate text alternative for screen readers—meaningful alt text or `alt=""` when the image is purely decorative. Use it as a **library** in Node, Playwright, or other JS packages, or wire it into **Cypress** via a task so API calls run in Node (no CORS). Multiple providers: **Google AI (Gemini)**, **Groq**, **OpenAI**, **Fireworks AI**.

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

✔️ **Framework-agnostic** — Use as a library (`wick-a11y-altai` or `wick-a11y-altai/run`) or plug into Cypress/Playwright  
✔️ **Multi-provider** — Google AI (Gemini), Groq, OpenAI, Fireworks AI  
✔️ **URL or base64** image input  
✔️ **Context-aware** — Decides meaningful vs decorative (`alt=""`)  
✔️ **JSON output** for automation and CI  
✔️ **Cypress** — Optional task so AI runs in Node (avoids CORS)

## Compatibility

| Area | Supported |
|------|------------|
| **Node** | 18+ |
| **AI models** | See below |
| **Cypress** | 15.7.0+ (optional; only if you use the Cypress task) |

### AI models supported (current)

- **Google AI (Gemini)** — `gemini-2.5-flash` (default), `gemini-2.5-flash-lite`, `gemini-2.5-pro`
- **Groq (Llama vision)** — `meta-llama/llama-4-scout-17b-16e-instruct` (default), `meta-llama/llama-4-maverick-17b-128e-instruct`
- **OpenAI** — `gpt-4o-mini` (default), `gpt-4o`
- **Fireworks AI** — `accounts/fireworks/models/qwen2p5-vl-7b-instruct`, `accounts/fireworks/models/kimi-k2p5`, `accounts/fireworks/models/phi-3-vision-128k-instruct`

Override the default model via the `overrides` parameter when calling each provider.

## Installation

```bash
npm install wick-a11y-altai
```

## Configuration

### Environment variables (API keys)

| Env var | Required for | Description |
|---------|----------------|-------------|
| `GOOGLE_AI_API_KEY` | Google AI (Gemini) | [Google AI Studio](https://aistudio.google.com/apikey) |
| `GROQ_AI_API_KEY`   | Groq              | [Groq Console](https://console.groq.com/) |
| `OPENAI_API_KEY`    | OpenAI            | [OpenAI API keys](https://platform.openai.com/api-keys) |
| `FIREWORKS_AI_API_KEY` | Fireworks AI   | [Fireworks AI](https://fireworks.ai/) |

Set these in your shell, `.env`, or (for Cypress) in `cypress.env.json` (see [Cypress usage](#in-cypress)).

### Cypress: wire the task (optional)

If you use Cypress and want `cy.task('getImageAltText', ...)` so the AI call runs in **Node** (avoids CORS), register the task in `cypress.config.js`:

```js
const { defineConfig } = require("cypress");
// In a project that has wick-a11y-altai installed:
const altaiRun = import("wick-a11y-altai/run");
// When developing this repo: import("./src/run.js")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return altaiRun.then((m) => {
        on("task", {
          getImageAltText(payload) {
            return m.getImageAltText(payload.provider, payload.input, payload.overrides ?? {});
          },
        });
        return config;
      });
    },
  },
});
```

## API

Two ways to call the providers:

1. **Direct provider functions** — Import from `wick-a11y-altai` and call e.g. `getImageAltTextGoogleAI(input, overrides)`.
2. **Unified runner** — Import `getImageAltText` from `wick-a11y-altai/run` and call `getImageAltText(provider, input, overrides)`. Use this in Node, Playwright, or as the implementation of a Cypress task.

---

### Entry: `wick-a11y-altai` (providers)

**Import:**

```js
import {
  getImageAltTextGoogleAI,
  getImageAltTextGroqAIOpenAI,
  getImageAltTextOpenAI,
  getImageAltTextFireworksAIOpenAI,
} from 'wick-a11y-altai';
```

| Function | Provider | API key env |
|----------|----------|-------------|
| `getImageAltTextGoogleAI(input, overrides?)` | Google AI (Gemini) | `GOOGLE_AI_API_KEY` |
| `getImageAltTextGroqAIOpenAI(input, overrides?)` | Groq | `GROQ_AI_API_KEY` |
| `getImageAltTextOpenAI(input, overrides?)` | OpenAI | `OPENAI_API_KEY` |
| `getImageAltTextFireworksAIOpenAI(input, overrides?)` | Fireworks AI | `FIREWORKS_AI_API_KEY` |

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `input` | `string` or `object` | Yes | Image URL string, or object: `{ imageUrl, context?, code?, imageTransport? }`. |
| `overrides` | `object` | No | Model options: `model`, `apiKey`, and provider-specific fields (e.g. `temperature`, `max_completion_tokens`). |

**Returns:** `Promise<AltTextResult>` — On success: `{ model, tokens, totalTime, info, imageTransport }`. On error: `{ error: string }`.

---

### Entry: `wick-a11y-altai/run` (unified runner)

Use this in Node, Playwright, or to implement a Cypress task. Runs the chosen provider in Node (no browser CORS).

**Import:**

```js
import { getImageAltText } from 'wick-a11y-altai/run';
```

**`getImageAltText(provider, input, overrides?)`**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `provider` | `string` | Yes | Name of the function exported from the main package, e.g. `'getImageAltTextGoogleAI'`, `'getImageAltTextFireworksAIOpenAI'`. |
| `input` | `object` | Yes | `{ imageUrl, context?, code?, imageTransport? }`. |
| `overrides` | `object` | No | Provider options (e.g. `model`, `apiKey`). |

**Returns:** `Promise<AltTextResult>` — Same shape as the provider functions, or `{ error: string }` if `provider` is unknown.

**Example (Node / Playwright):**

```js
const result = await getImageAltText(
  'getImageAltTextGoogleAI',
  { imageUrl: 'https://example.com/hero.png', context: 'Hero on pricing page', imageTransport: 'url' },
  { apiKey: process.env.GOOGLE_AI_API_KEY, model: 'gemini-2.5-flash' }
);
```

---

### Input shape

`input` can be:

- **String** — A single image URL. Example: `"https://example.com/image.jpg"`
- **Object** — More control:
  - `imageUrl` (string, required) — Image URL.
  - `context` (string, optional) — Page/section context for the model.
  - `code` (string, optional) — HTML/snippet (e.g. the `<img>` markup).
  - `imageTransport` (`'url'` | `'base64'`, optional) — Send image by URL or base64; default `'url'`.

---

### Result shape

- **Success:** `{ info, model, tokens, totalTime, imageTransport }`
  - **`info`** — Parsed JSON from the model:
    - **`alt`** (string) — Recommended alternative text; may be `""` for decorative images.
    - **`decorative_reason`** (string, optional) — When `alt === ""`, short explanation.
    - **`long_description`** (array of strings, optional) — For complex images (chart, map, diagram).
    - **`confidence`** (string, optional) — `"low"` | `"medium"` | `"high"`.
  - **`model`** (string) — Model used (e.g. `gemini-2.5-flash`).
  - **`tokens`** (number) — Tokens consumed.
  - **`totalTime`** (number) — Elapsed time in milliseconds.
  - **`imageTransport`** — `'url'` or `'base64'`.
- **Error:** `{ error: "<message>" }`

## Usage

### In Cypress

1. Wire the task in `cypress.config.js` as in [Configuration](#cypress-wire-the-task-optional).
2. In tests, call the task with the provider name and pass API key via `overrides` (or from `Cypress.env()`).

**Example: Google AI (Gemini)**

```js
const GOOGLE_AI_API_KEY = Cypress.env('GOOGLE_AI_API_KEY');

cy.task(
  'getImageAltText',
  {
    provider: 'getImageAltTextGoogleAI',
    input: { imageUrl, context, code, imageTransport: 'url' },
    overrides: { model: 'gemini-2.5-flash', apiKey: GOOGLE_AI_API_KEY },
  },
  { timeout: 30000 }
).then((result) => {
  if (result?.error) throw new Error(result.error);
  cy.log('Alt recommendation:', JSON.stringify(result.info));
});
```

**Example: Fireworks AI**

```js
cy.task(
  'getImageAltText',
  {
    provider: 'getImageAltTextFireworksAIOpenAI',
    input: { imageUrl, context, code, imageTransport: 'url' },
    overrides: { model: 'accounts/fireworks/models/kimi-k2p5', apiKey: Cypress.env('FIREWORKS_AI_API_KEY') },
  },
  { timeout: 30000 }
).then((result) => {
  if (result?.error) throw new Error(result.error);
  cy.log('Alt recommendation:', JSON.stringify(result.info));
});
```

**Cypress env example** (`cypress.env.json`):

```json
{
  "GOOGLE_AI_API_KEY": "<your-key>",
  "GROQ_AI_API_KEY": "<your-key>",
  "OPENAI_API_KEY": "<your-key>",
  "FIREWORKS_AI_API_KEY": "<your-key>"
}
```

### As a library (Node, Playwright, scripts)

Use the **unified runner** so the call runs in Node (no browser):

```js
import { getImageAltText } from 'wick-a11y-altai/run';

const result = await getImageAltText(
  'getImageAltTextGoogleAI',
  {
    imageUrl: 'https://example.com/banner.png',
    context: 'Decorative banner on pricing page',
    imageTransport: 'url',
  },
  { apiKey: process.env.GOOGLE_AI_API_KEY, model: 'gemini-2.5-flash' }
);

if (result.error) console.error(result.error);
else console.log(result.info);
```

Or call a **provider directly** from the main package:

```js
import { getImageAltTextGoogleAI } from 'wick-a11y-altai';

const result = await getImageAltTextGoogleAI(
  { imageUrl: 'https://example.com/photo.jpg', context: 'Hero image' },
  { model: 'gemini-2.5-flash' }
);
```

## License

Released under the [MIT License](LICENSE).

## Contributing

Contributions are welcome:

1. Open an issue describing the motivation and expected behavior.
2. Fork the repo and create a branch: `git checkout -b feat/my-improvement`.
3. Run the Cypress suite to validate changes.
4. Submit a PR referencing the issue.

## Changelog

- **1.0.0** – Initial release. Framework-agnostic library; optional Cypress task; providers: Google AI, Groq, OpenAI, Fireworks AI.
