import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const COMPANY_ID = "cmstaaoh30000nt60wfy3hm3r";

export async function GET() {
  try {
    const services = await db.service.findMany({
      where: {
        companyId: COMPANY_ID,
        active: true,
      },
      include: {
        costs: {
          where: {
            active: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      ok: true,
      services,
    });
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível carregar os serviços.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      description,
      baseHourlyRate,
      defaultQuantity,
      costs,
    } = body;

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Informe o nome do serviço.",
        },
        { status: 400 },
      );
    }

    const service = await db.service.create({
      data: {
        companyId: COMPANY_ID,
        name: String(name).trim(),
        description:
          description && String(description).trim()
            ? String(description).trim()
            : null,
        baseHourlyRate:
          baseHourlyRate !== undefined &&
          baseHourlyRate !== null &&
          baseHourlyRate !== ""
            ? Number(baseHourlyRate)
            : null,
        defaultQuantity:
          defaultQuantity !== undefined &&
          defaultQuantity !== null &&
          defaultQuantity !== ""
            ? Number(defaultQuantity)
            : 1,

        costs: {
          create: Array.isArray(costs)
            ? costs
                .filter(
                  (cost: any) =>
                    cost &&
                    cost.name &&
                    String(cost.name).trim(),
                )
                .map((cost: any) => ({
                  name: String(cost.name).trim(),
                  amount: Number(cost.amount) || 0,
                  active: true,
                }))
            : [],
        },
      },

      include: {
        costs: true,
      },
    });

    return NextResponse.json({
      ok: true,
      service,
    });
  } catch (error) {
    console.error("Erro ao criar serviço:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível cadastrar o serviço.",
      },
      { status: 500 },
    );
  }
}