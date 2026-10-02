import { describe, expect, it } from "vitest";
import { generateBatchRequestSchema, practiceQuestionSchema } from "../src/validators.js";

describe("practiceQuestionSchema", () => {
  it("validates generated question shape", () => {
    const sample = {
      id: "q1",
      examCode: "GH-600",
      domainId: "A",
      domainName: "Agent architecture and SDLC integration",
      objectiveTags: ["least-privilege"],
      type: "single_choice",
      difficulty: "hard",
      stem: "What is the best next action?",
      options: [
        { id: "A", text: "Do safe thing" },
        { id: "B", text: "Do unsafe thing" },
      ],
      correctAnswer: "A",
      explanation: {
        whyCorrect: "A is correct",
        whyDistractorsWrong: { B: "B is wrong" },
      },
      sourceRefs: [{ title: "GitHub Docs", docType: "github_docs" }],
      metadata: {
        generatedAt: new Date().toISOString(),
        model: "gpt-5.5",
        reasoningEffort: "medium",
        batchId: "batch-1",
        validationStatus: "validated",
      },
    };

    expect(practiceQuestionSchema.safeParse(sample).success).toBe(true);
  });
});

describe("generateBatchRequestSchema", () => {
  const batch = {
    id: "batch-1",
    domainId: "A",
    domainName: "Prepare agent architecture and SDLC processes",
    typeFocus: ["single_choice"],
    difficultyFocus: ["hard"],
    questionCount: 10,
  };
  const plan = {
    totalQuestions: 10,
    domains: [{ id: "A", name: "Prepare agent architecture and SDLC processes", count: 10 }],
    itemTypes: {
      single_choice: 10,
      multi_select: 0,
      sequence_order: 0,
      matching_magnet: 0,
      case_study: 0,
      code_or_config_artifact: 0,
    },
    caseStudyCount: 0,
    difficulty: { medium: 0, hard: 10, very_hard: 0 },
    batches: [batch],
  };

  it("accepts a bounded generation batch request", () => {
    const result = generateBatchRequestSchema.safeParse({
      plan,
      batch,
      existingQuestionStems: [],
    });

    expect(result.success).toBe(true);
  });

  it("rejects an unbounded batch question count before generation", () => {
    const result = generateBatchRequestSchema.safeParse({
      plan,
      batch: { ...batch, questionCount: 20_000_000 },
      existingQuestionStems: [],
    });

    expect(result.success).toBe(false);
  });
});
