import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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
    const { id } = await params;
    const body = await request.json();

    const { status } = body;

    if (
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

    const followUp = await db.followUp.findUnique({
      where: {
        id,
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

    const updatedFollowUp =
      await db.followUp.update({
        where: {
          id,
        },
        data: {
          status,
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