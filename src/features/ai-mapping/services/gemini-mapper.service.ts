import { gemini } from "@/shared/lib/ai/gemini";
import type { AiMappingRequest, AiMappingResponse } from "../types";

export async function mapColumnsWithGemini(
  request: AiMappingRequest
): Promise<AiMappingResponse> {
  const prompt = `
You are an expert CRM data extraction engine.

Your task is to map CSV columns into CRM fields.

CRM Fields:
created_at
name
email
country_code
mobile_without_country_code
company
city
state
country
lead_owner
crm_status
crm_note
data_source
possession_time
description

Headers:
${JSON.stringify(request.headers)}

Sample Rows:
${JSON.stringify(request.sampleRows)}

Return ONLY valid JSON in this format:

{
  "mappings":[
    {
      "sourceColumn":"Email Address",
      "targetField":"email",
      "confidence":0.99,
      "reasoning":"contains email addresses"
    }
  ]
}

Do not return markdown.
Do not return explanation.
Only return JSON.
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text ?? "";

  return JSON.parse(text) as AiMappingResponse;
}