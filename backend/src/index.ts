import express from "express"
import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

dotenv.config();

app.use(express.json());

const port = process.env.PORT;
const gemini_api_key = process.env.GEMINI_API_KEY as string; 

const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});
 
const generate = async (prompt : string) => {
  try {
    const result = await geminiModel.generateContentStream(prompt);
    const response = result;
    console.log(response);
    return response;
  } catch (error) {
    console.log("response error", error);
  }
};

app.get("/",(req,res)=>{
    res.json({
        msg : " into the app"
    })
})
app.post("/prompt", async (req, res) => {
  const prompt = req.body.prompt;

  res.setHeader("Content-Type", "text/json");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    const result = await geminiModel.generateContentStream([prompt]);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      res.write(text); 
    }

    res.end(); 
  } catch (error) {
    console.error("Streaming error:", error);
    res.status(500).send("Error while streaming Gemini response.");
  }
});


app.listen(port,()=>{
    console.log(`the app is running at port ${port}`)
})