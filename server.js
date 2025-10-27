import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { replyWithAI, BOT_NAME } from "./src/ai.js";
import { sendWhatsAppText } from "./src/meta.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "iara-verify-token";
const LOG_PREFIX = "[Iara IA Bot]";

app.use(bodyParser.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).send({ ok: true, service: "iara-ia-whatsapp-bot" });
});

// Webhook verification (GET)
app.get("/webhook", (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log(LOG_PREFIX, "Webhook verified.");
      res.status(200).send(challenge);
    } else {
      console.warn(LOG_PREFIX, "Webhook verification failed.", { mode, token });
      res.sendStatus(403);
    }
  } catch (e) {
    console.error(LOG_PREFIX, "Verification error:", e);
    res.sendStatus(500);
  }
});

// Webhook receiver (POST)
app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;
    // Acknowledge early to avoid timeouts
    res.sendStatus(200);

    const changes = data?.entry?.[0]?.changes?.[0];
    const messages = changes?.value?.messages;
    if (!messages || !Array.isArray(messages)) return;

    for (const msg of messages) {
      const from = msg.from; // user phone (International format)
      const name = msg?.profile?.name || "Cliente";
      const type = msg.type;
      let userText = "";

      if (type === "text") {
        userText = msg.text.body || "";
      } else if (type === "interactive") {
        const interactive = msg.interactive;
        if (interactive?.type === "button_reply") {
          userText = interactive.button_reply?.title || "";
        } else if (interactive?.type === "list_reply") {
          userText = interactive.list_reply?.title || "";
        }
      } else if (type === "image" || type === "audio" || type === "video" || type === "document") {
        userText = `[${type} recebido]`;
      } else {
        userText = "[mensagem recebida]";
      }

      const aiReply = await replyWithAI(userText, name);

      // Prefix optional bot name
      const finalText = aiReply?.startsWith(BOT_NAME) ? aiReply : `${BOT_NAME}: ${aiReply}`;

      await sendWhatsAppText(from, finalText);
    }
  } catch (e) {
    console.error(LOG_PREFIX, "Webhook handler error:", e);
    // Do not send response here (already acknowledged)
  }
});

// Root
app.get("/", (req, res) => {
  res.status(200).send("Iara IA – WhatsApp Bot online. Use /health para status.");
});

app.listen(PORT, () => {
  console.log(LOG_PREFIX, `Server listening on port ${PORT}`);
});
