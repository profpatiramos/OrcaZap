import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentCompany } from "@/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
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

    const { status } = body;

    if (
      status !== "PENDING" &&
      status !== "COMPLETED" &&
      status !== "CANCELLED"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Status de follow-up inválido.",
        },
        { status: 400 },
      );
    }

    const followUp = await db.followUp.findFirst({
      where: {
        id,
        companyId: company.id,
      },
    });

    if (!followUp) {
      return NextResponse.json(
        {
          ok: false,
          error: "Follow-up não encontrado.",
        },
        { status: 404 },
      );
    }

    const updatedFollowUp = await db.followUp.update({
      where: {
        id: followUp.id,
      },
      data: {
        status,
      },
      include: {
        customer: true,
        quote: true,
      },
    });

    return NextResponse.json({
      ok: true,
      followUp: updatedFollowUp,
    });
  } catch (error) {
    console.error(
      "Erro ao atualizar follow-up:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Não foi possível atualizar o follow-up.",
      },
      { status: 500 },
    );
  }
}