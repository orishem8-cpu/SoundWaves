export function telegramConfigured(){return Boolean(process.env.TELEGRAM_BOT_TOKEN&&process.env.TELEGRAM_CHAT_ID)}
// Telegram Bot API calls belong on the server. Validate and rate-limit user-submitted ticket content.
