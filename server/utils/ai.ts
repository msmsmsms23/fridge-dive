import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const extractRecipeFromImage = async (imageBuffer: Buffer, mimeType: string) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
  });

  const prompt = `
    이미지에서 레시피 정보를 추출해서 JSON으로 줘.
    반드시 다음 형식을 지켜줘:
    {
      "title": "제목",
      "description": "설명",
      "ingredients": [{ "name": "이름", "amount": "양", "isEssential": true }],
      "steps": [{ "stepOrder": 1, "instruction": "설명", "timerSeconds": 0 }]
    }
  `;

  const imageParts = [{
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType,
    },
  }];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Gemini 상세 에러:", e);
    throw e;
  }
};
