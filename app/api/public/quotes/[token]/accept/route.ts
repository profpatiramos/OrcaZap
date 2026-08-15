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

    if (quote.status === "ACCEPTED") {
      return NextResponse.json({
        ok: true,
        alreadyAccepted: true,
        message: "Este orçamento já foi aceito.",
      });
    }

    if (
      quote.status === "REJECTED" ||
      quote.status === "CANCELLED" ||
      quote.status === "EXPIRED"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Este orçamento não está mais disponível para aceite.",
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
          status: "ACCEPTED",
        },
      });

      await tx.quoteStatusHistory.create({
        data: {
          quoteId: quote.id,
          fromStatus: quote.status,
          toStatus: "ACCEPTED",
        },
      });

      return updated;
    });

    return NextResponse.json({
      ok: true,
      accepted: true,
      quoteId: updatedQuote.id,
      message: "Orçamento aceito com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao aceitar orçamento:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível registrar o aceite.",
      },
      { status: 500 },
    );
  }
}