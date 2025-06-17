"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
const port = process.env.PORT;
const gemini_api_key = process.env.GEMINI_API_KEY;
const googleAI = new generative_ai_1.GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
};
const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-2.0-flash"
});
const generate = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield geminiModel.generateContent(prompt);
        const response = result.response;
        console.log(response.text());
        return response.text();
    }
    catch (error) {
        console.log("response error", error);
    }
});
app.get("/", (req, res) => {
    res.json({
        msg: " into the app"
    });
});
app.post("/prompt", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    const result = yield generate(prompt);
    res.json({
        msg: "gemini responded back",
        result: result
    });
}));
app.listen(port, () => {
    console.log(`the app is running at port ${port}`);
});
