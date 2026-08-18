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

    const services = await db.service.findMany({
      where: {
        companyId: company.id,
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
        companyId: company.id,

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