import { NextRequest, NextResponse } from "next/server";
import connect from '@/lib/mongoose';
import User, {CartItem} from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: { userId: string, productId: string } }) {
    await connect();

    const { userId, productId } = params;

    // Проверка на корректность ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json({ error: 'Invalid user ID or product ID' }, { status: 400 });
    }

    // Поиск пользователя по ID
    const user = await User.findById(userId).select('cart'); // Получаем только поле cart

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Поиск товара в корзине
    const cartItem = user.cart.find((item: CartItem) => item.product.toString() === productId);

    if (!cartItem) {
        return NextResponse.json({ error: 'Product not found in the cart' }, { status: 404 });
    }

    // Возвращаем информацию о товаре в корзине
    return NextResponse.json({ cartItem });
}

export async function PUT(request: NextRequest, { params }: { params: { userId: string, productId: string } }) {
    await connect();

    const { userId, productId } = params;

    if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json({error: 'Invalid user ID or product ID'}, {status: 400});
    }

    const { qty } = await request.json();

    if (qty <= 0) {
        return NextResponse.json({ error: 'Quantity must be greater than zero' }, { status: 400 });
    }

    const user  = await User.findById(userId);

    if(!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

     // Поиск товара в корзине
     const existingCartItemIndex = user.cart.findIndex((item: CartItem) => item.product.toString() === productId);

     if (existingCartItemIndex === -1) {
         return NextResponse.json({ error: 'Product not found in the cart' }, { status: 404 });
     }
 
     // Обновление количества товара
     user.cart[existingCartItemIndex].qty = qty;
 
     // Сохранение изменений
     await user.save();
 
     return NextResponse.json({ message: 'Cart item updated successfully', cart: user.cart });
}

export async function DELETE(request: NextRequest, { params }: {params: {userId: string, productId: string} }) {
    await connect();

    const { userId, productId } = params;

    // Проверка на корректность ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json({ error: 'Invalid user ID or product ID' }, { status: 400 });
    }

    // Поиск пользователя по ID
    const user = await User.findById(userId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    //Поиск товара в магазине
    const existingCartItemIndex = user.cart.findIndex((item: CartItem) => item.product.toString() === productId);

    if(existingCartItemIndex === -1) {
        return NextResponse.json({error: "Product not found in the cart"}, {status: 404});
    }

    // Удаление товара из корзины
    user.cart.splice(existingCartItemIndex, 1);

    // Сохранение изменений
    await user.save();

    return NextResponse.json({ message: 'Cart item deleted successfully', cart: user.cart });
}