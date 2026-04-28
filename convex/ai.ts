import OpenAI from "openai";
import { action } from "./_generated/server";
import { v } from "convex/values";

const AnalysisSchema = {
  name: "ProjectBriefAnalysis",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string" },
      refinedBrief: { type: "string" },
      extractedSkills: { type: "array", items: { type: "string" } },
      deliverables: { type: "array", items: { type: "string" } },
      seniority: { type: "string" },
      budgetMin: { type: "number" },
      budgetMax: { type: "number" },
      timeline: { type: "string" },
    },
    required: ["title", "refinedBrief", "extractedSkills", "deliverables"],
  },
} as const;

export const analyzeProjectBrief = action({
  args: { brief: v.string() },
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

    const res = await client.chat.completions.create({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You turn rough client briefs into scoped project specs and structured requirements. Be concise, practical, and avoid fluff.",
        },
        {
          role: "user",
          content:
            "Analyze this brief. Return a short title, refined brief, extracted skills, deliverables, optional seniority, optional budget range, and optional timeline.\n\nBRIEF:\n" +
            args.brief,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: AnalysisSchema,
      },
    });

    const content = res.choices[0]?.message?.content;
    if (!content) throw new Error("No analysis returned from model");

    const parsed = JSON.parse(content) as {
      title: string;
      refinedBrief: string;
      extractedSkills: string[];
      deliverables: string[];
      seniority?: string;
      budgetMin?: number;
      budgetMax?: number;
      timeline?: string;
    };

    return parsed;
  },
});

