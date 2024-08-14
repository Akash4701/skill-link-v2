import { notFound, redirect } from "next/navigation"
import { Post, User } from "@prisma/client"

import { auth } from "@/auth"
import { db } from "@/lib/db"

import { Editor } from "@/components/editor"

async function getPostForUser(postId: Post["id"], userId: User["id"]) {
  return await db.post.findFirst({
    where: {
      id: postId,
      authorId: userId,
    },
  })
}

interface EditorPageProps {
  params: { postId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const session = await auth();

 

  const post = await getPostForUser(params.postId, session.user.id)
  console.log(post?.content)
  if (!post) {
    notFound()
  }

  return (
    <Editor
      post={{
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
      }}
    />
  )
}
