# IoT-pot monitoring app

The monitoring-app is a [Next.js](https://nextjs.org) app hosted on [Vercel](https://iot-pot.com). The app is deployed from JYU Gitlab to Vercel. This app uses the Next.js [App-router](https://nextjs.org/docs/app). Drizzle ORM is used for connecting and using the PostgreSQL database, which is provided by Neon. Auth0 is used for user management and access control. Notification emails are sent via Mailgun.

## Project structure

[./db](./db) and [./drizzle](./drizzle) contain all the DB and Drizzle ORM related code

[./public](./public) contains static files

[./src](./src) contains all the code

[./src/app/api/](./src/app/api/) contains all API routes

[./src/app/components/](./src/app/components/) contains React components

[./src/app/contexts/](./src/app/contexts/) contains React contexts

[./src/app/globals.css](./src/app/globals.css) contains global css styles

[./src/types/index.ts](./src/types/index.ts) contains all the TS type definitions

[./src/utils/index.ts](./src/utils/index.ts) contains utility functions

## Local development

Make sure you have a local .env file called `.env.local` in the root of [monitoring-app]. Environment variables are defined in the Vercel project and they can be downloaded for local development using the Vercel CLI and running the command:

```bash
vercel env pull
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the development version of the app.

## Version control and deploying to production

The JYU Gitlab is used for version control, the app is deployed to Vercel using the JYU Gitlab CI/CD pipeline. See [./gitlab-ci.yml](./gitlab-ci.yml) for details. The `main` branch is always deployed to the URL [https://iot-pot.com](https://iot-pot.com). When developing new features, please create a new feature branch using the `main` branch as the base. When done, push the new branch to Gitlab and create a Merge Request to merge the new feature into the main branch.
