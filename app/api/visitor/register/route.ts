import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { visitorId } = await req.json();

    if (!visitorId || typeof visitorId !== 'string') {
      return NextResponse.json(
        { error: 'visitorId is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('visitors')
      .upsert(
        {
          visitor_name: visitorId,
          last_activity: new Date().toISOString(),
        },
        {
          onConflict: 'visitor_name',
        }
      )
      .select();

    if (error) {
      console.error('Supabase visitor error:', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error('Visitor registration error:', err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}