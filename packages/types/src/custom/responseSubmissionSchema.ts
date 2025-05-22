import { z } from "zod";

export const ResponseSubmissionSchema = z.object({
  taskId: z.number(),
  optionId: z.number(),
  timeTaken: z.number(),
});

export type TResponseSubmissionSchema = z.infer<
  typeof ResponseSubmissionSchema
>;
