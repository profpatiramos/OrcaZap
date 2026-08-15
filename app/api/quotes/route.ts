import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const COMPANY_ID = "cmstaaoh30000nt60wfy3hm3r";

export async function POST(request: Request) {
  try {
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

    if (!title) {
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

    const number = `ORC-${Date.now()}`;

    const quote = await db.quote.create({
      data: {
        companyId: COMPANY_ID,
        customerId,
        number,
        title,
        description: description || null,
        subtotal,
        total: subtotal,
        status: "DRAFT",
        pricingSnapshot: pricingSnapshot || null,

        items: {
          create: {
            description: title,
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
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível salvar o orçamento.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const quotes = await db.quote.findMany({
      where: {
        companyId: COMPANY_ID,
      },
      include: {
        customer: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      quotes,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível carregar os orçamentos.",
      },
      { status: 500 },
    );
  }
}