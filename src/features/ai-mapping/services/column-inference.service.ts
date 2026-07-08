const FIELD_PATTERNS: Array<{ field: string; patterns: RegExp[] }> = [
  { field: "firstName", patterns: [/first.?name/i, /fname/i, /given.?name/i, /^first$/i] },
  { field: "lastName", patterns: [/last.?name/i, /lname/i, /surname/i, /family.?name/i, /^last$/i] },
  { field: "email", patterns: [/e.?mail/i, /email.?address/i] },
  { field: "phone", patterns: [/phone/i, /mobile/i, /cell/i, /tel/i] },
  { field: "company", patterns: [/company/i, /organization/i, /org/i, /employer/i, /business/i] },
  { field: "title", patterns: [/title/i, /job.?title/i, /position/i, /role/i] },
  { field: "website", patterns: [/website/i, /url/i, /web/i, /domain/i] },
  { field: "address", patterns: [/address/i, /street/i, /addr/i] },
  { field: "city", patterns: [/city/i, /town/i] },
  { field: "state", patterns: [/state/i, /province/i, /region/i] },
  { field: "country", patterns: [/country/i, /nation/i] },
  { field: "postalCode", patterns: [/postal/i, /zip/i, /post.?code/i] },
  { field: "tags", patterns: [/tag/i, /label/i, /category/i, /segment/i] },
  { field: "notes", patterns: [/note/i, /comment/i, /description/i, /remark/i] },
];

function scoreColumn(header: string, sampleValues: string[]): { field: string; confidence: number } | null {
  for (const { field, patterns } of FIELD_PATTERNS) {
    const headerMatch = patterns.some((p) => p.test(header));
    if (!headerMatch) continue;

    let confidence = 0.75;

    if (field === "email" && sampleValues.some((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))) {
      confidence = 0.98;
    } else if (field === "phone" && sampleValues.some((v) => /[\d\-+(). ]{7,}/.test(v))) {
      confidence = 0.92;
    } else if (field === "website" && sampleValues.some((v) => /^https?:\/\//i.test(v))) {
      confidence = 0.95;
    } else if (headerMatch) {
      confidence = 0.85;
    }

    return { field, confidence };
  }

  return null;
}

export function inferColumnMappings(
  headers: string[],
  sampleRows: Record<string, string>[],
): Array<{ sourceColumn: string; targetField: string | null; confidence: number; reasoning?: string }> {
  return headers.map((header) => {
    const sampleValues = sampleRows
      .map((row) => row[header]?.trim() ?? "")
      .filter(Boolean)
      .slice(0, 3);

    const match = scoreColumn(header, sampleValues);

    if (match) {
      return {
        sourceColumn: header,
        targetField: match.field,
        confidence: match.confidence,
        reasoning: `Matched "${header}" to ${match.field} via pattern analysis`,
      };
    }

    return {
      sourceColumn: header,
      targetField: null,
      confidence: 0,
      reasoning: "No confident match found",
    };
  });
}
