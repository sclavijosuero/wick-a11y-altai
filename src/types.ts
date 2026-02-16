/**
 * Type definitions for AI provider modules: groqai, openai, googleai.
 * These types describe the exported functions and their parameters/return values.
 */

// ---------------------------------------------------------------------------
// Shared input/output types
// ---------------------------------------------------------------------------

/** Image transport: URL or base64-encoded data */
export type ImageTransport = 'url' | 'base64';

/** Object form of alt-text request input */
export interface AltTextInput {
  imageUrl: string;
  context?: string;
  code?: string;
  imageTransport?: ImageTransport;
}

/** Input accepted by all getImageAltText* functions: string URL or options object */
export type AltTextInputParam = string | AltTextInput;

/** Normalized result info: keys (e.g. "alt", "caption") with string values */
export interface AltTextInfo {
  alt: string;
  decorative_reason: string;
  long_description: string[];
  confidence: "low" | "medium" | "high";
}

/** Successful alt-text result from any provider */
export interface AltTextResultSuccess {
  info: AltTextInfo;
  model: string;
  tokens: number;
  totalTime: number;
  imageTransport: ImageTransport;
}

/** Error result when input normalization fails */
export interface AltTextResultError {
  error: string;
}

/** Result of getImageAltText* / computeAltTextOpenAI */
export type AltTextResult = AltTextResultSuccess | AltTextResultError;

// ---------------------------------------------------------------------------
// OpenAI / Groq model options (shared by openai and groqai)
// ---------------------------------------------------------------------------

export interface OpenAIModelOptions {
  model?: string;
  role?: string;
  temperature?: number;
  max_completion_tokens?: number;
  response_format?: { type: string };
}

/** Overrides passed to getImageAltTextOpenAI / getImageAltTextGroqAIOpenAI / computeAltTextOpenAI */
export type OpenAIOverrides = Partial<OpenAIModelOptions>;

// ---------------------------------------------------------------------------
// Google AI model options
// ---------------------------------------------------------------------------

export interface GoogleAIModelOptions {
  model?: string;
  role?: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
}

/** Overrides passed to getImageAltTextGoogleAI */
export type GoogleAIOverrides = Partial<GoogleAIModelOptions>;

// ---------------------------------------------------------------------------
// OpenAI client shape (minimal for computeAltTextOpenAI; OpenAI SDK compatible)
// ---------------------------------------------------------------------------

export interface OpenAIClientLike {
  chat: {
    completions: {
      create(options: unknown): Promise<unknown>;
    };
  };
}

// ---------------------------------------------------------------------------
// Exported function types: openai
// ---------------------------------------------------------------------------

/** getImageAltTextOpenAI – OpenAI API (src/openai/core.js) */
export type GetImageAltTextOpenAI = (
  input: AltTextInputParam,
  overrides?: OpenAIOverrides
) => Promise<AltTextResult>;

/** computeAltTextOpenAI – shared by OpenAI and Groq OpenAI-compatible (src/openai/core.js) */
export type ComputeAltTextOpenAI = (
  aiModel: OpenAIModelOptions,
  aiInstance: OpenAIClientLike,
  input: AltTextInputParam,
  overrides?: OpenAIOverrides
) => Promise<AltTextResult>;

// ---------------------------------------------------------------------------
// Exported function types: groqai
// ---------------------------------------------------------------------------

/** getImageAltTextGroqAIOpenAI – Groq via OpenAI API (src/groqai/core.js) */
export type GetImageAltTextGroqAIOpenAI = (
  input: AltTextInputParam,
  overrides?: OpenAIOverrides
) => Promise<AltTextResult>;

// ---------------------------------------------------------------------------
// Exported function types: googleai
// ---------------------------------------------------------------------------

/** getImageAltTextGoogleAI – Gemini via Google AI (src/googleai/core.js) */
export type GetImageAltTextGoogleAI = (
  input: AltTextInputParam,
  overrides?: GoogleAIOverrides
) => Promise<AltTextResult>;
