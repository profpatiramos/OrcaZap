import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "orcazap_session";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await db.session.findUnique({
    where: {
      token,
    },
    include: {
      user: {
        include: {
          memberships: {
            include: {
              company: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await db.session.delete({
      where: {
        id: session.id,
      },
    });

    return null;
  }

  return session.user;
}

export async function getCurrentCompany() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const membership = user.memberships[0];

  if (!membership) {
    return null;
  }

  return membership.company;
}