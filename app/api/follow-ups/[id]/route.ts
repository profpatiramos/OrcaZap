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

    if (!["PENDING", "COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Status invalido.",
        },
        { status: 400 },
      );
    }

    const followUp = await db.followUp.update({
      where: {
        id,
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
      followUp,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Nao foi possivel atualizar o follow-up.",
      },
      { status: 500 },
    );
  }
}