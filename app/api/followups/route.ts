import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentCompany } from "@/lib/auth";

export async function GET() {
  try {
    const company = await getCurrentCompany();

    if (!company) {
      return NextResponse.json(
        {
          ok: false,
          error: "Usuário não autenticado ou sem empresa.",
        },
        { status: 401 },
      );
    }

    const followUps = await db.followUp.findMany({
      where: {
        companyId: company.id,
      },
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
    const company = await getCurrentCompany();

    if (!company) {
      return NextResponse.json(
        {
          ok: false,
          error: "Usuário não autenticado ou sem empresa.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const {
      customerId,
      quoteId,
      dueAt,
      suggestedMessage,
    } = body;

    if (!customerId || !dueAt) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Cliente e data do follow-up são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const followUp = await db.followUp.create({
      data: {
        companyId: company.id,
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