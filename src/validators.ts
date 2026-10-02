import { z } from "zod";

export const blueprintRequestSchema = z.object({
  questionCount: z.number().int().min(1).max(200),
});

const difficultySchema = z.enum(["medium", "hard", "very_hard"]);
const itemTypeSchema = z.enum([
  "single_choice",
  "multi_select",
  "sequence_order",
  "matching_magnet",
  "case_study",
  "code_or_config_artifact",
]);

const domainBlueprintSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  count: z.number().int().min(0).max(200),
});

const itemTypeBlueprintSchema = z.object({
  single_choice: z.number().int().min(0).max(200),
  multi_select: z.number().int().min(0).max(200),
  sequence_order: z.number().int().min(0).max(200),
  matching_magnet: z.number().int().min(0).max(200),
  case_study: z.number().int().min(0).max(200),
  code_or_config_artifact: z.number().int().min(0).max(200),
});

const difficultyDistributionSchema = z.object({
  medium: z.number().int().min(0).max(200),
  hard: z.number().int().min(0).max(200),
  very_hard: z.number().int().min(0).max(200),
});

const batchPlanSchema = z.object({
  id: z.string().min(1),
  domainId: z.string().optional(),
  domainName: z.string().optional(),
  typeFocus: z.array(itemTypeSchema).min(1).max(6),
  difficultyFocus: z.array(difficultySchema).min(1).max(3),
  caseStudyId: z.string().optional(),
  questionCount: z.number().int().min(1).max(200),
});

export const generateBatchRequestSchema = z.object({
  plan: z.object({
    totalQuestions: z.number().int().min(1).max(200),
    domains: z.array(domainBlueprintSchema).min(1).max(200),
    itemTypes: itemTypeBlueprintSchema,
    caseStudyCount: z.number().int().min(0).max(200),
    difficulty: difficultyDistributionSchema,
    batches: z.array(batchPlanSchema).min(1).max(200),
  }),
  batch: batchPlanSchema,
  existingQuestionStems: z.array(z.string()).max(200).default([]),
});

export const validateBatchRequestSchema = z.object({
  questions: z.array(z.any()),
});

export const assembleRequestSchema = z.object({
  plan: z.any(),
  questions: z.array(z.any()),
  caseStudies: z.array(z.any()).default([]),
});

export const attemptRequestSchema = z.object({
  examId: z.string(),
  answers: z.record(z.string(), z.any()),
  confidence: z.record(z.string(), z.enum(["guessed", "somewhat_confident", "confident"])).default({}),
  flagged: z.array(z.string()).default([]),
});

export const practiceQuestionSchema = z.object({
  id: z.string(),
  examCode: z.literal("GH-600"),
  domainId: z.string(),
  domainName: z.string(),
  objectiveTags: z.array(z.string()).min(1),
  type: z.string(),
  difficulty: z.enum(["medium", "hard", "very_hard"]),
  stem: z.string().min(5),
  options: z.array(z.object({ id: z.string(), text: z.string() })).min(2),
  correctAnswer: z.union([z.string(), z.array(z.string()), z.object({ order: z.array(z.string()) }), z.object({ pairs: z.record(z.string(), z.string()) })]),
  explanation: z.object({
    whyCorrect: z.string().min(1),
    whyDistractorsWrong: z.record(z.string(), z.string()),
  }),
  sourceRefs: z.array(z.object({ title: z.string(), docType: z.string() })).min(1),
  metadata: z.object({
    generatedAt: z.string(),
    model: z.string(),
    reasoningEffort: z.string(),
    batchId: z.string(),
    validationStatus: z.enum(["draft", "validated", "needs_review", "rejected"]),
  }),
});
