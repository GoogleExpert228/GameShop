// src/models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface Product extends Document {
    name: string;
    price: number;
    img: string;
    description: string;
}

const ProductSchema = new Schema<Product>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
});

export default mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);