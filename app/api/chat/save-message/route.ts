import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { visitorSessionId, sender, content } = await req.json();

    if (!visitorSessionId || !sender || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Ensure visitor exists or update last_active timestamp
    await supabase.from('visitors').upsert(
      {
        visitor_session_id: visitorSessionId,
        last_active: new Date().toISOString(),
      },
      { onConflict: 'visitor_session_id' }
    );

    // 2. Insert message into messages table
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        visitor_session_id: visitorSessionId,
        sender,
        content,
      })
      .select()
      .single();

    if (messageError) {
      console.error('Database insert error:', messageError);
      return NextResponse.json({ error: messageError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: messageData });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}