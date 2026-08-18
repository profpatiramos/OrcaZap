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

    const customers = await db.customer.findMany({
      where: {
        companyId: company.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      customers,
    });
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível carregar os clientes.",
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
      email,
      phone,
      whatsapp,
      document,
      address,
      city,
      state,
      zipCode,
      notes,
    } = body;

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "O nome do cliente é obrigatório.",
        },
        { status: 400 },
      );
    }

    const customer = await db.customer.create({
      data: {
        companyId: company.id,
        name: String(name).trim(),
        email: email ? String(email).trim() : null,
        phone: phone ? String(phone).trim() : null,
        whatsapp: whatsapp
          ? String(whatsapp).trim()
          : phone
            ? String(phone).trim()
            : null,
        document: document ? String(document).trim() : null,
        address: address ? String(address).trim() : null,
        city: city ? String(city).trim() : null,
        state: state ? String(state).trim() : null,
        zipCode: zipCode ? String(zipCode).trim() : null,
        notes: notes ? String(notes).trim() : null,
      },
    });

    return NextResponse.json({
      ok: true,
      customer,
    });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível salvar o cliente.",
      },
      { status: 500 },
    );
  }
}