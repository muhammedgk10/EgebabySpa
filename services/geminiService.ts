
import { GoogleGenAI, Chat, GenerateContentResponse, FunctionDeclaration, Type } from "@google/genai";

// Robustly retrieve API Key.
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    return '';
  } catch (e) {
    return '';
  }
};

const API_KEY = getApiKey();

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    client = new GoogleGenAI({ apiKey: API_KEY });
  }
  return client;
};

// --- SYSTEM PROMPT WITH RICH DATA ---
const PACKAGE_DATA = `
1. İlk Dokunuş Paketi: ₺750 - 45 Dakika. (20 Dk Hidroterapi, 20 Dk Masaj, Gelişim Takibi). 0-12 ay için.
2. Rahatla & Büyü Paketi: ₺2.800 - 4 Seans. (Her seans 45-60 dk, Gaz masajı eğitimi dahil). 2-18 ay için. En popüler paket.
3. Kardeş Paketi: ₺1.350 - 60 Dakika. İki bebek için. (Jakuzi keyfi, masaj). 0-24 ay.
4. VIP Spa Deneyimi: ₺1.500 - 90 Dakika. (Özel oda, aromaterapi, ebeveyn çayı, fotoğraf albümü).
5. Sadece Hidroterapi: ₺500 - 30 Dk.
6. Sadece Bebek Masajı: ₺400 - 30 Dk.
`;

const SYSTEM_INSTRUCTION = `
Sen Ege Baby Spa'nın profesyonel ve sıcakkanlı sanal asistanısın. Adın "Ege Asistan".
Amacın ebeveynlerin sorularını yanıtlamak ve onları randevu almaya yönlendirmek.

BİLGİ BANKASI:
${PACKAGE_DATA}

KURALLAR:
1. Nazik, empatik ve güven veren bir dil kullan (Örn: "Bebeğinizin rahatlaması bizim için çok önemli").
2. Fiyat sorulduğunda yukarıdaki listeden net bilgi ver.
3. Eğer kullanıcı randevu almak isterse, bir paketi seçmek isterse veya "nasıl kayıt olurum" derse, MUTLAKA "openBookingModal" aracını (function) çağır.
4. Eğer kullanıcı belirli bir paketten bahsediyorsa (örneğin "Kardeş paketi istiyorum"), aracı çağırırken "serviceName" parametresine paket adını ekle.
5. Tıbbi tavsiye verme (Kolik, gaz sancısı gibi konularda "rahatlatıcı etkisi vardır" de, "tedavi eder" deme).
6. Emojileri dozunda kullan (🌿, 💧, 👶).
`;

// --- FUNCTION DECLARATIONS (TOOLS) ---
const openBookingTool: FunctionDeclaration = {
  name: "openBookingModal",
  description: "Kullanıcı randevu almak istediğinde veya bir paket seçtiğinde randevu formunu açar.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      serviceName: {
        type: Type.STRING,
        description: "Kullanıcının seçtiği veya bahsettiği hizmetin adı (örn: 'İlk Dokunuş Paketi', 'Kardeş Paketi').",
      },
    },
  },
};

export const createChatSession = (): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ functionDeclarations: [openBookingTool] }],
    },
  });
};

export interface ChatResponse {
  text: string;
  action?: 'openBooking';
  actionParams?: { serviceName?: string };
}

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<ChatResponse> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    
    let resultText = response.text || "Size şu an yardımcı olamıyorum, lütfen telefonla ulaşın.";
    let action: ChatResponse['action'] | undefined;
    let actionParams: ChatResponse['actionParams'] | undefined;

    // Check for function calls
    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === 'openBookingModal') {
        action = 'openBooking';
        actionParams = call.args as { serviceName?: string };
        
        // If the model didn't provide text along with the function call (it happens), add a default message.
        if (!response.text) {
          resultText = "Harika! Sizin için randevu ekranını açıyorum. 🌿";
        }
      }
    }

    return {
      text: resultText,
      action,
      actionParams
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Üzgünüm, bağlantısal bir sorun yaşıyorum. Lütfen 0555 555 55 55'i arayın." };
  }
};

// --- IMAGE PROMPT ENHANCER ---
export const enhancePrompt = async (shortPrompt: string): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert AI art prompt engineer. 
      Rewrite the following short description into a highly detailed, professional image generation prompt.
      Focus on lighting (e.g., cinematic, natural, studio), texture, depth of field, and mood.
      Keep the subject relevant to a Baby Spa context (water, relaxation, massage, happy babies).
      The output must be in English for better image generation results.
      
      Input: "${shortPrompt}"
      
      Output (just the prompt text):`,
    });
    return response.text?.trim() || shortPrompt;
  } catch (error) {
    console.error("Enhance Prompt Error:", error);
    return shortPrompt; // Fallback to original
  }
};

// --- IMAGE GEN & EDIT ---
export const generateImage = async (
  prompt: string, 
  size: '1K' | '2K' | '4K',
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' = '1:1'
): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: aspectRatio, imageSize: size } }
    });
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};

export const editImage = async (imageBase64: string, mimeType: string, prompt: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  try {
    const data = imageBase64.includes('base64,') ? imageBase64.split('base64,')[1] : imageBase64;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: data, mimeType: mimeType } },
          { text: prompt },
        ],
      },
    });
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};
