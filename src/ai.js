import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export const BOT_NAME = process.env.BOT_NAME || "Iara IA";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o"; // melhor modelo

// Tom da Iara IA
const SYSTEM_PROMPT = `
Você é a ${BOT_NAME}, uma assistente clara, objetiva e humana.
Responda sempre em português do Brasil.
Se o assunto for jurídico, traga base legal de forma simples.
Se for outro assunto, ajude da melhor forma, mas sempre com educação e empatia.
`;

export async function replyWithAI(userText, userName = "Cliente") {
  try {
    if (!OPENAI_API_KEY) {
      return "⚠️ OpenAI não configurado. Fale com o administrador.";
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Usuário: ${userName}\nMensagem: ${userText}` }
    ];

    const resp = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: OPENAI_MODEL,
        messages,
        temperature: 0.4
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = resp.data?.choices?.[0]?.message?.content?.trim();
    return text || "Não consegui gerar uma resposta agora.";
  } catch (err) {
    console.error("[AI] Error:", err?.response?.data || err.message);
    return "Tive um erro ao gerar a resposta. Tente novamente.";
  }
}
