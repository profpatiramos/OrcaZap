import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const followUps = await db.followUp.findMany({
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
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Nao foi possivel carregar os follow-ups.",
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
            "Empresa, cliente e data do follow-up sao obrigatorios.",
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
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Nao foi possivel criar o follow-up.",
      },
      { status: 500 },
    );
  }
}