import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token =
      typeof body.token === "string"
        ? body.token.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!token || !password) {
      return NextResponse.json(
        {
          ok: false,
          error: "Token e senha são obrigatórios.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          ok: false,
          error: "A senha deve ter pelo menos 8 caracteres.",
        },
        { status: 400 },
      );
    }

    const user = await db.user.findFirst({
      where: {
        activationToken: token,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Link de ativação inválido ou já utilizado.",
        },
        { status: 400 },
      );
    }

    if (
      !user.activationExpiresAt ||
      user.activationExpiresAt <= new Date()
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Este link de ativação expirou. Entre em contato com o suporte.",
        },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const sessionToken = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordHash,
          activationToken: null,
          activationExpiresAt: null,
        },
      });

      await tx.session.create({
        data: {
          token: sessionToken,
          userId: user.id,
          expiresAt,
        },
      });
    });

    const response = NextResponse.json({
      ok: true,
      message: "Conta ativada com sucesso.",
    });

    response.cookies.set({
      name: SESSION_COOKIE,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error(
      "Erro ao ativar conta:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível ativar a conta.",
      },
      { status: 500 },
    );
  }
}