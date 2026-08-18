import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";

const SESSION_DURATION_DAYS = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        {
          ok: false,
          error: "Informe seu e-mail e sua senha.",
        },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        {
          ok: false,
          error: "E-mail ou senha incorretos.",
        },
        { status: 401 },
      );
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      return NextResponse.json(
        {
          ok: false,
          error: "E-mail ou senha incorretos.",
        },
        { status: 401 },
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() +
        SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
    );

    await db.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    response.cookies.set({
      name: "orcazap_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível realizar o login.",
      },
      { status: 500 },
    );
  }
}