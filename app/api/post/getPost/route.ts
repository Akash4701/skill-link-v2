
import * as z from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"

const postCreateSchema = z.object({
  title: z.string(),
  content: z.any(),
})

export async function GET() {
  try {
 const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const posts = await db.post.findMany({
      select: {
        id: true,
        title: true,
        published: true,
        content:true,
        authorId:true,
        votes:true,
        createdAt: true,
      }
      
    })
  
    return new Response(JSON.stringify(posts))
    
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

