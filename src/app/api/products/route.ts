// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Products from '@/models/Product';

export async function GET() {
    await connect();
    const products = await Products.find({});
    return NextResponse.json({ products });
}