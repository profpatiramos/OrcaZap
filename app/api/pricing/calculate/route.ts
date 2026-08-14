import { NextResponse } from "next/server";
import { pricingSchema } from "@/lib/validations/pricing";
import { calculatePricing } from "@/lib/pricing/engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = pricingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Dados de precificação inválidos.",
          details: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = calculatePricing(validation.data);

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível processar a solicitação.",
      },
      { status: 500 },
    );
  }
}