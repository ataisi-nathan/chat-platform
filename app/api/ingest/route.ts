import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

// Lazy client instantiation helper to avoid top-level module evaluation crashes
function getClients() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY).');
  }

  if (!openaiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable.');
  }

  const openai = new OpenAI({ apiKey: openaiKey });
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  return { openai, supabase };
}

export async function POST(req: NextRequest) {
  try {
    const { openai, supabase } = getClients();

    const { textContent, documentName } = await req.json();

    if (!textContent) {
      return NextResponse.json({ error: 'No text content provided' }, { status: 400 });
    }

    // Process embeddings and save to Supabase...
    // ...

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Ingestion Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}