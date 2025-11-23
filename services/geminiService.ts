import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

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