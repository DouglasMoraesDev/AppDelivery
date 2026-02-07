import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBpCX7-trkEqmlvsskvQO3J5bj0RobSt6Y";
const genAI = new GoogleGenerativeAI(API_KEY);

const models = [
  "gemini-pro",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-1.0-pro"
];

async function testModels() {
  console.log("Testing models...\n");
  
  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello");
      console.log(`✓ ${modelName} - WORKS!`);
    } catch (error) {
      console.log(`✗ ${modelName} - Failed: ${error.message}`);
    }
  }
}

testModels();
