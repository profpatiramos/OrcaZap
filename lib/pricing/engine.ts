export type PricingInput = {
  quantity: number;

  hours: number;
  hourlyRate: number;

  materials: number;
  thirdPartyCosts: number;
  travelExpenses: number;
  otherExpenses: number;

  taxRate: number;
  desiredMargin: number;
};

export type PricingOutput = {
  quantity: number;

  laborCost: number;
  materialsCost: number;
  thirdPartyCost: number;
  travelCost: number;
  otherExpenses: number;

  operatingCost: number;
  taxAmount: number;
  totalCost: number;

  minimumPrice: number;
  recommendedPrice: number;
  premiumPrice: number;

  recommendedMargin: number;

  warning?: string;
};

const money = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const clamp = (
  value: number,
  min: number,
  max: number,
): number => Math.min(Math.max(value, min), max);

export function calculatePricing(
  input: PricingInput,
): PricingOutput {
  const quantity = Math.max(input.quantity, 1);

  const hours = Math.max(input.hours, 0);
  const hourlyRate = Math.max(input.hourlyRate, 0);

  const materials = Math.max(input.materials, 0);
  const thirdPartyCosts = Math.max(input.thirdPartyCosts, 0);
  const travelExpenses = Math.max(input.travelExpenses, 0);
  const otherExpenses = Math.max(input.otherExpenses, 0);

  const taxRate = clamp(input.taxRate, 0, 50);
  const desiredMargin = clamp(input.desiredMargin, 0, 90);

  const laborCost = hours * hourlyRate;

  const operatingCost =
    laborCost +
    materials +
    thirdPartyCosts +
    travelExpenses +
    otherExpenses;

  /*
   * O imposto é considerado sobre o preço de venda.
   *
   * Exemplo:
   * custo = R$ 100
   * imposto = 10%
   * margem = 30%
   *
   * preço = 100 / (1 - 0,10 - 0,30)
   */
  const denominator = 1 - taxRate / 100 - desiredMargin / 100;

  const recommendedPrice =
    denominator > 0
      ? operatingCost / denominator
      : operatingCost;

  const taxAmount =
    recommendedPrice * (taxRate / 100);

  const totalCost =
    operatingCost + taxAmount;

  /*
   * Preço mínimo:
   * cobre o custo operacional + imposto,
   * sem considerar lucro desejado.
   */
  const minimumDenominator = 1 - taxRate / 100;

  const minimumPrice =
    minimumDenominator > 0
      ? operatingCost / minimumDenominator
      : operatingCost;

  /*
   * Preço premium:
   * adiciona 20% ao preço recomendado.
   */
  const premiumPrice =
    recommendedPrice * 1.2;

  const recommendedMargin =
    recommendedPrice > 0
      ? ((recommendedPrice - totalCost) /
          recommendedPrice) *
        100
      : 0;

  let warning: string | undefined;

  if (desiredMargin >= 70) {
    warning =
      "Margem elevada: valide a competitividade do preço antes de enviar o orçamento.";
  } else if (taxRate >= 30) {
    warning =
      "A taxa/imposto informado é elevado e pode impactar significativamente o preço final.";
  } else if (operatingCost === 0) {
    warning =
      "Nenhum custo foi informado. Confira os dados antes de utilizar o preço calculado.";
  }

  return {
    quantity,

    laborCost: money(laborCost),
    materialsCost: money(materials),
    thirdPartyCost: money(thirdPartyCosts),
    travelCost: money(travelExpenses),
    otherExpenses: money(otherExpenses),

    operatingCost: money(operatingCost),
    taxAmount: money(taxAmount),
    totalCost: money(totalCost),

    minimumPrice: money(minimumPrice),
    recommendedPrice: money(recommendedPrice),
    premiumPrice: money(premiumPrice),

    recommendedMargin: money(recommendedMargin),

    warning,
  };
}