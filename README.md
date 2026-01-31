This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google Sheets Setup

To make the survey submission work, you need to set up a Google Service Account and share the target Google Sheet with it.

1. **Create a Google Service Account:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Enable the **Google Sheets API** and **Google Drive API**.
   - Go to "Credentials" -> "Create Credentials" -> "Service Account".
   - Give it a name and create it.
   - Go to the "Keys" tab of the service account and create a new JSON key. Download it.

2. **Configure Environment Variables:**
   - Rename `.env.local.example` to `.env.local`.
   - Open the downloaded JSON key file.
   - Copy the `client_email` to `GOOGLE_CLIENT_EMAIL`.
   - Copy the `private_key` to `GOOGLE_PRIVATE_KEY` (ensure the newlines are preserved or escaped as \n).
   - The `GOOGLE_SHEET_ID` is already set to the provided sheet.

3. **Share the Sheet:**
   - Open your Google Sheet: [https://docs.google.com/spreadsheets/d/1TFp_yMfoYzSf75e36WziDbucZGflOKYbWCEl7wIgB0A/edit](https://docs.google.com/spreadsheets/d/1TFp_yMfoYzSf75e36WziDbucZGflOKYbWCEl7wIgB0A/edit).
   - Click "Share".
   - Paste the `client_email` of your service account and give it **Editor** access.

Now the application can write to the sheet!
