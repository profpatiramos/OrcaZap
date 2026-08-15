import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Params,
) {
  try {
    const { id } = await params;

    const quote = await db.quote.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
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

    const publicToken =
      quote.publicToken || randomUUID();

    const publishedAt =
      quote.publicPublishedAt || new Date();

    const updatedQuote = await db.quote.update({
      where: {
        id: quote.id,
      },
      data: {
        publicToken,
        publicPublishedAt: publishedAt,
        status:
          quote.status === "DRAFT"
            ? "SENT"
            : quote.status,
      },
    });

    /*
     * Cria automaticamente um follow-up para
     * 3 dias após a publicação.
     *
     * Só cria se ainda não existir um follow-up
     * pendente para este orçamento.
     */
    const existingFollowUp =
      await db.followUp.findFirst({
        where: {
          quoteId: quote.id,
          status: "PENDING",
        },
      });

    if (!existingFollowUp) {
      const dueAt = new Date(publishedAt);

      dueAt.setDate(dueAt.getDate() + 3);

      await db.followUp.create({
        data: {
          companyId: quote.companyId,
          customerId: quote.customerId,
          quoteId: quote.id,
          dueAt,
          suggestedMessage:
            `Olá, ${quote.customer.name}! Tudo bem? ` +
            `Estou entrando em contato para saber se você conseguiu ` +
            `avaliar o orçamento ${quote.number}. ` +
            `Fico à disposição para qualquer dúvida ou ajuste.`,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      publicToken: updatedQuote.publicToken,
      publicUrl: `/orcamento/${updatedQuote.publicToken}`,
    });
  } catch (error) {
    console.error(
      "Erro ao publicar orçamento:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Não foi possível publicar o orçamento.",
      },
      { status: 500 },
    );
  }
}