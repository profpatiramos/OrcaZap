import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const customers = await db.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      customers,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Nao foi possivel carregar os clientes.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { companyId, name, email, phone } = body;

    if (!companyId || !name) {
      return NextResponse.json(
        {
          ok: false,
          error: "Empresa e nome do cliente sao obrigatorios.",
        },
        { status: 400 },
      );
    }

    const customer = await db.customer.create({
      data: {
        companyId,
        name,
        email: email || null,
        phone: phone || null,
        whatsapp: phone || null,
      },
    });

    return NextResponse.json({
      ok: true,
      customer,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Nao foi possivel salvar o cliente.",
      },
      { status: 500 },
    );
  }
}