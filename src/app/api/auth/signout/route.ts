import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST() {
    deleteSession();
    return new NextResponse(null, { status: 204 });
}