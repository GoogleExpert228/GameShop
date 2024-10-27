import { NextRequest, NextResponse } from 'next/server';
import { checkCredentials } from '@/lib/handlers';
import { createSession } from '@/lib/auth';


export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    // Проверка на отсутствие email или password
    if (!email || !password) {
        return NextResponse.json({ error: 'Missing email or password!' }, { status: 400 });
    }

    const userId = await checkCredentials(email, password);

    // Проверка на недействительные учетные данные
    if (!userId) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 }); // Статус 401 - Unauthorized
    }

    await createSession({ userId: userId?._id.toString() });

    return NextResponse.json({ message: "Signed in successfully" }, { status: 201 });
}