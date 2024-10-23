// src/lib/mongoose.ts
import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env.local');
}

interface MongooseCache {
    conn: Connection | null;
    promise: Promise<Connection> | null;
}

let cached: MongooseCache = global.mongoose as MongooseCache;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => {
            console.log('Подключение к базе данных установлено');
            return mongoose.connection; // Возвращаем подключение к базе данных
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connect;