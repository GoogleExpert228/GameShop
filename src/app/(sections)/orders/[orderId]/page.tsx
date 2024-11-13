import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { getOrder } from '@/lib/handlers';

export default async function OrderDetails({ params }: { params: { orderId: string } }) {
    const session = await getSession();

    if (!session || !session.userId) {
        console.error('No valid session found or missing userId in session.');
        notFound();
    }

    const { orderId } = params;

    try {
        console.log('Fetching order with ID:', orderId);
        const order = await getOrder(session.userId, orderId);

        if (!order) {
            console.error('Order not found or invalid data:', order);
            notFound();
        }

        return (
            <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-md rounded-md">
                <h1 className="text-4xl font-bold text-center mb-8">Order Details</h1>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold">Order ID: {order._id.toString()}</h2>
                    <p className="text-gray-500">Placed on: {new Date(order.date).toLocaleDateString()}</p>
                    <p className="text-gray-500">Shipping Address: {order.address}</p>
                </div>

                <h3 className="text-2xl font-semibold mb-4">Order Items</h3>
                <ul className="space-y-4 text-lg">
                    {order.orderItems.map(item => (
                        <li key={item.product.toString()} className="flex justify-between border-b pb-2">
                            <div className="flex space-x-4">
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-gray-500">{item.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span>{item.qty} × {item.price.toFixed(2)} €</span>
                                <span className="text-gray-500">Total: {(item.qty * item.price).toFixed(2)} €</span>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
                    <div className="bg-gray-100 p-4 rounded-md space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Subtotal:</span>
                            <span>
                                {order.orderItems
                                    .reduce((sum, item) => sum + item.qty * item.price, 0)
                                    .toFixed(2)}{' '} €
                            </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold">
                                {order.orderItems
                                    .reduce((sum, item) => sum + item.qty * item.price, 0)
                                    .toFixed(2)}{' '} €
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching order:', error);
        notFound();
    }
}

/*
{
  "userId": "671d735d5a34337e9a796832",  // ID пользователя (можно получить из сессии или куки)
  "address": "123 Main Street, Apt 4B",
  "cardHolder": "John Doe",
  "cardNumber": "1234567812345678",
  "orderItems": [
    {
      "product": "670ce0ec7dae8b40b6dc377d",
      "name":  "Game 1",
      "price": 29.99,
      "img": "https://store-images.s-microsoft.com/image/apps.808.14492077886571533.be42f4bd-887b-4430-8ed0-622341b4d2b0.c8274c53-105e-478b-9f4b-41b8088210a3?q=90&w=256&h=384&mode=crop&format=jpg&background=%23FFFFFF",
      "description": "Exciting adventure game.",
      "qty": 2
    },
    {
      "product": "670ce0ec7dae8b40b6dc377e",  // ID продукта "Game 2"
      "name": "Game 2",
      "price": 49.99,
      "img": "https://image.api.playstation.com/gs2-sec/appkgo/prod/CUSA08519_00/12/i_3da1cf7c41dc7652f9b639e1680d96436773658668c7dc3930c441291095713b/i/icon0.png",
      "description": "A thrilling action game",
      "qty": 1
    }
  ]
}
*/