import type { VercelRequest, VercelResponse } from "@vercel/node";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

const ONEULDORAK_SYSTEM_PROMPT = `
너는 '오늘도락' 앱의 카메라 AI 도우미야.
사용자가 찍은 사진이나 입력한 내용을 바탕으로 
도시락, 장보기, 절약을 도와줘.

말투는 친절하고 귀엽게 하되, 과하게 길게 쓰지 마.
답변은 한국어로만 해.

반드시 지킬 규칙:
1) 사용자가 제공한 사진/텍스트 정보만 바탕으로 답해.
2) 확실하지 않은 내용은 지어내지 말고 "확실하지 않아요"라고 말해.
3) 정보가 부족하면 필요한 질문을 1~2개만 간단히 물어봐.
4) 음식 알레르기 유발 가능 재료가 보이면 조심하라고 안내해.
   예: 우유, 달걀, 땅콩, 견과류, 갑각류, 밀, 대두 등
5) 유통기한이 지났거나 상태가 이상해 보이는 식재료는 섭취를 권하지 마.
6) 답변은 짧고 보기 쉽게 작성해.

기능별 답변 규칙:

[1. 가진 재료로 메뉴 추천]
사용자가 냉장고 재료 사진이나 재료명을 제공하면 아래 형식으로 답해.

- 추천 메뉴:
- 활용 재료:
- 추가로 있으면 좋은 재료:
- 예상 조리 시간:
- 간단한 조리법:
- 절약 포인트:

각 항목은 1~2문장으로 짧게 작성해.

[2. 영수증 분석]
사용자가 영수증 사진이나 구매 내역을 제공하면 아래 형식으로 답해.

- 총평:
- 지출이 큰 항목:
- 절약할 수 있는 항목:
- 도시락에 활용하기 좋은 재료:
- 다음 장보기 팁:

영수증의 금액이나 품목이 흐릿해서 확실하지 않으면 추측하지 말고 안내해.

[3. 살까 말까 판단]
사용자가 도시락 관련 용품(예: 도시락통, 젓가락, 보냉백)이나 식재료 구매 고민을 입력하면 아래 형식으로 답해.

- 판단:
- 이유:
- 도시락 활용도:
- 가격/가성비 체크:
- 추천 행동:

판단은 "사도 좋아요", "보류해도 좋아요", "사지 않는 걸 추천해요" 중 하나로 말해.
반드시 오늘 도시락 준비 기준(활용도, 보관성, 가격 대비 효율)으로 판단해.
단, 가격이나 용량 정보가 없으면 가성비를 단정하지 마.

[기타]
도시락, 식재료, 장보기, 영수증, 절약과 관련 없는 질문이면
"오늘도락에서는 도시락과 장보기 절약을 도와드릴 수 있어요!"라고 짧게 안내해.
`;

type JsonRecord = Record<string, unknown>;
type AnalysisType = "menu" | "receipt" | "judge";

type OpenAIResponseData = JsonRecord & {
  output_text?: string;
  output?: unknown;
  error?: {
    message?: string;
  };
};

function looksLikeVisionFailure(text: string) {
  return /사진.*볼 수 없|이미지.*볼 수 없|사진.*보이지 않|이미지.*보이지 않|재료.*알려주면/i.test(
    text
  );
}

function readMessageFromBody(body: unknown) {
  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body) as JsonRecord;
      return typeof parsed.message === "string" ? parsed.message.trim() : "";
    } catch {
      return "";
    }
  }

  if (body && typeof body === "object") {
    const candidate = body as JsonRecord;
    return typeof candidate.message === "string" ? candidate.message.trim() : "";
  }

  return "";
}

function readImageDataUrlFromBody(body: unknown) {
  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body) as JsonRecord;
      return typeof parsed.imageDataUrl === "string" ? parsed.imageDataUrl.trim() : "";
    } catch {
      return "";
    }
  }

  if (body && typeof body === "object") {
    const candidate = body as JsonRecord;
    return typeof candidate.imageDataUrl === "string" ? candidate.imageDataUrl.trim() : "";
  }

  return "";
}

function readAnalysisTypeFromBody(body: unknown) {
  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body) as JsonRecord;
      return typeof parsed.analysisType === "string" ? parsed.analysisType.trim() : "";
    } catch {
      return "";
    }
  }

  if (body && typeof body === "object") {
    const candidate = body as JsonRecord;
    return typeof candidate.analysisType === "string" ? candidate.analysisType.trim() : "";
  }

  return "";
}

function normalizeAnalysisType(value: string): AnalysisType | "" {
  if (value === "menu" || value === "receipt" || value === "judge") {
    return value;
  }
  return "";
}

function inferAnalysisType(message: string, explicitType: AnalysisType | ""): AnalysisType {
  if (explicitType) {
    return explicitType;
  }

  const normalized = message.replace(/\s+/g, "");

  if (/(영수증|지출|결제|구매내역|구매목록|합계|금액|마트)/.test(normalized)) {
    return "receipt";
  }

  if (/(살까말까|살까|사지말|보류|가성비|판단)/.test(normalized)) {
    return "judge";
  }

  return "menu";
}

