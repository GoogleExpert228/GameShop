import {NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User, { CartItem } from '@/models/User';
import mongoose from 'mongoose';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { userId: string} } ) {
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
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({error: 'Invalid User ID'}, {status: 400});
    }

    const user = await User.findById(userId).select('orders');

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Возвращаем список заказов пользователя
    return NextResponse.json({ orders: user.orders });
}

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
    await connect();

    const { userId } = params;

    // Проверка на корректность ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Получение данных для создания заказа
    const { address, cardHolder, cardNumber } = await request.json();

    // Проверка обязательных полей
    if (!address || !cardHolder || !cardNumber) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Поиск пользователя по ID
    const user = await User.findById(userId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Проверка, есть ли товары в корзине
    if (user.cart.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Создание нового заказа из товаров в корзине
    const newOrder = {
        _id: new mongoose.Types.ObjectId(),
        address,
        date: new Date(),
        cardHolder,
        cardNumber,
        orderItems: user.cart.map((item: CartItem) => ({
            product: item.product,
            name: item.name,
            price: item.price,
            img: item.img,
            description: item.description,
            qty: item.qty
        }))
    };

    // Добавление заказа в список заказов пользователя
    user.orders.push(newOrder);

    // Очистка корзины пользователя
    user.cart = [];

    // Сохранение пользователя с новым заказом и пустой корзиной
    await user.save();

    return NextResponse.json({ message: 'Order created successfully', order: newOrder });
}