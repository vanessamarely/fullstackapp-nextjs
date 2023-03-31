import { comparePasswords, createJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request) {
  const body = await req.json();
  const user = await db.user.findUnique({
    where: {
      email: body.email,
    },
  });

  const isUser = await comparePasswords(body.password, user?.password);

  if (isUser) {
    const jwt = await createJWT(user);

    return new Response("{}", {
      status: 201,
      headers: {
        "Set-Cookie":
          serialize(process.env.COOKIE_NAME?? '', jwt, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          })
        
      }
    });
  }
 
  return new Response("{}", {
    status: 401,
  });
}
