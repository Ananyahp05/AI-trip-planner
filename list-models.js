import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        fs.writeFileSync("models_log.json", JSON.stringify(data, null, 2));
        console.log("Models listed successfully.");
    } catch (error) {
        console.error("Error listing models:", error);
        fs.writeFileSync("models_log.json", JSON.stringify({ error: error.message }, null, 2));
    }
}

listModels();
