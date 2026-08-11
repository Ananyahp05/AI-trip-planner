import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-pro"
];

async function testModels() {
    let log = "";
    for (const modelName of modelsToTest) {
        log += `Testing ${modelName}...\n`;
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            log += `SUCCESS: ${modelName} works!\n`;
            log += JSON.stringify(result, null, 2) + "\n";
            break;
        } catch (error) {
            log += `FAILED: ${modelName} - ${error.message}\n`;
            if (error.response) {
                log += JSON.stringify(error.response, null, 2) + "\n";
            }
        }
    }
    fs.writeFileSync("debug_log.txt", log);
}

testModels();
