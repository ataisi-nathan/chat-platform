import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const userMessage = body.message || 'Hello';

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json({
    reply: `[Mock Route] Received: "${userMessage}". This response is generated locally by Next.js!`,
  });
}