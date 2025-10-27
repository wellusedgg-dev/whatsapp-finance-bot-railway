import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.WHATSAPP_TOKEN; // Permanent/long-lived token
const phoneNumberId = process.env.PHONE_NUMBER_ID; // From Meta > WhatsApp > Phone Number ID

export async function sendWhatsAppText(to, text) {
  if (!token || !phoneNumberId) {
    console.error("[Meta] Missing WHATSAPP_TOKEN or PHONE_NUMBER_ID");
    return;
  }
  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text }
  };

  try {
    const res = await axios.post(url, payload, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      timeout: 20000
    });
    return res.data;
  } catch (err) {
    console.error("[Meta] send error:", err?.response?.data || err.message);
    throw err;
  }
}
