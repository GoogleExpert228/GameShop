import bcrypt from 'bcrypt';
import User, { Order, OrderItem } from '@/models/User';
import { Types } from 'mongoose';
import connect from '@/lib/mongoose';
import Products from '@/models/Product';
import Product from '@/models/Product';
import mongoose from 'mongoose';


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

export async function getProduct(productId: string) {
    try {
        const productObjectId = new mongoose.Types.ObjectId(productId);

        // Ищем продукт по его ObjectId
        const product = await Product.findById(productObjectId).exec();

        if (!product) {
        throw new Error('Product not found');
        }

        return product; // Возвращаем найденный продукт
    } catch(error) {
        console.error('Error fetching product:', error);
        throw new Error('Unable to fetch product');
    }
}

export const getCartItems = async (userId: string) => {
    try {
      // Ищем пользователя по userId
      const user = await User.findById(userId)
        .populate('cart.product')  // Наполняем данные о продукте в корзине
        .exec();
  
      if (!user) {
        return null; // Если пользователь не найден, возвращаем null
      }
  
      // Возвращаем данные корзины
      return { cartItems: user.cart };
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw new Error('Unable to fetch cart items');
    }
  };

  export async function getUser(userId: string) {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Ищем пользователя по его ObjectId, используя модель User
        const user = await User.findById(userObjectId).exec();

        if (!user) {
            throw new Error('User not found');
        }

        return user; // Возвращаем найденного пользователя
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Unable to fetch user');
    }
}

export async function getOrder(userId: string, orderId: string): Promise<Order> {
    try {
        // Ищем пользователя по ID и извлекаем заказы
        const user = await User.findById(userId).select('orders').exec();

        if (!user) {
            throw new Error('User not found');
        }

        // Находим заказ в массиве `orders`
        const order = user.orders.find((order: Order) => order._id.toString() === orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        return {
            _id: order._id,
            address: order.address,
            date: order.date,
            cardHolder: order.cardHolder,
            cardNumber: order.cardNumber,
            orderItems: order.orderItems.map((item: OrderItem) => ({
                product: item.product,
                name: item.name,
                price: item.price,
                img: item.img,
                description: item.description,
                qty: item.qty,
            })),
        };
    } catch (error) {
        console.error('Error fetching order:', error);
        throw new Error('Unable to fetch order');
    }
}
