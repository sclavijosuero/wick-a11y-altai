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

✔️ Works standalone or plugged into wick-a11y


## Compatibility

[...]


## Installation and Configuration

1. **Install plugin** in the project:

    ```bash
    npm wick-a11y-altai
    ```

2. **Import the package in your tests**:

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

---

### `getImageAltTextOpenAI(input, overrides?)`

Uses **OpenAI** to analyze an image and suggest alt text. Requires `OPENAI_API_KEY` in your environment.

| Parameter   | Type   | Required | Description |
|------------|--------|----------|-------------|
| `input`    | `string` or `object` | Yes | Image URL string, or an object (see [Input shape](#input-shape)). |
| `overrides`| `object` | No  | Optional model options: `model`, `role`, `temperature`, `max_completion_tokens`, `response_format`. |

**Returns:** `Promise<AltTextResult>` — Same shape as `getImageAltTextGoogleAI`.

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

[...]


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

