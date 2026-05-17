import type { VercelRequest, VercelResponse } from "@vercel/node";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

const ONEULDORAK_SYSTEM_PROMPT = `너는 '오늘도락' 앱의 도시락 추천 AI야.
친절하고 귀여운 말투로 답하되, 과하게 길게 쓰지 마.

반드시 지킬 규칙:
1) 사용자가 입력한 냉장고 재료/질문을 바탕으로만 추천해.
2) 답변은 아래 형식을 유지해:
- 추천 메뉴:
- 필요한 재료:
- 예상 조리 시간:
- 간단한 조리법:
- 절약 포인트:
3) 음식 알레르기 유발 가능 재료(예: 우유, 달걀, 땅콩, 갑각류 등)나 위험할 수 있는 재료가 보이면 조심하라고 안내해.
4) 정보가 부족하거나 확실하지 않으면 지어내지 말고, 필요한 정보를 1~2개만 간단히 물어봐.
5) 한국어로 답해.
6) 마크다운 제목 기호(###)는 쓰지 말고, 불릿은 너무 많지 않게 간단히 써.`;

type JsonRecord = Record<string, unknown>;

type OpenAIResponseData = JsonRecord & {
  output_text?: string;
  output?: unknown;
  error?: {
    message?: string;
  };
};

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

  if (!message) {
    return res.status(400).json({ error: "message 값을 입력해 주세요." });
  }

  try {
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        instructions: ONEULDORAK_SYSTEM_PROMPT,
        input: message,
      }),
    });

    const data = (await openaiResponse.json()) as OpenAIResponseData;

    if (!openaiResponse.ok) {
      const openaiErrorMessage =
        data.error && typeof data.error.message === "string"
          ? data.error.message
          : "OpenAI API 요청에 실패했습니다.";

      return res.status(openaiResponse.status).json({
        error: openaiErrorMessage,
      });
    }

    const text =
      extractTextFromOpenAiResponse(data) ||
      "추천 결과를 만들지 못했어요. 재료를 조금 더 알려주면 다시 추천해드릴게요!";

    return res.status(200).json({ text });
  } catch (error) {
    const messageText =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    return res.status(500).json({
      error: `GPT 응답 생성에 실패했어요: ${messageText}`,
    });
  }
}
