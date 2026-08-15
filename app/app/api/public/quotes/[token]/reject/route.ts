import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = {
  params: Promise<{
    token: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Params,
) {
  try {
    const { token } = await params;

    const quote = await db.quote.findUnique({
      where: {
        publicToken: token,
      },
    });

    if (!quote) {
      return NextResponse.json(
        {
          ok: false,
          error: "Orçamento não encontrado.",
        },
        { status: 404 },
      );
    }

    if (quote.status === "REJECTED") {
      return NextResponse.json({
        ok: true,
        alreadyRejected: true,
        message: "Este orçamento já foi recusado.",
      });
    }

    if (
      quote.status === "ACCEPTED" ||
      quote.status === "CANCELLED" ||
      quote.status === "EXPIRED"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Este orçamento não está mais disponível para recusa.",
        },
        { status: 400 },
      );
    }

    const updatedQuote = await db.$transaction(async (tx) => {
      const updated = await tx.quote.update({
        where: {
          id: quote.id,
        },
        data: {
          status: "REJECTED",
        },
      });

      await tx.quoteStatusHistory.create({
        data: {
          quoteId: quote.id,
          fromStatus: quote.status,
          toStatus: "REJECTED",
        },
      });

      return updated;
    });

    return NextResponse.json({
      ok: true,
      rejected: true,
      quoteId: updatedQuote.id,
      message: "Orçamento recusado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao recusar orçamento:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível registrar a recusa.",
      },
      { status: 500 },
    );
  }
}