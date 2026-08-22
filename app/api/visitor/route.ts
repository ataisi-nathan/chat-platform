import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client with your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { visitorSessionId } = await req.json();

    if (!visitorSessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Upsert visitor: creates if new, updates last_active if existing
    const { data, error } = await supabase
      .from('visitors')
      .upsert(
        {
          visitor_session_id: visitorSessionId,
          last_active: new Date().toISOString(),
        },
        { onConflict: 'visitor_session_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, visitor: data });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}