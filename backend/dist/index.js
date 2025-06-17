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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
        const result = yield geminiModel.generateContentStream(prompt);
        const response = result;
        console.log(response);
        return response;
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
    var _a, e_1, _b, _c;
    const prompt = req.body.prompt;
    res.setHeader("Content-Type", "text/json");
    res.setHeader("Transfer-Encoding", "chunked");
    try {
        const result = yield geminiModel.generateContentStream([prompt]);
        try {
            for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                const text = chunk.text();
                res.write(text);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.end();
    }
    catch (error) {
        console.error("Streaming error:", error);
        res.status(500).send("Error while streaming Gemini response.");
    }
}));
app.listen(port, () => {
    console.log(`the app is running at port ${port}`);
});
