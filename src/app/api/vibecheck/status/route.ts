import { NextResponse } from 'next/server';
import type { SystemStatusResponse } from '@/types/vibecheck';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.trim().length > 0);
  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

  const status: SystemStatusResponse = {
    configured: isConfigured,
    model: isConfigured ? model : 'Not configured (Set GEMINI_API_KEY)',
    maxPayloadBytes: 4 * 1024 * 1024, // 4MB
  };

  return NextResponse.json(status);
}
