// app/api/post/[id]/route.ts (or .js)
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '../../../../../lib/db';

const idSchema = z.string(); // Adjust validation as needed

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Validate the ID
    idSchema.parse(params.id);

    const post = await db.post.findFirst({
      select: {
        id: true,
        title: true,
        published: true,
        content: true,
        createdAt: true,
      },
      where: {
        id: params.id,
      },
    });

    if (post) {
      return NextResponse.json(post);
    } else {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
