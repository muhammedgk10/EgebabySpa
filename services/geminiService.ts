import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Robustly retrieve API Key.
// Tarayıcı ortamında 'process' tanımlı olmayabilir hatasını önlemek için try-catch bloğu ve kontrol eklendi.
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

const SYSTEM_INSTRUCTION = `
Sen Ege Baby Spa'nın sanal asistanısın. Nazik, yardımsever ve bebek sağlığı konusunda bilinçli bir dil kullan.
Adın "Ege Asistan".
Şu konularda bilgi verebilirsin:
1. Bebek Spası (Hidroterapi): Suyun bebeklerin kas gelişimine, gaz sancısına ve uykusuna faydaları.
2. Bebek Masajı: Rahatlama, bağ kurma ve kolik ağrılarını azaltma.
3. Floating: Bebeğin suda özgürce hareket etmesi.

Fiyat bilgisi sorulursa "En güncel fiyat paketlerimiz için lütfen 0555 555 55 55 numaralı telefondan bize ulaşın veya randevu formunu doldurun." de.
Tıbbi tavsiye verme, sadece spa hizmetlerinin genel faydalarından bahset. Her zaman ebeveynleri çocuk doktorlarına danışmaya teşvik et.
Cevapların kısa, net ve emojilerle samimi olsun.
`;

export const createChatSession = (): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Üzgünüm, şu an cevap veremiyorum.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string | null> => {
  // Her istekte API key kontrolü yap (Key değişirse diye)
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
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
          {
            inlineData: {
              data: data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};