import bcrypt from 'bcrypt';
import User from '@/models/User';
import { Types } from 'mongoose';
import connect from '@/lib/mongoose';
import Products from '@/models/Product';

export interface CheckCredentialsResponse {
    _id: Types.ObjectId;
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

export async function checkCredentials(email: string, password: string): Promise<CheckCredentialsResponse | null> {
    const user = await User.findOne({ email });

    if(!user) {
        return null;
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match) {
        return null;
    }

    return {_id: user._id};
}

// Определение функции `getProducts` и ее экспорт
export async function getProducts() {
    await connect();
    const products = await Products.find().select('-__v'); 
    return { products };
}