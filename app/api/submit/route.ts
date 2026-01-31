
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { surveySchema } from "@/lib/schema";
import { SHEET_HEADERS } from "@/lib/constants";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate data against schema
        const result = surveySchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", details: result.error.format() },
                { status: 400 }
            );
        }

        const data = result.data;
        const timestamp = new Date().toISOString();

        // Get IP address
        let ip = req.headers.get("x-forwarded-for");
        if (ip && ip.includes(",")) {
            ip = ip.split(",")[0].trim();
        }
        // Fallback if not found (localhost/dev)
        if (!ip) ip = "unknown";


        // Prepare row data based on SHEET_HEADERS order
        const row = SHEET_HEADERS.map((header) => {
            if (header === "timestamp") return timestamp;
            // @ts-ignore - handled by type definition usually but dynamic key access
            if (header === "ip_address") return ip;
            // @ts-ignore - we know headers match schema keys mostly
            return data[header] || "";
        });

        const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL!;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")!;

        if (!spreadsheetId || !clientEmail || !privateKey) {
            console.error("Missing Google Sheets credentials");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: [
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/spreadsheets",
            ],
        });

        const sheets = google.sheets({ version: "v4", auth });

        // Check for duplicate IP? The user asked to "make sure that we only count one response per ip address at the end".
        // This implies we should check EXISTING responses. Reading the whole sheet for each submission is heavy but feasible for small scale.
        // Or we just collect it and filter later? The user said "at the end", implying post-processing or check-on-submit.
        // "makes sure that we only count one response per ip adress at the end" -> usually means "prevent duplicate submissions".
        // Let's implement a check.

        // Duplicate check REMOVED per user request.
        // We allow multiple submissions from the same IP (e.g. shared devices).
        // IP is still recorded in the sheet for manual filtering if needed.

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Sheet1!A:A", // Append to the first sheet
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [row],
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error submitting to Google Sheets:", error);
        return NextResponse.json(
            { error: `Server Error: ${error.message || "Unknown error"}` },
            { status: 500 }
        );
    }
}
