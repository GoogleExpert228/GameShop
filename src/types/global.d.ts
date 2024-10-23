import mongoose from 'mongoose';

/* eslint-disable no-var */
declare global {
    var mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
    };
}
/* eslint-enable no-var */