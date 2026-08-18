import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentCompany } from "@/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: Params,
) {
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

    const { id } = await params;
    const body = await request.json();

    const {
      customerId,
      title,
      description,
      quantity,
      unitPrice,
      pricingSnapshot,
    } = body;

    if (!customerId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Selecione um cliente.",
        },
        { status: 400 },
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Informe o serviço.",
        },
        { status: 400 },
      );
    }

    const qty = Number(quantity) || 1;
    const price = Number(unitPrice) || 0;
    const subtotal = qty * price;

    const existingQuote = await db.quote.findFirst({
      where: {
        id,
        companyId: company.id,
      },
      include: {
        items: true,
      },
    });

    if (!existingQuote) {
      return NextResponse.json(
        {
          ok: false,
          error: "Orçamento não encontrado.",
        },
        { status: 404 },
      );
    }

    const quote = await db.quote.update({
      where: {
        id: existingQuote.id,
      },
      data: {
        customerId,
        title: title.trim(),
        description: description?.trim() || null,
        subtotal,
        total: subtotal,
        pricingSnapshot: pricingSnapshot || null,

        items: {
          deleteMany: {},
          create: {
            description: title.trim(),
            quantity: qty,
            unitPrice: price,
            total: subtotal,
            pricingSnapshot: pricingSnapshot || null,
          },
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return NextResponse.json({
      ok: true,
      quote,
    });
  } catch (error) {
    console.error("Erro ao atualizar orçamento:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível salvar o orçamento.",
      },
      { status: 500 },
    );
  }
}