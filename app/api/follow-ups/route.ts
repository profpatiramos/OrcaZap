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
      include: {
        customer: true,
        quote: true,
      },
      orderBy: {
        dueAt: "asc",
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
          error: "Cliente e data do follow-up são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const customer = await db.customer.findFirst({
      where: {
        id: customerId,
        companyId: company.id,
      },
      select: {
        id: true,
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Cliente não encontrado ou não pertence à sua empresa.",
        },
        { status: 400 },
      );
    }

    let validatedQuoteId: string | null = null;

    if (quoteId) {
      const quote = await db.quote.findFirst({
        where: {
          id: quoteId,
          companyId: company.id,
          customerId,
        },
        select: {
          id: true,
        },
      });

      if (!quote) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Orçamento não encontrado ou não pertence ao cliente informado.",
          },
          { status: 400 },
        );
      }

      validatedQuoteId = quote.id;
    }

    const parsedDueAt = new Date(dueAt);

    if (Number.isNaN(parsedDueAt.getTime())) {
      return NextResponse.json(
        {
          ok: false,
          error: "Data do follow-up inválida.",
        },
        { status: 400 },
      );
    }

    const followUp = await db.followUp.create({
      data: {
        companyId: company.id,
        customerId: customer.id,
        quoteId: validatedQuoteId,
        dueAt: parsedDueAt,
        suggestedMessage:
          suggestedMessage
            ? String(suggestedMessage).trim()
            : null,
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