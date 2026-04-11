import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_NAME = "gemini-flash-latest";

// 공통 프롬프트 (JSON 형식을 강제함)
const RECIPE_PROMPT = `
  제공된 정보를 분석해서 정확히 아래와 같은 JSON 형식으로만 응답해줘.
  다른 설명은 하지 말고 오직 JSON만 반환해줘.

  {
    "title": "레시피 제목",
    "description": "레시피에 대한 짧은 설명",
    "ingredients": [
      { "name": "재료명", "amount": "양(예: 1/2개, 200g)", "isEssential": true }
    ],
    "steps": [
      { "stepOrder": 1, "instruction": "조리 단계 설명", "timerSeconds": 0 }
    ]
  }
`;

// 텍스트에서 추출
export const extractRecipeFromText = async (rawText: string) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `사용자의 줄글 레시피를 분석해줘.\n\n[사용자 입력]: ${rawText}\n\n${RECIPE_PROMPT}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return parseGeminiResponse(text);
  } catch (e) {
    console.error("Gemini Text 상세 에러:", e);
    throw e;
  }
};

// 이미지에서 추출
export const extractRecipeFromImage = async (imageBuffer: Buffer, mimeType: string) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const imageParts = [{
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType,
    },
  }];

  try {
    const result = await model.generateContent([RECIPE_PROMPT, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    return parseGeminiResponse(text);
  } catch (e) {
    console.error("Gemini Image 상세 에러:", e);
    throw e;
  }
};

// 공통 로직: AI가 준 텍스트에서 JSON만 쏙 빼내는 함수
const parseGeminiResponse = (text: string) => {
  const jsonString = text.replace(/```json|```/g, "").trim();
  return JSON.parse(jsonString);
};
