import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
    await connect();

    const { userId } = params;

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