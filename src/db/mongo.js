import { MONGO } from '$env/static/private';
import { MongoClient } from 'mongodb';

const client = new MongoClient(MONGO);

// connect to the database
export const connect = async () => {
    await client.connect();
}

// disconnect from the database
export const disconnect = async () => {
    await client.close();
}

// get the database
export const getDB = () => {
    return client.db();
}