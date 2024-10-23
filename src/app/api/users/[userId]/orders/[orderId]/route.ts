import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User, { Order, OrderItem } from '@/models/User';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: { userId: string, orderId: string } }) {
    await connect();

    const { userId, orderId } = params;

    // Проверка на корректность ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(orderId)) {
        return NextResponse.json({ error: 'Invalid user ID or order ID' }, { status: 400 });
    }

    // Поиск пользователя по ID
    const user = await User.findById(userId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Поиск заказа в списке заказов пользователя
    const order = user.orders.find((o: Order) => o._id.toString() === orderId);

    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Подготовка данных для ответа
    const populatedOrderItems = await Promise.all(order.orderItems.map(async (item: OrderItem) => {
        // Здесь явно используем Product, чтобы ESLint видел его использование
        const productDetails = await Product.findById(item.product).lean();
        if (!productDetails) {
            console.warn(`Product with ID ${item.product} not found`);
        }
        return {
            product: productDetails,
            qty: item.qty,
            price: item.price
        };
    }));

    // Возвращаем информацию о заказе с детализированными данными о продуктах
    return NextResponse.json({
        _id: order._id,
        address: order.address,
        date: order.date,
        cardHolder: order.cardHolder,
        cardNumber: order.cardNumber,
        orderItems: populatedOrderItems
    });
}

export async function DELETE(request: NextRequest, { params }: { params: {userId: string, orderId: string}}) {
    await connect();

    const { userId, orderId } = params;

    // Проверка на корректность ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(orderId)) {
        return NextResponse.json({ error: 'Invalid user ID or order ID' }, { status: 400 });
    }

    // Поиск пользователя по ID
    const user = await User.findById(userId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Поиск заказа в списке заказов пользователя
    const orderIndex = user.orders.findIndex((o: Order) => o._id.toString() === orderId);
    if (orderIndex === -1) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Удаление заказа из списка
    user.orders.splice(orderIndex, 1);

    // Сохранение изменений
    await user.save();

    return NextResponse.json({ message: 'Order deleted successfully' });
}