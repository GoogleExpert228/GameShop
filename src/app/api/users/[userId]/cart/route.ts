// src/app/api/users/[userId]/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User, { CartItem } from '@/models/User'; // Импортируем CartItem
import mongoose from 'mongoose';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
    await connect();

    const { userId } = params;
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.userId !== params.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Проверка на корректность ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Поиск пользователя по ID и получение его корзины
    const user = await User.findById(userId).select('cart'); // Получаем только поле cart

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ cartItems: user.cart });
}

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
    await connect();

    const { userId } = params;

    // Проверка на корректность ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Ожидаем, что в запросе будет один объект cartItem
    const { cartItem } = await request.json();
    const { product, name, price, img, description, qty } = cartItem;

    // Проверка, что все обязательные поля переданы
    if (!product || !name || !price || !img || !description || !qty) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Преобразуем product в ObjectId
    const productId = new mongoose.Types.ObjectId(product);

    // Поиск пользователя по ID
    const user = await User.findById(userId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existingCartItemIndex = user.cart.findIndex((item: CartItem) => item.product.toString() === productId.toString());

    if (existingCartItemIndex > -1) {
        // Если товар уже есть в корзине, обновляем его количество
        user.cart[existingCartItemIndex].qty += qty;
    } else {
        // Если товара нет в корзине, добавляем его
        user.cart.push({ product: productId, name, price, img, description, qty });
    }

    await user.save(); // Сохраняем изменения в базе данных

    return NextResponse.json({ message: 'Product added to cart successfully', cart: user.cart });
}