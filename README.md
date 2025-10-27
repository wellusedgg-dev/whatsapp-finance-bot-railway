# Iara IA – WhatsApp Bot

Bot de WhatsApp com WhatsApp Cloud API + OpenAI, pensado para deploy simples no **Bolt** (via GitHub).
Também funciona em outros provedores (Railway/Docker).

## ⚙️ Funcionalidades
- Webhook de verificação (`GET /webhook`) e recepção (`POST /webhook`)
- Resposta automática com IA (OpenAI) usando o modelo configurado em `OPENAI_MODEL`
- Endpoint de saúde (`GET /health`)
- Pronto para Bolt via GitHub

## 📦 Como usar (fluxo ZIP → GitHub → Bolt → WhatsApp)
1. **Crie um repositório no GitHub** e envie estes arquivos.
2. No **Bolt**, crie um novo app e conecte seu repositório do GitHub.
3. Em **Environment Variables** do Bolt, adicione:
   - `BOT_NAME` (ex.: "Iara IA")
   - `VERIFY_TOKEN`
   - `WHATSAPP_TOKEN`
   - `PHONE_NUMBER_ID`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (ex.: `gpt-4o` ou `gpt-4o-mini`)
4. Publique. Anote a **URL pública** do seu app (ex.: `https://seu-app.bolt.run`).
5. Em **Meta for Developers → WhatsApp → Configuration**:
   - **Callback URL**: `https://SEU-DOMINIO/webhook`
   - **Verify Token**: o mesmo do `.env`
   - Assine ao menos o evento **messages**
6. **Teste**: envie mensagem para o número do WhatsApp Cloud configurado.

## 🔐 Variáveis (.env)
Veja `.env.example`.

## 🧩 Rotas
- `GET /` – Mensagem simples
- `GET /health` – Status JSON
- `GET /webhook` – Verificação do Meta
- `POST /webhook` – Recebe mensagens
