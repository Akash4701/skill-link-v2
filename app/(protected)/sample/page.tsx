import { auth } from "@/auth";
import { db } from "@/lib/db";

import { PostCreateButton } from "@/components/post-create-button";
import { PostItem } from "@/components/post-item";
import React from "react";


export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  const posts = await db.post.findMany({
    where: {
      authorId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  console.log(posts);
  return (
    <div>
      <PostCreateButton />

      <div>
        {posts?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <>
            <h1>No posts created</h1>
            <p>`You don&apos;t have any posts yet. Start creating content.`</p>
          </>
        )}
      </div>
     
    </div>
  );
}