function getAnalysisTypeInstruction(analysisType: AnalysisType) {
  if (analysisType === "receipt") {
    return `
[현재 분석 유형: 영수증 분석]
영수증(구매내역) 분석 형식으로만 답해.
- 총평:
- 지출이 큰 항목:
- 절약할 수 있는 항목:
- 도시락에 활용하기 좋은 재료:
- 다음 장보기 팁:
`;
  }

  if (analysisType === "judge") {
    return `
[현재 분석 유형: 살까 말까 판단]
살까 말까 판단 형식으로만 답해.
- 판단:
- 이유:
- 도시락 활용도:
- 가격/가성비 체크:
- 추천 행동:
`;
  }

  return `
[현재 분석 유형: 가진 재료 메뉴 추천]
메뉴 추천 형식으로만 답해.
- 추천 메뉴:
- 활용 재료:
- 추가로 있으면 좋은 재료:
- 예상 조리 시간:
- 간단한 조리법:
- 절약 포인트:
`;
}

function extractTextFromOpenAiResponse(data: OpenAIResponseData) {
  if (typeof data.output_text === "string" && data.output_text.trim().length > 0) {
    return data.output_text.trim();
  }

  const output = data.output;

  if (!Array.isArray(output)) {
    return "";
  }

  const texts: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== "object") continue;

    const content = (item as JsonRecord).content;

    if (!Array.isArray(content)) continue;

    for (const block of content) {
      if (!block || typeof block !== "object") continue;

      const textValue = (block as JsonRecord).text;

      if (typeof textValue === "string" && textValue.trim()) {
        texts.push(textValue.trim());
      }
    }
  }

  return texts.join("\n").trim();
}

function buildUserContent(
  message: string,
  imageDataUrl: string,
  analysisType: AnalysisType
) {
  const userContent: Array<Record<string, string>> = [];
  const modeInstruction = getAnalysisTypeInstruction(analysisType);

  if (imageDataUrl) {
    userContent.push({
      type: "input_image",
      image_url: imageDataUrl,
      detail: "high",
    });
    userContent.push({
      type: "input_text",
      text: "중요: 위 이미지를 실제로 분석해서 답변해. 보이지 않는다고 단정하지 말고, 정말 식별이 어려운 경우에만 그렇게 말해.",
    });
  }

  userContent.push({
    type: "input_text",
    text: modeInstruction,
  });

  if (message) {
    userContent.push({
      type: "input_text",
      text: message,
    });
  }

  return userContent;
}

function buildRequestBody(
  model: string,
  message: string,
  imageDataUrl: string,
  analysisType: AnalysisType
) {
  return {
    model,
    instructions: ONEULDORAK_SYSTEM_PROMPT,
    input: [
      {
        role: "user",
        content: buildUserContent(message, imageDataUrl, analysisType),
      },
    ],
    max_output_tokens: 360,
  };
}

async function requestOpenAiResponse(
  apiKey: string,
  model: string,
  message: string,
  imageDataUrl: string,
  analysisType: AnalysisType
) {
  const openaiResponse = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(buildRequestBody(model, message, imageDataUrl, analysisType)),
  });

  const data = (await openaiResponse.json()) as OpenAIResponseData;
  return { openaiResponse, data };
}

async function readRawBodyIfNeeded(req: VercelRequest) {
  if (req.body !== undefined && req.body !== null) {
    return req.body;
  }

  return await new Promise<string>((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk: Buffer | string) => {
      raw += chunk.toString();
    });

    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "POST 요청만 가능합니다." });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return res.status(500).json({
      error: "OPENAI_API_KEY가 설정되지 않았습니다. Vercel 프로젝트 환경변수에 추가해 주세요.",
    });
  }

  const rawBody = await readRawBodyIfNeeded(req);
  const message = readMessageFromBody(rawBody);
  const imageDataUrl = readImageDataUrlFromBody(rawBody);
  const analysisTypeRaw = readAnalysisTypeFromBody(rawBody);
  const analysisType = inferAnalysisType(
    message,
    normalizeAnalysisType(analysisTypeRaw)
  );

  if (!message && !imageDataUrl) {
    return res.status(400).json({ error: "message 또는 imageDataUrl 값을 입력해 주세요." });
  }

  if (imageDataUrl && !imageDataUrl.startsWith("data:image/")) {
    return res.status(400).json({ error: "imageDataUrl 형식이 올바르지 않습니다." });
  }

  try {
    const primaryModel = "gpt-4o-mini";

    const { openaiResponse, data } = await requestOpenAiResponse(
      apiKey,
      primaryModel,
      message,
      imageDataUrl,
      analysisType
    );

    if (!openaiResponse.ok) {
      const openaiErrorMessage =
        data.error && typeof data.error.message === "string"
          ? data.error.message
          : "OpenAI API 요청에 실패했습니다.";

      return res.status(openaiResponse.status).json({
        error: openaiErrorMessage,
      });
    }

    let text =
      extractTextFromOpenAiResponse(data) ||
      "추천 결과를 만들지 못했어요. 재료를 조금 더 알려주면 다시 추천해드릴게요!";

    if (imageDataUrl && looksLikeVisionFailure(text)) {
      const secondTry = await requestOpenAiResponse(
        apiKey,
        "gpt-4.1-mini",
        message,
        imageDataUrl,
        analysisType
      );
      if (secondTry.openaiResponse.ok) {
        const retryText = extractTextFromOpenAiResponse(secondTry.data);
        if (retryText) {
          text = retryText;
        }
      }
    }

    return res.status(200).json({ text });
  } catch (error) {
    const messageText =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    return res.status(500).json({
      error: `GPT 응답 생성에 실패했어요: ${messageText}`,
    });
  }
}
