import mongoose, {Schema, Document} from "mongoose";

export interface OrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    img: string;
    description: string;
    qty: number;
}

export interface Order {
    _id: mongoose.Types.ObjectId;
    address: string;
    date: Date;
    cardHolder: string;
    cardNumber: string;
    orderItems: OrderItem[];
}

export interface CartItem {
    product: mongoose.Types.ObjectId; // Ссылка на продукт
    name: string;
    price: number;
    img: string;
    description: string;
    qty: number; // Количество
}

export interface User extends Document {
    email: string;
    password: string;
    name: string;
    surname: string;
    address: string;
    birthdate: Date;
    cart: CartItem[]; // Добавляем корзину
    orders: Order[];
}

const OrderSchema = new Schema<Order>({
    address: { type: String, required: true },
    date: { type: Date, default: Date.now },
    cardHolder: { type: String, required: true },
    cardNumber: { type: String, required: true },
    orderItems: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        img: { type: String, required: true },
        description: { type: String, required: true },
        qty: { type: Number, required: true },
    }]
});

const UserSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    address: { type: String, required: true },
    birthdate: { type: Date, required: true },
    cart: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        img: { type: String, required: true },
        description: { type: String, required: true },
        qty: { type: Number, required: true },
    }],
    orders: [OrderSchema]
});


export default mongoose.models.User || mongoose.model<User>('User', UserSchema);
