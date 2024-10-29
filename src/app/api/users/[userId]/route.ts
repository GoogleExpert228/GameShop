import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import mongoose from 'mongoose';
import { getSession } from '@/lib/auth'; 

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
    await connect();

    const { userId } = params;

    // Получаем сессию и ждем её завершения
    const session = await getSession();

    // Проверка сессии
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.userId != userId) {
        return NextResponse.json({error: "Forbidden"}, {status: 403});
    }

    // Проверка на корректность ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Поиск пользователя по ID
    const user = await User.findById(userId).select('-password'); // Исключаем поле пароля

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}