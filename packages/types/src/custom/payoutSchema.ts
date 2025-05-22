import { z } from "zod";

export const PayoutSchema = z.object({
  amount: z.number(),
});

export type TPayoutSchema = z.infer<typeof PayoutSchema>;
