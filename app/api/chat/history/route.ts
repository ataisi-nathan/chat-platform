import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const visitorSessionId = searchParams.get('visitorSessionId');

  if (!visitorSessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('messages')
    .select('id, sender, content, created_at')
    .eq('visitor_session_id', visitorSessionId)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data });
}