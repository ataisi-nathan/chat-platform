import { NextRequest, NextResponse } from 'next/server';
import { parsePdfBuffer } from '@/lib/parse-pdf'; // Import the new pdf2json helper

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use pdf2json helper instead of pdf-parse
    const extractedText = await parsePdfBuffer(buffer);

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF.' },
        { status: 400 }
      );
    }

    const ingestRes = await fetch(`${req.nextUrl.origin}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        textContent: extractedText,
        documentName: file.name,
      }),
    });

    const ingestData = await ingestRes.json();

    if (!ingestRes.ok) {
      throw new Error(ingestData.error || 'Failed to ingest document.');
    }

    return NextResponse.json({
      success: true,
      documentName: file.name,
      chunkCount: ingestData.count,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}