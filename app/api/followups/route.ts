import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const followUps = await db.followUp.findMany({
      orderBy: {
        dueAt: "asc",
      },
      include: {
        customer: true,
        quote: true,
      },
    });

    return NextResponse.json({
      ok: true,
      followUps,
    });
  } catch (error) {
    console.error("Erro ao carregar follow-ups:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível carregar os follow-ups.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      companyId,
      customerId,
      quoteId,
      dueAt,
      suggestedMessage,
    } = body;

    if (!companyId || !customerId || !dueAt) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Empresa, cliente e data do follow-up são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const followUp = await db.followUp.create({
      data: {
        companyId,
        customerId,
        quoteId: quoteId || null,
        dueAt: new Date(dueAt),
        suggestedMessage: suggestedMessage || null,
      },
      include: {
        customer: true,
        quote: true,
      },
    });

    return NextResponse.json({
      ok: true,
      followUp,
    });
  } catch (error) {
    console.error("Erro ao criar follow-up:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível criar o follow-up.",
      },
      { status: 500 },
    );
  }
}