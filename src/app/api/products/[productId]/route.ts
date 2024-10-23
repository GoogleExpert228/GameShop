// src/app/api/products/[productId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Products from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
    await connect();

    const { productId } = params;

    // Проверяем, является ли ID корректным ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Ищем продукт по ID
    const product = await Products.findById(productId);

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
}