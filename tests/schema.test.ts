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
  const validBatch = {
    id: "batch-1",
    domainId: "A",
    domainName: "Prepare agent architecture and SDLC processes",
    typeFocus: ["single_choice"],
    difficultyFocus: ["hard"],
    questionCount: 3,
  };

  it("accepts a bounded batch-generation request", () => {
    expect(
      generateBatchRequestSchema.safeParse({
        plan: { batches: [validBatch] },
        batch: validBatch,
        existingQuestionStems: [],
      }).success
    ).toBe(true);
  });

  it("rejects oversized question counts before generation", () => {
    expect(
      generateBatchRequestSchema.safeParse({
        plan: { batches: [{ ...validBatch, questionCount: 100_000_000 }] },
        batch: { ...validBatch, questionCount: 100_000_000 },
        existingQuestionStems: [],
      }).success
    ).toBe(false);
  });
});
