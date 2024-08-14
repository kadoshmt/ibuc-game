import { NextRequest, NextResponse } from 'next/server';
import { createSession, getSession, updateSession, deleteSession } from '@/utils/sessionCache';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  const session = await getSession(id);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json(session);
}

export async function POST(req: NextRequest) {
  const { levelId, moduleId, lessonId } = await req.json();
  const sessionId = await createSession({ levelId, moduleId, lessonId, score: 0, time: 0 });
  return NextResponse.json({ sessionId }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  const { score, time } = await req.json();
  const session = await getSession(id);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  await updateSession(id, { score, time });
  return NextResponse.json({ message: 'Session updated' });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  const session = await getSession(id);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  await deleteSession(id);
  return NextResponse.json({ message: 'Session deleted' }, { status: 200 });
}
