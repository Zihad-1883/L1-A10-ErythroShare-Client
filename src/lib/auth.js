import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.MONGODB_DB);

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            bloodGroup: { type: "string" },
            district: { type: "string" },
            upazila: { type: "string" },
            status: { type: "string", defaultValue: "active" },
            role: { type: "string", defaultValue: "donor" },
        }
    }
});