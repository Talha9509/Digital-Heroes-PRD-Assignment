import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: (process.env.NODE_ENV ?? 'development') as
    | 'development'
    | 'production'
    | 'test',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  stripeSecretKey: requireEnv('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: requireEnv('STRIPE_WEBHOOK_SECRET'),
  stripePriceMonthly: requireEnv('STRIPE_PRICE_MONTHLY'),
  stripePriceYearly: requireEnv('STRIPE_PRICE_YEARLY'),
  frontendUrl: requireEnv('FRONTEND_URL'),
};