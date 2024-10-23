// db/seeder.ts
import mongoose from 'mongoose';
import Products from '@/models/Product';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.local` });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
}

async function seed() {
    await mongoose.connect(MONGODB_URI!);
    console.log('Подключение к базе данных установлено');

    await Products.deleteMany({});
    const products = [
        { name: 'Game 1', price: 29.99, img: '/img/game1.jpg', description: 'Exciting adventure game.' },
        { name: 'Game 2', price: 49.99, img: '/img/game2.jpg', description: 'A thrilling action game.' },
        { name: 'Game 3', price: 19.99, img: '/img/game3.jpg', description: 'A fun puzzle game for everyone.' }
    ];

    await Products.insertMany(products);
    console.log('Successful adding of test data!');
    mongoose.connection.close();
}

seed().catch((err) => {
    console.error('Error while adding data:', err);
    mongoose.connection.close();
});