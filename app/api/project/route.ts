import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
) {
  const body = await req.json() 
  const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);

  await db.project.create({
    data: {
      name: body.name,
      ownerId: user.id,
    },
  });

  return new Response('{}', {}); 

}