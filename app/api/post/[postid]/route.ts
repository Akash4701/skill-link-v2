
import * as z from "zod"

import { db } from "@/lib/db"
import { PostValidator } from "@/lib/post"

const routeContextSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context:any
) {
  try {
     console.log(context)
    const { params } = context
  console.log(params)
    await db.post.delete({
      where: {
        id: params.postid as string,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: any
) {
  try {
    
    const { params } = context
  
    const json = await req.json()
    const body = PostValidator.parse(json)
 
    // Update the post.
    // TODO: Implement sanitization for content.
   
    await db.post.update({
      where: {
        id: params.postid,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}


