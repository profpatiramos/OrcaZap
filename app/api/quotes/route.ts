import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const COMPANY_ID = "cmstaaoh30000nt60wfy3hm3r";

type QuoteItemInput = {
  serviceId: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  total?: number;
  pricingSnapshot?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerId,
      title,
      description,
      items,
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

    if (!title || !String(title).trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Informe o título do orçamento.",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Adicione pelo menos um serviço ao orçamento.",
        },
        { status: 400 },
      );
    }

    const normalizedItems: QuoteItemInput[] = items
      .filter(
        (item: QuoteItemInput) =>
          item &&
          item.serviceId &&
          String(item.serviceId).trim(),
      )
      .map((item: QuoteItemInput) => {
        const quantity =
          Number(item.quantity) > 0
            ? Number(item.quantity)
            : 1;

        const unitPrice =
          Number(item.unitPrice) >= 0
            ? Number(item.unitPrice)
            : 0;

        const total =
          Number(item.total) >= 0
            ? Number(item.total)
            : quantity * unitPrice;

        return {
          serviceId: String(item.serviceId),
          description:
            item.description &&
            String(item.description).trim()
              ? String(item.description).trim()
              : "Serviço",
          quantity,
          unitPrice,
          total,
          pricingSnapshot:
            item.pricingSnapshot || null,
        };
      });

    if (normalizedItems.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nenhum serviço válido foi informado.",
        },
        { status: 400 },
      );
    }

    /*
     * Confirma que todos os serviços pertencem à empresa
     * antes de permitir que sejam utilizados no orçamento.
     */
    const serviceIds = [
      ...new Set(
        normalizedItems.map(
          (item) => item.serviceId,
        ),
      ),
    ];

    const services = await db.service.findMany({
      where: {
        id: {
          in: serviceIds,
        },
        companyId: COMPANY_ID,
        active: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (services.length !== serviceIds.length) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Um ou mais serviços selecionados não estão disponíveis.",
        },
        { status: 400 },
      );
    }

    const serviceMap = new Map(
      services.map((service) => [
        service.id,
        service.name,
      ]),
    );

    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0,
    );

    const number = `ORC-${Date.now()}`;

    const quote = await db.quote.create({
      data: {
        companyId: COMPANY_ID,
        customerId,
        number,
        title: String(title).trim(),

        description:
          description &&
          String(description).trim()
            ? String(description).trim()
            : null,

        subtotal,
        total: subtotal,

        status: "DRAFT",

        pricingSnapshot:
          pricingSnapshot
            ? (pricingSnapshot as Prisma.InputJsonValue)
            : Prisma.JsonNull,

        items: {
          create: normalizedItems.map((item) => ({
            serviceId: item.serviceId,

            description:
              item.description ||
              serviceMap.get(item.serviceId) ||
              "Serviço",

            quantity: item.quantity || 1,

            unitPrice:
              item.unitPrice || 0,

            total:
              item.total || 0,

            pricingSnapshot:
              item.pricingSnapshot
                ? (item.pricingSnapshot as Prisma.InputJsonValue)
                : Prisma.JsonNull,
          })),
        },
      },

      include: {
        customer: true,

        items: {
          include: {
            service: true,
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      quote,
    });
  } catch (error) {
    console.error(
      "Erro ao criar orçamento:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Não foi possível salvar o orçamento.",
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

        items: {
          include: {
            service: true,
          },
        },
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
    console.error(
      "Erro ao carregar orçamentos:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Não foi possível carregar os orçamentos.",
      },
      { status: 500 },
    );
  }
}