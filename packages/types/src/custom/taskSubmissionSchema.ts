import { z } from "zod";

export const TaskSubmissionSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  reward: z.number().min(0.1, {
    message: "Reward must be at least 0.1 SOL.",
  }),
  maxParticipants: z.number().min(1, {
    message: "Must have at least 1 participant.",
  }),
  images: z.array(z.string()).min(2, {
    message: "You must upload at least 2 images.",
  }),
});

export const TaskSubmissionParamsSchema = z.object({
  hash: z.string().min(1, {
    message: "Hash is required.",
  }),
});

export type TTaskSubmissionParams = z.infer<typeof TaskSubmissionParamsSchema>;
export type TTaskSubmissionSchema = z.infer<typeof TaskSubmissionSchema>;
