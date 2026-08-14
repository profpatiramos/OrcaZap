import { z } from "zod";

export const pricingSchema = z.object({
  quantity: z
    .number()
    .finite()
    .min(0.01, "A quantidade deve ser maior que zero."),

  hours: z
    .number()
    .finite()
    .min(0, "As horas não podem ser negativas."),

  hourlyRate: z
    .number()
    .finite()
    .min(0, "O valor por hora não pode ser negativo."),

  materials: z
    .number()
    .finite()
    .min(0, "O custo de materiais não pode ser negativo."),

  thirdPartyCosts: z
    .number()
    .finite()
    .min(0, "O custo de terceiros não pode ser negativo."),

  travelExpenses: z
    .number()
    .finite()
    .min(0, "O deslocamento não pode ser negativo."),

  otherExpenses: z
    .number()
    .finite()
    .min(0, "As outras despesas não podem ser negativas."),

  taxRate: z
    .number()
    .finite()
    .min(0, "A taxa/imposto não pode ser negativa.")
    .max(50, "A taxa/imposto não pode ultrapassar 50%."),

  desiredMargin: z
    .number()
    .finite()
    .min(0, "A margem não pode ser negativa.")
    .max(90, "A margem não pode ultrapassar 90%."),
});

export type PricingInput = z.infer<typeof pricingSchema>;