import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

// Set your Appwrite project details
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database and Collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTIONS = {
    USERS: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    TRADING_GOALS: import.meta.env.VITE_APPWRITE_GOALS_COLLECTION_ID,
    TRADING_ENTRIES: import.meta.env.VITE_APPWRITE_ENTRIES_COLLECTION_ID,
    TRADING_PLANS: import.meta.env.VITE_APPWRITE_PLANS_COLLECTION_ID,
    SUBSCRIPTIONS: import.meta.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID,
};

export default client;
