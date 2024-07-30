import { NextRequest, NextResponse } from 'next/server';
import { createSession, getSession, updateSession } from '@/utils/sessionCache';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  const session = getSession(id);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json(session);
}

export async function POST(req: NextRequest) {
  const { levelId, moduleId, lessonId } = await req.json();
  const sessionId = createSession({ levelId, moduleId, lessonId, score: 0, time: 0 });
  return NextResponse.json({ sessionId }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  const { score, time } = await req.json();
  const session = getSession(id);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  updateSession(id, { ...session, score, time });
  return NextResponse.json({ message: 'Session updated' });
}
