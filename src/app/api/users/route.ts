import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose'; // Путь к вашему файлу подключения
import User from '@/models/User'; // Импорт модели пользователя
import bcrypt from 'bcryptjs'; // Библиотека для хэширования паролей

export async function GET() {
    await connect();

    const users = await User.find({}, '-password'); // Исключаем поле пароля из ответа
    return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
    await connect();

    const { email, password, name, surname, address, birthdate } = await request.json();

    // Проверка на существование пользователя с таким же email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Хэшируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем нового пользователя
    const newUser = new User({
        email,
        password: hashedPassword,
        name,
        surname,
        address,
        birthdate,
        cart: [],
    });

    await newUser.save();

    // Возвращаем информацию о созданном пользователе (без пароля)
    return NextResponse.json({
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        surname: newUser.surname,
        address: newUser.address,
        birthdate: newUser.birthdate,
        createdAt: newUser.createdAt
    }, { status: 201 });
}