This is a full=stack Next.js project which implements the OpenAI API to run queries and recieve response from chatgpt.
## Getting Started

First, install required dependencies. Then, run the development server:

```bash
npm install
npm run dev
```
### this app uses the following:
Next.js - javascript frontend-backend 
TypeScript - Type safety
Stripe - payment processing
Clerk - Auth
Vercel - serverless/edge hosting
OpenAI - AI chat completions
PlanetScale - Database
Drizzle ORM - Object Relational Model


## Migrating from dev for production
follow these instructions and you'll get far
### {stripe}
-copy stripe test products and prices to live mode
-gather price_ids for objects > vercel .env
priceid_1000=price_xxx
priceid_5000=price_xxx
priceid_15000= price_xxx 
STRIPE_SECRET_KEY=sk_live_xxx
endpointSecret= whsec_xxx
-update stripe wenhook endpoints
### {clerk}
-update clerk wenhook endpoints:  https://dashboard.clerk.com/ > app > configure > webhooks > add endpoint {host}/api/webhooks/clerk 
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= 
CLERK_SECRET_KEY= 
CLERK_WEBHOOK_SECRET= 
- VERCEL_URL should update itself
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
### {planetscale}
https://app.planetscale.com/ai-blog-generator/users
-update variables for PRODUCTION instance of planetscale, or upgrade db to PRODUCTION
DATABASE_HOST=aws.connect.psdb.cloud
DATABASE_USERNAME= 
DATABASE_PASSWORD= 
DATABASE_URL= 
### {OPENAI}
- https://platform.openai.com/api-keys
OPENAI_API_KEY =
### {defaults}
defaultUserTokens=500
defaultArticleLength=2000
### {google search console}
get Client ID
set redirect domain
### {when switchin domains}
set google dev console redirect domain https://console.cloud.google.com/apis/credentials/
update clerk wenhook endpoints:  https://dashboard.clerk.com/ > app > configure > webhooks > add endpoint {host}/api/webhooks/clerk 
-update clerk redirect urls
-update stripe wenhook endpoints
-update stripe business url
-link domain to vercel
-assign vercel domain
update stripe email domains https://dashboard.stripe.com/settings/emails

## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
