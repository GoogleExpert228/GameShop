import { getSession } from '@/lib/auth'; // Пусть метод getSession остаётся без изменений
import { notFound } from 'next/navigation';
import { getUser } from '@/lib/handlers';

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
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-gray-600 italic">No orders available</p>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching user:', error);
        notFound();
    }
}