import { NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const authorId = searchParams.get('authorId') || undefined;
    const authorHandle = searchParams.get('authorHandle') || undefined;

    const posts = getPosts({ filter, tag, authorId, authorHandle });
    return NextResponse.json({ success: true, count: posts.length, posts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.content && !data.mediaUrl && !data.poll && !data.codeSnippet) {
      return NextResponse.json({ error: 'Post must contain text, media, poll, or code' }, { status: 400 });
    }

    // Auto extract hashtags from content if any
    const hashtagRegex = /#(\w+)/g;
    const matches = data.content?.match(hashtagRegex) || [];
    const extractedTags = matches.map((m: string) => m.replace('#', ''));
    const finalTags = Array.from(new Set([...(data.tags || []), ...extractedTags]));

    const newPost = createPost({
      ...data,
      tags: finalTags
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create post' }, { status: 500 });
  }
}
