
import { google } from "googleapis";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { SHEET_HEADERS } from "../lib/constants";

// Load env
const envLocalPath = path.resolve(process.cwd(), ".env.local");
dotenv.config({ path: envLocalPath });

async function updateHeaders() {
    console.log("🚀 Starting Sheet Header Update...");

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !spreadsheetId) {
        throw new Error("Missing Google credentials in .env.local");
    }

    const auth = new google.auth.GoogleAuth({
        credentials: { client_email: clientEmail, private_key: privateKey },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    console.log("📝 Overwriting Row 1 with correct headers...");
    console.log(`Headers count: ${SHEET_HEADERS.length}`);

    try {
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: "Sheet1!1:1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [SHEET_HEADERS],
            },
        });

        console.log("✅ Headers updated successfully!");
    } catch (error) {
        console.error("❌ Failed to update headers:", error);
        process.exit(1);
    }
}

updateHeaders().catch(console.error);
