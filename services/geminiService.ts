
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UntranslatableWord } from '../types';
import { BOOK_WORDS_JSON } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING, description: "The romanized word." },
    native_script: { type: Type.STRING, description: "The word in its native script. Can be null or an empty string if not applicable." },
    pronunciation: { type: Type.STRING, description: "A user-friendly, syllable-based phonetic guide to help with pronunciation (e.g., 'ko-mo-reh-bee')." },
    definition: { type: Type.STRING, description: "The detailed meaning of the word." },
    origin_country: { type: Type.STRING, description: "The country or region of origin." },
    origin_language: { type: Type.STRING, description: "The language of origin." },
    theme: { type: Type.STRING, description: "The theme from the book this word belongs to (e.g., 'Comforts of Connection'). This MUST be one of the themes present in the source JSON." },
    reasoning: { type: Type.STRING, description: "A brief, empathetic explanation of why this word was chosen for the user's feeling. Address the user directly ('This word was chosen because...')." }
  },
  required: ["word", "pronunciation", "definition", "origin_country", "origin_language", "theme", "reasoning"]
};


export const findWordForFeeling = async (feeling: string): Promise<UntranslatableWord> => {
  const prompt = `
    You are an empathetic linguist and the digital companion to the book 'Other-Wordly'. 
    Your task is to help a user find the perfect, single word for their complex emotion from a curated list.
    Analyze the user's feeling described below and select the most fitting word from the provided BOOK_WORDS_JSON.
    
    For the 'pronunciation' field, provide a simple, user-friendly, syllable-based phonetic guide (e.g., 'ko-mo-reh-bee'). Break down the word clearly to make it easy for someone to say aloud.

    Respond ONLY with a single JSON object that matches the requested schema. Do not add any extra text, markdown, or apologies.

    USER'S FEELING: "${feeling}"

    BOOK_WORDS_JSON:
    ${BOOK_WORDS_JSON}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const text = response.text.trim();
    const parsedJson = JSON.parse(text);

    return parsedJson as UntranslatableWord;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("The AI returned a response that wasn't in the correct format. Please try rephrasing your feeling.");
    }
    throw new Error("Could not find a word for that feeling. The AI may be experiencing issues. Please try again later.");
  }
};

export const generateImageForDefinition = async (definition: string, theme: string): Promise<string> => {
    const prompt = `
      Create a minimal, abstract watercolour painting representing the feeling of: "${definition}".
      Aesthetic: Serene, atmospheric, dreamlike, calming and soft color palette. Focus on light washes of color and soft edges.
      The theme is '${theme}'. The image should be abstract and evocative, not literal.
    `;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '3:4',
            },
        });
        
        const base64ImageBytes: string | undefined = response.generatedImages?.[0]?.image?.imageBytes;

        if (!base64ImageBytes) {
            throw new Error("No image bytes returned from API.");
        }

        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch(error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to create an artistic background. The image generator might be busy.");
    }
}
