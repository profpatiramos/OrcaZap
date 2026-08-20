import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

type EduzzWebhook = {
  id?: string;
  event?: string;
  data?: {
    id?: string;
    status?: string;
    buyer?: {
      id?: string;
      name?: string;
      email?: string;
      phone?: string | null;
      cellphone?: string | null;
      phone2?: string | null;
      document?: string | null;
      address?: {
        street?: string | null;
        number?: string | null;
        neighborhood?: string | null;
        complement?: string | null;
        city?: string | null;
        state?: string | null;
        zipCode?: string | null;
      };
    };
    offer?: {
      name?: string | null;
    };
    price?: {
      currency?: string;
      value?: number;
    };
    paid?: {
      currency?: string;
      value?: number;
    };
    paidAt?: string | null;
  };
};

function isValidSignature(
  rawBody: string,
  signature: string,
  secret: string,
) {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const received = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  if (received.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(received, expected);
}

export async function POST(request: Request) {
  try {
    const secret = process.env.EDUZZ_WEBHOOK_SECRET;

    if (!secret) {
      console.error(
        "EDUZZ_WEBHOOK_SECRET não configurado.",
      );

      return NextResponse.json(
        {
          ok: false,
          error: "Webhook Eduzz não configurado.",
        },
        { status: 500 },
      );
    }

    const signature = request.headers.get("x-signature");

    if (!signature) {
      return NextResponse.json(
        {
          ok: false,
          error: "Assinatura do webhook não informada.",
        },
        { status: 401 },
      );
    }

    const rawBody = await request.text();

    if (!isValidSignature(rawBody, signature, secret)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Assinatura do webhook inválida.",
        },
        { status: 401 },
      );
    }

    const payload = JSON.parse(rawBody) as EduzzWebhook;

    if (payload.event !== "myeduzz.invoice_paid") {
      return NextResponse.json({
        ok: true,
        ignored: true,
        event: payload.event || null,
      });
    }

    const buyer = payload.data?.buyer;

    if (!buyer?.email) {
      return NextResponse.json(
        {
          ok: false,
          error: "Webhook sem e-mail do comprador.",
        },
        { status: 400 },
      );
    }

    const email = buyer.email.trim().toLowerCase();
    const name = buyer.name?.trim() || "Cliente OrcaZap";

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
      include: {
        memberships: {
          include: {
            company: true,
          },
        },
      },
    });

    if (existingUser) {
      return NextResponse.json({
        ok: true,
        created: false,
        message: "Usuário já cadastrado.",
        userId: existingUser.id,
      });
    }

    const activationToken = crypto
      .randomBytes(32)
      .toString("hex");

    const activationExpiresAt = new Date(
      Date.now() + 48 * 60 * 60 * 1000,
    );

    const temporaryPasswordHash = await bcrypt.hash(
      crypto.randomBytes(32).toString("hex"),
      12,
    );

    const companyName =
      name || "Minha empresa";

    const result = await db.$transaction(
      async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            name,
            passwordHash: temporaryPasswordHash,
            activationToken,
            activationExpiresAt,
          },
        });

        const company = await tx.company.create({
          data: {
            name: companyName,
            responsibleName: name,
            email,
            phone:
              buyer.phone ||
              buyer.cellphone ||
              buyer.phone2 ||
              null,
            whatsapp:
              buyer.cellphone ||
              buyer.phone ||
              buyer.phone2 ||
              null,
            address:
              buyer.address?.street || null,
            addressNumber:
              buyer.address?.number || null,
            addressComplement:
              buyer.address?.complement || null,
            neighborhood:
              buyer.address?.neighborhood || null,
            city:
              buyer.address?.city || null,
            state:
              buyer.address?.state || null,
            zipCode:
              buyer.address?.zipCode || null,
          },
        });

        const membership =
          await tx.companyMember.create({
            data: {
              companyId: company.id,
              userId: user.id,
              role: "OWNER",
            },
          });

        return {
          user,
          company,
          membership,
        };
      },
    );

    const activationUrl =
      `${process.env.NEXT_PUBLIC_APP_URL || "https://orcazap.mydigitalbox.online"}` +
      `/ativar?token=${activationToken}`;

    console.log("Novo cliente criado via Eduzz:", {
      userId: result.user.id,
      companyId: result.company.id,
      email,
      activationUrl,
      invoiceId: payload.data?.id || null,
      offer: payload.data?.offer?.name || null,
      paidValue: payload.data?.paid?.value || null,
    });

    return NextResponse.json({
      ok: true,
      created: true,
      userId: result.user.id,
      companyId: result.company.id,
      activationUrl,
    });
  } catch (error) {
    console.error(
      "Erro ao processar webhook da Eduzz:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível processar o webhook.",
      },
      { status: 500 },
    );
  }
}