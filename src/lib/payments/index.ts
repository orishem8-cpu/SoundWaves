export type PaymentProvider="yookassa"|"stripe";
export function paymentConfigured(provider:PaymentProvider){return provider==="yookassa"?Boolean(process.env.YOOKASSA_SHOP_ID&&process.env.YOOKASSA_SECRET_KEY):Boolean(process.env.STRIPE_SECRET_KEY&&process.env.STRIPE_WEBHOOK_SECRET)}
// Create payment intents only in a server route/action; never expose provider secrets to the browser.
