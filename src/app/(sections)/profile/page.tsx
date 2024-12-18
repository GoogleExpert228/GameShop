import { getSession } from '@/lib/auth'; 
import { notFound } from 'next/navigation';
import { getUser } from '@/lib/handlers';
import { Order, OrderItem } from '@/models/User'; // Импортируем тип Order 
import Link from 'next/link';

export default async function Profile() {
    // Используем метод getSession для получения userId
    const session = await getSession();

    if (!session || !session.userId) {
        console.error('No valid session found or missing userId in session.');
        notFound();
    }

    const userId = session.userId;

    try {
        console.log('Fetching user with ID from session:', userId);
        const user = await getUser(userId);

        if (!user || !user.name || !user.surname) {
            console.error('User not found or invalid data:', user);
            notFound();
        }

        // Функция для вычисления общей суммы заказа
        const calculateTotalPrice = (orderItems: OrderItem[]) => {
            return orderItems.reduce((total, item) => total + item.price * item.qty, 0);
        };

        return (
            <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-md rounded-md">
                <h1 className="text-4xl font-bold text-center mb-8">User Profile</h1>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold">
                        {user.name} {user.surname}
                    </h2>
                    <p className="text-gray-500">User Information</p>
                </div>

                <ul className="space-y-4 text-lg">
                    <li className="flex justify-between border-b pb-2">
                        <span className="font-medium">Email:</span>
                        <span>{user.email}</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                        <span className="font-medium">Address:</span>
                        <span>{user.address}</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                        <span className="font-medium">Birth Date:</span>
                        <span>{user.birthdate.toLocaleDateString()}</span>
                    </li>
                </ul>

                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-4">User Orders</h3>
                    {user.orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Information</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.orders.map((order: Order) => (
                                        <tr key={order._id.toString()} className="border-b">
                                            <td className="px-6 py-4 text-sm text-gray-800">{order._id.toString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{order.address}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                <p>Card Holder: {order.cardHolder}</p>
                                                <p>Card Number: {order.cardNumber.slice(-4)}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                ${calculateTotalPrice(order.orderItems).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                <Link href={`/orders/${order._id}`} className="text-blue-500 hover:underline">
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 italic">No orders available</p>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching user:', error);
        notFound();
    }

    //some comments
}