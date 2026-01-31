
import { google } from "googleapis";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { surveySchema } from "../lib/schema";
import { SHEET_HEADERS } from "../lib/constants";

// Load env
const envLocalPath = path.resolve(process.cwd(), ".env.local");
dotenv.config({ path: envLocalPath });

const API_URL = "http://localhost:3000/api/submit";

const MOCK_PAYLOAD = {
    member_status_check: "Yes",
    age_group: "25-34",
    gender: "Male",
    political_affiliation: "Somewhat conservative",
    marital_status: "Married",
    has_children: "Yes",
    number_of_children: "2",
    member_status: "Lifelong member (raised in the Church)",
    served_mission: "Yes",
    church_activity_level: "Attend weekly",
    geographic_region: "Utah",
    education_level: "Bachelor's degree",
    calling_type: "Clerk/Assistant",

    // Section 2A
    freq_pray: "Daily",
    freq_second_hour: "Weekly",
    freq_come_follow_me: "Weekly",
    freq_calling: "Weekly",
    freq_family_history: "Monthly",
    freq_scripture_study: "Daily",
    freq_temple: "Monthly",

    // Section 2B
    freq_bom: "Daily",
    freq_dc: "Weekly",
    freq_pgp: "Monthly",
    freq_ot: "Rarely",
    freq_nt: "Weekly",

    // Section 2C
    sat_prayer: "Satisfied",
    sat_second_hour: "Neutral",
    sat_come_follow_me: "Satisfied",
    sat_calling: "Very Satisfied",
    sat_family_history: "Neutral",
    sat_scripture_study: "Satisfied",
    sat_temple: "Very Satisfied",

    // Section 3
    belief_priesthood_ban_inspired: "Neutral/Unsure",
    belief_gender_eternal: "Strongly Agree",
    belief_sexual_relations_married_only: "Strongly Agree",
    belief_children_born_in_matrimony: "Strongly Agree",
    belief_happiness_through_christ: "Strongly Agree",
    belief_proclamation_inspired: "Strongly Agree",
    belief_abortion_church_position: "Agree",
    belief_tithing_commandment: "Strongly Agree",
    belief_wow_alcohol: "Strongly Agree",
    belief_wow_vaping: "Strongly Agree",
    belief_wow_marijuana: "Agree",
    belief_wow_coffee: "Agree",
    belief_wow_tea: "Agree",
    belief_wow_caffeine: "Neutral/Unsure",
    belief_bom_literal_history: "Strongly Agree",
    belief_ordinances_essential: "Strongly Agree",
    belief_prophets_can_err: "Agree",
    belief_revelation_allows_change: "Agree",
    belief_women_priesthood: "Disagree",
    belief_lgbtq_faithful_relationships: "Disagree",
    belief_progression_between_kingdoms: "Neutral/Unsure",

    // Section 4
    lifestyle_play_video_games: "Sometimes (Monthly)",
    lifestyle_watch_r_movies: "Rarely",
    lifestyle_multiple_piercings_ok: "Somewhat Acceptable",
    lifestyle_tattoos_ok: "Neutral",
    lifestyle_homeschooling: "No",
    lifestyle_holistic_preference: "Disagree",
    lifestyle_mental_health_meds_ok: "Completely Acceptable",
    lifestyle_vasectomy_ok: "Completely Acceptable",
    lifestyle_birth_control_ok: "Completely Acceptable",
    lifestyle_support_no_baptism_age_8: "Somewhat Support",
    lifestyle_mothers_stay_home: "Neutral",

    // Section 5A
    social_enjoy_ward: "Agree",
    social_friends_lds: "Agree",
    social_friends_non_lds: "Agree",
    social_mission_enjoy: "Strongly Agree",
    social_children_friends: "Neutral",
    social_left_church_touch: "Agree",
    social_respect_leave: "Agree",

    // Section 5B
    align_conservative: "Agree",
    align_liberal: "Disagree",

    // Section 5C
    church_discipline: "Agree",
    transparency_history: "Agree",
    transparency_finances: "Agree",
    child_marry_non_lds: "Neutral",
};

async function runTest() {
    console.log("🚀 Starting End-to-End Verification Bot...");

    // 1. Authenticate with Google Sheets
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

    // 2. Initial Sheet Check
    console.log("📊 Fetching current sheet state...");

    // Fetch Correct Headers (Row 1)
    const headerRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!1:1", // Get entire first row
    });
    const headers = headerRes.data.values?.[0] || [];

    console.log(`Checking headers (found ${headers.length})...`);
    // Verify headers match constants exactly
    const missingInSheet = SHEET_HEADERS.filter(h => !headers.includes(h));

    if (missingInSheet.length > 0) {
        console.error("❌ CRITICAL: Sheet is missing headers expected by code:", missingInSheet);
        console.log("First 10 Sheet Headers:", headers.slice(0, 10));
        process.exit(1);
    } else {
        console.log("✅ Headers match expected schema.");
    }

    // 2.5 Generate Random IP to bypass duplicate check
    const randomIP = `10.0.0.${Math.floor(Math.random() * 255)}`;
    console.log(`🤖 Using random test IP: ${randomIP}`);

    // Refresh row count for verification
    const countRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!A:A",
    });
    const initialRowCount = countRes.data.values?.length || 0;


    // 3. Submit Data via API
    console.log(`📤 Submitting Mock Payload to ${API_URL}...`);

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-forwarded-for": randomIP
            },
            body: JSON.stringify(MOCK_PAYLOAD),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(`API Submission Failed: ${res.status} ${JSON.stringify(err)}`);
        }
        console.log("✅ API responded with Success.");
    } catch (e) {
        console.error("API Call Failed.", e);
        process.exit(1);
    }

    // 4. Verify Data in Sheet
    console.log("🔍 Verifying data persistence in Google Sheet...");
    await new Promise(r => setTimeout(r, 2000));

    const finalSheet = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!A:A",
    });
    const finalRowCount = finalSheet.data.values?.length || 0;

    if (finalRowCount > initialRowCount) {
        console.log(`✅ SUCCESS: Row count increased from ${initialRowCount} to ${finalRowCount}.`);
        console.log("Bot verification complete. System is functional end-to-end with valid headers.");
    } else {
        console.error("❌ FAILURE: Row count did not increase. Data was not appended.");
        process.exit(1);
    }
}

runTest().catch(console.error);
